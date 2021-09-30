const chalk = require('chalk');
const createFile = require('create-file');
const del = require('delete');
const dir = require('node-dir');
const execSync = require('child_process').execSync;
const fs = require('fs-extra');
const lineReader = require('line-reader');
const mv = require('mv');
const path = require('path');
const process = require('process');
const webpack = require('webpack');
const AdmZip = require('adm-zip');
const watch = require('node-watch');
const globToRegExp = require('glob-to-regexp');
const PathToExportName = require('./PathToExportName');
const timestamp = require('console-timestamp');
const toolUtils = require('../tool-utils');
const fail = toolUtils.fail;
const showError = toolUtils.showError;
const isDirectory = toolUtils.isDirectory;
const isFile = toolUtils.isFile;
const exec = toolUtils.exec;
let less = null;
let CSSJSON = null;
let shelljs = null;
try {
  less = require('less');
  CSSJSON = require('cssjson');
} catch(e) {
  console.log('Cannot find module \'less\'');
}
try {
  shelljs = require('shelljs');
} catch(e) {
  console.log('Cannot find module \'shelljs\'');
}
let instance;

class Bundler {

  constructor(bundlerArgs) {
    this.bundlerArgs = bundlerArgs;
    this.sBaseApplicationName = undefined;
    // provide access to 'this' in chained promise methods
    instance = this;
    if (bundlerArgs.applicationName()) {
      console.error('The application-name argument is deprecated and is no longer used. The app name is now obtained from the _Name property of the Application.app file.');
    }
  }

  // bundler properties
  /**
   * Returns the build locaation
   */
  get buildOutput() {
    return 'build.definitions';
  }

  /**
   * Returns the full build output path
   */
  get buildOutputPath() { // used by create-client
    return path.join(process.cwd(), instance.buildOutput);
  }

  /**
   * Returns the path to the location of the defintions to bundle
   */
  get clientDefinitionsPath() {
    const useEditorExport = !!instance.bundlerArgs.editorExport();
    return useEditorExport ? instance.exportedApplicationPath : instance.bundlerArgs.mdkBaseApplicationPath();
  }

  get exportedApplicationPath() {
    return path.join(process.cwd(), 'exported-application');
  }

  get uploadBundleContents() {
    return path.join(process.cwd(), 'uploadBundleContents');
  }

  // bundler public methods

  /**
   * This is the main entry point into the bundler functionality
   *
   * If this is an editor build unzip first before preceeding to
   * promise chain.
   *
   * Building is the result of a promise chaine that is defined as
   * the following:
   *
   * - Clone all definitions which now includes components
   * - Move the base application's Application.app to the root build folder
   * - Get a list of all the file paths required in this build
   * - Create an index file that's can be given to webpack to build bundle.js
   * - Update bundle.js depending on where it resides
   * - Clean up the build folder
   */
  buildClientDefinitions() {
    // Pass true to make this call verbose. Temp files aren't expected to exist at this time,
    // so the user should be informed if something is deleted.
    instance.cleanTempFiles(true);

    if (instance.bundlerArgs.editorExport()) {
      instance._unzipEditorExport();
    }

    return instance._assemble()
      .then(instance._createBundlerVersionFile)
      .then(instance._rootBaseApplication)
      .then(instance._generateBundleFiles)
      .then(instance._createAppIndexFile)
      .then(instance._buildApplicationBundle)
      .then(instance._replaceImport)
      .then(instance._updateBundle)
      .then(instance._watchMetadata)
      .then(() => { return instance.sBaseApplicationName; })
      .catch(error => {
        instance.cleanTempFiles();
        return Promise.reject(error);
      });
  }

  _watchMetadata() {
    if (!instance.bundlerArgs.shouldWatch()) {
      // used by create-client
      if (!instance.bundlerArgs.shouldCleanTempFiles || instance.bundlerArgs.shouldCleanTempFiles()) {
        instance.cleanTempFiles();
      }

      return;
    }

    // watch metadata folder if 'bundle-target-path' isn't specified.
    if (instance.bundlerArgs.bundleTargetPath() == undefined) {
      const mdkBaseApplicationPath = instance.clientDefinitionsPath;
      if (mdkBaseApplicationPath) {
        const DestPath = `${path.join(process.cwd(), 'build.definitions')}/${instance.sBaseApplicationName}`;
        instance._watchFiles(mdkBaseApplicationPath, DestPath,
          (filePath) => {
          const watchFoldersGlobs = [
            mdkBaseApplicationPath + "/Application.app",
            mdkBaseApplicationPath + "/*.cim",
            mdkBaseApplicationPath + "/Actions/**/*.action",
            mdkBaseApplicationPath + "/Pages/**/*.page",
            mdkBaseApplicationPath + "/Rules/**/*.js",
            mdkBaseApplicationPath + "/Services/**/*.service",
            mdkBaseApplicationPath + "/Globals/**/*.global",
            mdkBaseApplicationPath + "/Style/**/*.css",
            mdkBaseApplicationPath + "/i18n/*.properties"
          ];
          // Return true if the path matches any of the globs in watchFolders.
          return watchFoldersGlobs.some(glob => {
            return globToRegExp(glob, {globstar: true}).test(filePath);
          });
        });
      }
    }

    // copy bundle.js and bundle.js.map to target path
    fs.watchFile(path.join(process.cwd(), 'bundle.js'), function() {
      instance._updateBundle();
    });

  }

  _watchFiles(sWatchPath, sTargetPath, fnShouldTriggerBuild) {
    watch(sWatchPath, { recursive: true }, function (event, filePath) {
      if (typeof filePath === "string" && fnShouldTriggerBuild(filePath)) {
        console.log(chalk.cyan('MDK Bundler - File change detected: ') + chalk.white(filePath));
        const subPath = filePath.substr(sWatchPath.length);
        shelljs.cp('-r', filePath, path.join(sTargetPath, subPath));
      }
    });
  }

  /**
   * Cleans the build output
   */
  cleanBuild() {
    return Promise.resolve()
    .then(this._cleanProjectIndex)
    .then(this._cleanBuildOutput);
  }

  /**
   * Returns the definition source path for the sepcified component
   *
   * instance.clientDefinitionsPath + component.ProjectName
   *
   * @param {object} component
   */
  componentSourcePath(component) {
    let segments = instance.clientDefinitionsPath.split(path.sep);
    if (!instance.bundlerArgs.editorExport()) {
      // pop the base application name
      segments.pop();
    }

    // construct project path and component path
    if (component.ProjectName && segments[segments.length-1] !== component.ProjectName) {
      segments.push(component.ProjectName);
    }
    let sComponentProjectPath = segments.length > 0 ? segments.join(path.sep) : "";

    if (component.ApplicationName && component.ProjectName !== component.ApplicationName) {
      segments.push(component.ApplicationName);
    }
    let sComponentApplicationPath = segments.length > 0 ? segments.join(path.sep) : "";

    if (fs.existsSync(sComponentProjectPath)) {
      if (fs.existsSync(path.join(sComponentProjectPath, 'Application.app'))) {
        return sComponentProjectPath;
      } else {
        if (fs.existsSync(sComponentApplicationPath)) {
          if (fs.existsSync(path.join(sComponentApplicationPath, 'Application.app'))) {
            return sComponentApplicationPath;
          } else {
            throw new Error('Cannot find component app at ' + sComponentApplicationPath);
          }
        } else {
          throw new Error('parsed component application path at ' + sComponentProjectPath + " is invalid");
        }
      }
    } else {
      throw new Error('parsed component project path at ' + sComponentProjectPath + ' is invalid');
    }
  }

  createUploadBundle() {
    fs.mkdirSync(instance.uploadBundleContents);
    const bundlePath = path.join(process.cwd(), 'bundle.js');
    if (!fs.existsSync(bundlePath)) {
      throw new Error('Cannot find bundle file at ' + bundlePath);
    }
    fs.copySync(bundlePath, path.join(instance.uploadBundleContents, 'bundle.js'));
    if (instance.bundlerArgs.devtool()) {
      const bundleSourceMapPath = path.join(process.cwd(), 'bundle.js.map');
      if (!fs.existsSync(bundleSourceMapPath)) {
        throw new Error('Cannot find bundle source map file at ' + bundleSourceMapPath);
      }
      fs.copySync(bundleSourceMapPath, path.join(instance.uploadBundleContents, 'bundle.js.map'));
    }
    const webpackContentPathDirectory = path.join(instance.clientDefinitionsPath, '.che');
    const webpackContentPath = path.join(webpackContentPathDirectory, 'project.json');
    const deprecatedWebpackContentPath = path.join(instance.clientDefinitionsPath, '.project.json');
    let webpackContentFound = false;
    if (fs.existsSync(webpackContentPath)) {
      webpackContentFound = true;
      fs.copySync(webpackContentPathDirectory, path.join(instance.uploadBundleContents, '.che'));
    }
    if (fs.existsSync(deprecatedWebpackContentPath)) {
      webpackContentFound = true;
      fs.copySync(deprecatedWebpackContentPath, path.join(instance.uploadBundleContents, '.project.json'));
    }
    if (!webpackContentFound) {
      throw new Error('Cannot find webpack content file at ' + webpackContentPath + ' or ' + deprecatedWebpackContentPath + '. It must be in one of these locations for the upload to succeed.');
    }
    const zipPath = path.join(process.cwd(), 'uploadBundle.zip');
    if (process.platform === 'win32') {
      var zip = new AdmZip();
      zip.addLocalFolder(instance.uploadBundleContents);
      zip.writeZip('./uploadBundle.zip');
    } else {
      execSync('cd ' + instance.uploadBundleContents + ' && zip -r ../uploadBundle.zip .');
    }
    console.log(chalk.cyan('MDK Bundler - archived files into ') + chalk.white(zipPath));
  }

  /**
   *
   */
  updateClientDefinitions() {
    let sTargetPath = path.join(instance.bundlerArgs.nativeScriptProjectPath(), instance.bundlerArgs.bundleName());
    instance.copyBundleResults(sTargetPath, true);

    if (instance.bundlerArgs.bundleTargetPath()) {
      sTargetPath = path.join(instance.bundlerArgs.bundleTargetPath(), instance.bundlerArgs.bundleName());
      instance.copyBundleResults(sTargetPath, false);
    }
  }

  copyBundleResults(sTargetPath, bVerbose) {
    if (bVerbose) {
      console.log(chalk.cyan('MDK Bundler - ') + chalk. gray('replacing ') + chalk.white(sTargetPath));
    }
    fs.copySync(instance.bundlerArgs.bundleName(), sTargetPath);
    const sSourceMapSourcePath = instance.bundlerArgs.bundleName() + '.map';
    if (fs.existsSync(sSourceMapSourcePath)) {
      const sSourceMapTargetPath = sTargetPath + '.map';
      if (bVerbose) {
        console.log(chalk.cyan('MDK Bundler - ') + chalk. gray('replacing ') + chalk.white(sSourceMapTargetPath));
      }
      fs.copySync(sSourceMapSourcePath, sSourceMapTargetPath);
    }
  }

  // bundler private methods

  /**
   * Returns the value of the _Name property from the Application.app file
   * if exists.
   *
   * @param {string} sSourcePath - path to folder containing Application.app
   */
  _appNameFromAppFile(sSourcePath) {
    const sApplicationAppPath = path.join(sSourcePath, 'Application.app');
    console.log(chalk.cyan('MDK Bundler - ') + chalk.gray('resolving application @path ') + chalk.white(sSourcePath));
    if (isFile(sApplicationAppPath)) {
      let oApplicationAppJson;
      try {
        oApplicationAppJson = fs.readJsonSync(sApplicationAppPath);
      } catch (e) {
        console.log(e);
      }
      if (!oApplicationAppJson) {
        fail(`Could not parse ${sApplicationAppPath}`);
      }
      if (!oApplicationAppJson._Name) {
        fail(`_Name property not found in ${sApplicationAppPath}`);
      }
      console.log(chalk.cyan('MDK Bundler - ') + chalk.gray('found application ') + chalk.white(`'${oApplicationAppJson._Name}'`));
      return oApplicationAppJson._Name;
    }

    // file not found - abort
    fail(`File ${sApplicationAppPath} does not exist`);
  }

  /**
   * Assemble a single application and one ore more components. Recursively
   * process the component as a base application.
   *
   * @param {string} sApplicationName - application name from _Name property
   * @param {string} sSourcePath - definition path
   * @param {string} sTargetPath - path to
   * @param {array} cloneables - current list of cloneables
   */
  _assembleApplication(sApplicationName, sSourcePath, sTargetPath, cloneables) {
    cloneables = cloneables || [];
    let componentQueue = [];
    // first add a cloneable for this parent application
    let baseCloneable = instance._toCloneable(sApplicationName, sSourcePath, sTargetPath);
    cloneables.push(baseCloneable);
    return instance._readComponentIntegrationFiles(baseCloneable.sSourcePath)
    .then((aComponentIntegrations) => {
      return instance._componentToCloneable(baseCloneable, aComponentIntegrations);
    }).then((aComponentCloneables) => {
      return this._assembleComponents(aComponentCloneables, componentQueue, cloneables).then(() => {
        return cloneables;
      });
    });
  }

  /**
   * Entry point for applicaton assembly.  Start by assemblying the base
   * application, then assemble any components that may exist.
   *
   * Determines base application and then call _assembleApplication to perform
   * recursive clone.
   */
  _assemble() {
    instance.sBaseApplicationName = instance._appNameFromAppFile(instance.clientDefinitionsPath);
    const sSourcePath = instance.clientDefinitionsPath;
    return instance._assembleApplication(instance.sBaseApplicationName, sSourcePath, instance.buildOutputPath)
    .then(instance._createBuildOutput)
    .then(instance._compileStyleFile);
  }

    /**
   * Maintains a queue of components by adding any new components in aComponents
   * Then processes the next component in the queue by calling
   * _assembleApplication to process that application's components.
   *
   * @param {object[]} aComponents
   * @param {object[]} componentQueue
   * @param {object[]} cloneables
   */
  _assembleComponents(aComponents, componentQueue, cloneables) {
    // first
    aComponents.forEach((oComponent) => {
      componentQueue.push(oComponent);
    });

    if (componentQueue.length > 0) {
      let promises = componentQueue.map((oComponent) => {
        return instance._assembleApplication(oComponent.sApplicationName, oComponent.sSourcePath, oComponent.sTargetPath, cloneables);
      });

      return Promise.all(promises);
    }

    return Promise.resolve();
  }

  /**
   * Returns the content of application-index.js in the form of
   *
   * Require statement
   * "let application_app = require('./Application.app');"
   * // additional require statements may follow
   *
   * Import statement:
   * "module.exports = {"
   *     application_app : application_app,"
   *    // additional export statements may follow
   * "}"
   *
   * @param {array} aBundleFiles
   */
  _buildAppIndexContent(aBundleFiles) {
    const aExports = instance._buildExportObjects(aBundleFiles);
    const duplicates = instance._filterDuplicateNames(aExports);
    // fail if duplicate names are detected
    if (duplicates.length > 0) {
      throw new Error(`Create bundle failure - duplicate names detected: ${duplicates[0]}`);
    }

    let aModifiedExports = aExports;
    let aMappings = [];
    return instance._getIntegrationTargetSourceMappings(instance.clientDefinitionsPath, aMappings).then(() => {
      let sourceTargetMap = {};
      aMappings.forEach(oMapping => {
        let sSource = PathToExportName.pathToExportName(oMapping.Source, true);
        let sTarget = PathToExportName.pathToExportName(oMapping.Target, true);
        sourceTargetMap[sTarget] = {
          sSource: sSource,
          sTarget: sTarget,
          Source: oMapping.Source,
          Target: oMapping.Target
        };
      });

      if (Object.keys(sourceTargetMap).length > 0) {
        let aProcessedMappings = [];
        aModifiedExports = aExports.map(oTargetItem => {
          let oSource = sourceTargetMap[oTargetItem.name];
          if (oSource) {
            aProcessedMappings.push(oSource);
            let sSource = oSource.sSource;
            while (sourceTargetMap[sSource]) {
              oSource = sourceTargetMap[sSource];
              aProcessedMappings.push(oSource);

              sSource = oSource.sSource;
            }

            const oTargetExportPath = instance._getExportMapPath(aExports, sSource);
            if (oTargetExportPath) {
              oTargetItem.path = oTargetExportPath;
            }
          }
          return oTargetItem;
        });

        let restSourceTargetMaps = [];
        for (let sTarget in sourceTargetMap) {
          const oMapping = sourceTargetMap[sTarget];

          const oTargetExport = aProcessedMappings.find(oSource => {
            if (oSource.sSource === oMapping.sSource) {
              return true;
            }
          });

          if (!oTargetExport) {
            restSourceTargetMaps.push(oMapping);
          }
        }

        if (restSourceTargetMaps.length > 0) {
          restSourceTargetMaps.forEach(oMapping => {
            const oTargetExportPath = instance._getExportMapPath(aModifiedExports, oMapping.sSource);
            if (oTargetExportPath) {
              aModifiedExports.push({
                name: oMapping.sTarget,
                path: oTargetExportPath
              });
            }
          });
        }
      }

      aModifiedExports.sort(function(a,b) {
        if(a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
        return -1;
      });

      let aRequireStatements = instance._createRequireStatements(aModifiedExports);
      let aExportStatements = instance._createExportStatements(aModifiedExports);
      // add the import statments
      let sIndexFileContent = aRequireStatements.join('\n');
      // append the expots
      sIndexFileContent += aExportStatements.join('\n');
      return Promise.resolve(sIndexFileContent);
    });
  }

  _getExportMapPath(aExports, sSource) {
     const oTargetExport = aExports.find(oSourceItem => {
      if (oSourceItem.name === sSource) {
        return true;
      }
    });

    return oTargetExport ? oTargetExport.path : null;
  }

  _getIntegrationTargetSourceMappings(sApplicationPath, aMappings) {
    return instance._readComponentIntegrationFiles(sApplicationPath).then((aComponents) => {
      let promises = [];

      aComponents.forEach((oComponent) => {
        oComponent.IntegrationPoints.forEach(oIntegrationPoint => {
            aMappings.push(oIntegrationPoint);
        });

        let sComponentPath = instance.componentSourcePath(oComponent);
        promises.push(instance._getIntegrationTargetSourceMappings(sComponentPath, aMappings));
      });

      if (promises.length > 0) {
        return Promise.all(promises);
      }
    });
  }

  /**
   * Builds the bundle.js file by invoking webpack
   */
  _buildApplicationBundle() {
    return new Promise(function(resolve, reject) {
      // Add required externals if they're not specified
      let aExternals = instance.bundlerArgs.externals();
      console.log(chalk.cyan('MDK Bundler - ') + chalk.gray('using external modules ' + chalk.white(aExternals)));

      ['file-system', 'ui/dialogs'].forEach(sRequiredExternal => {
        if (!aExternals.includes(sRequiredExternal)) {
          aExternals.push(sRequiredExternal);
        }
      });

      const oExternals = {};
      // The externals are expected to be an object, so if the externals array exists,
      // create an object from the provided array with its values equal to its keys
      aExternals.forEach(external => {
        oExternals[external] = external;
      });

      let externals = [ oExternals ];
      externals.push(/^tns\-core\-modules\//);
      externals.push(/^mdk\-core\//);
      const sDevtool = instance.bundlerArgs.devtool();
      if (sDevtool) {
        console.log(chalk.cyan('MDK Bundler - ') + chalk.gray('using devtool option ' + chalk.white(sDevtool)));
      }

      const getChildDirs = (p, childFolderName) => {
        return fs.readdirSync(p).filter((f) => {
          return fs.statSync(path.join(p, f)).isDirectory() &&
            fs.existsSync(path.join(p, f, childFolderName)) &&
            fs.statSync(path.join(p, f, childFolderName)).isDirectory();
        }).map(f => path.resolve(p, f, childFolderName));
      };

      let tsFolders = getChildDirs(instance.buildOutputPath, 'Extensions');

      let compiler = webpack({
        entry: path.join(instance.buildOutputPath, instance.bundlerArgs.projectIndexFile()),
        externals : externals,
        output: {
          path: process.cwd(),
          filename: instance.bundlerArgs.bundleName(),
          libraryTarget: instance.bundlerArgs.libraryTarget(),
          library: instance.bundlerArgs.sBaseApplicationName,
          globalObject: 'this'
        },
        mode: 'development',
        devtool: sDevtool? sDevtool : false,
        resolveLoader: {
          modules: [path.join(__dirname, '../node_modules')],
          alias: {
            'i18n-strings-loader': path.join(__dirname, 'loaders/i18n-strings-loader')
          },
        },
        resolve: {
          extensions: [ '.ts', '.js' ]
        },
        module: {
          rules: [
            {
              test: /\.app$|\.action$|\.object$|\.page$|\.service$|\.global$/,
              loader: 'json-loader'
            },
            {
              test: /\.(jpe?g|png|pdf)$/i,
              loader: 'url-loader'
            },
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              include: path.resolve(path.join(instance.buildOutputPath, instance.sBaseApplicationName), 'Rules'),
              loader: 'babel-loader', // 'babel-loader' is also a valid name to reference
              options: {
                babelrc: false,
                // Should be able to specify just 'es2015', but this fails when our module
                // is linked using npm link. This workaround was found at
                // https://github.com/babel/babel-loader/issues/149.
                presets: [require.resolve('babel-preset-es2015')],
              },
            },
            {
              test: /\.ts$/,
              include: tsFolders,
              loader: 'ts-loader',
              options: {
                transpileOnly: true
              }
            },
            {
              test: /\.css$|\.nss$|\.less$/,
              loader: 'css-loader',
              options: {
                esModule: false,
              }
            },
            {
              test: /\.properties$/,
              loader: 'i18n-strings-loader'
            },
            {
              test: /\.mdkbundlerversion$/,
              loader: 'raw-loader',
            },
          ]
        }
      });
      console.log(chalk.cyan('MDK Bundler - ') + chalk.gray('creating bundle ') + chalk.white(path.join(process.cwd(), instance.bundlerArgs.bundleName())));
      if (!instance.bundlerArgs.shouldWatch()) {
        compiler.run(function(error, status) {
          if (!status) {
            console.error(chalk.red(error));
            reject();
          }
          if (status.compilation.errors.length > 0) {
            console.error(chalk.cyan('MDK Bundler - failed to create bundle '));
            console.error(chalk. gray(status));
            console.error(chalk.red(status.compilation.errors));
            reject();
          } else {
            resolve(error);
          }
        });
      } else {
        const watching = compiler.watch({}, function(error, status) {
          if (!status) {
            console.error(chalk.red(error));
            reject();
          }
          if (status.compilation.errors.length > 0) {
            console.error(chalk.cyan('MDK Bundler - failed to create bundle '));
            console.error(chalk. gray(status));
            console.error(chalk.red(status.compilation.errors));
            reject();
          } else {
            resolve(error);
          }
      });

      // watching.close(() => {
      //   console.log("MDK Bundler - Watching Ended.");
      // });
    }

    });
  }

  _buildExportObjects(aBundleFiles) {
    // Remove instance.buildOutput from the paths.
    return aBundleFiles.map(sPath => {
      return sPath.replace(instance.buildOutput, '.');
    }).map((sLocalPath) => {
      return {path: sLocalPath, name: PathToExportName.pathToExportName(sLocalPath, false)};
    });
  }

  _cleanBuildOutput() {
    if (fs.existsSync(instance.buildOutput)) {
      console.log(chalk.cyan('MDK Bundler - deleting ') + chalk.white(instance.buildOutput));
      fs.remove(instance.buildOutput, function (error, aDirs, aFiles) {
        if (error) {
          console.error(chalk.red(error));
        }
      });
    }
  }

  _cleanProjectIndex() {
    if (fs.existsSync(instance.bundlerArgs.projectIndexFile())) {
      console.log(chalk.cyan('MDK Bundler - deleting ') + chalk.white(instance.bundlerArgs.projectIndexFile()));
      del([instance.bundlerArgs.projectIndexFile()], function (error) {
        if (error) {
          console.error(chalk.red(error));
        }
      });
    }
  }

  /**
   *
   * @param {boolean} bVerbose
   */
  cleanTempFiles(bVerbose) { // used by create-client
    if (fs.existsSync(instance.exportedApplicationPath)) {
      if (bVerbose) {
        console.log(chalk.cyan('MDK Bundler - removing temporary directory ') + chalk.white(instance.exportedApplicationPath));
      }
      del(instance.exportedApplicationPath);
    }
    if (fs.existsSync(instance.buildOutput)) {
      if (bVerbose) {
        console.log(chalk.cyan('MDK Bundler - removing build output directory ') + chalk.white(instance.buildOutput));
      }
      del(instance.buildOutput);
    }
    const sBundlePath = path.join(process.cwd(), 'bundle.js');
    if (fs.existsSync(sBundlePath)) {
      if (bVerbose) {
        console.log(chalk.cyan('MDK Bundler - removing bundle.js file ') + chalk.white(sBundlePath));
      }
      del(sBundlePath);
    }
    const sBundleSourceMapPath = path.join(process.cwd(), 'bundle.js.map');
    if (fs.existsSync(sBundleSourceMapPath)) {
      if (bVerbose) {
        console.log(chalk.cyan('MDK Bundler - removing bundle.js.map file ') + chalk.white(sBundleSourceMapPath));
      }
      del(sBundleSourceMapPath);
    }
    if (fs.existsSync(instance.uploadBundleContents)) {
      if (bVerbose) {
        console.log(chalk.cyan('MDK Bundler - removing upload bundle contents directory ') + chalk.white(instance.uploadBundleContents));
      }
      del(instance.uploadBundleContents);
    }
  }

  /**
   * Given an array of component integration objects this method
   * builds a list of cloneables, and returns a list of the valid
   * cloneables.
   *
   * @param {object[]} aComponentIntegrations
   */
  _componentToCloneable(oBaseCloneable, aComponentIntegrations) {
    return aComponentIntegrations.filter((oComponent) => {
      // first filter out invalid component paths
      const sComponentSourcePath = instance.componentSourcePath(oComponent);
      if (!isDirectory(sComponentSourcePath)) {
        console.log(chalk.red('Unable to load component ') + chalk.white(sComponentSourcePath));
        // component source path is NOT valid DO NOT add it to the component list
        return false;
      }
      // component source path is valid add it to the component list
      return true;
    }).map((oComponent) => {
      // now map components to a cloneable object
      return instance._toComponentCloneable(oComponent, oBaseCloneable.sTargetPath);
    }).filter(oCloneable => {
      // finally filter out invalid cloneables
      if (!oCloneable.bValid) {
        console.log(chalk.red(`${oCloneable.sInvalidReason}, component project: `) + chalk.white(oCloneable.sSourcePath));
      }
      return oCloneable.bValid;
    });
  }

  /**
   *
   * @param {*} aBundleFiles
   */
  _createAppIndexFile(aBundleFiles) {
    return instance._buildAppIndexContent(aBundleFiles)
      .then(instance._saveAppIndexFile);
  }

  /**
   *
   * @param {object} cloneables
   *
   * see _toCloneable for the cloneable definition
   */
  _createBuildOutput(cloneables) {
    if (shelljs) {
      shelljs.mkdir('-p', instance.buildOutputPath);
    } else {
      exec(`mkdir -p "${instance.buildOutputPath}"`);
    }
    // tsconfig.json required for ts-loader to compile ts files on definition
    let srcTsconfigPath = path.join(__dirname, 'tsconfig.json');
    let destTsconfigPath = path.join(instance.buildOutputPath, 'tsconfig.json');
    if (shelljs) {
      shelljs.cp(srcTsconfigPath, destTsconfigPath);
    } else {
      exec(`cp "${srcTsconfigPath}" "${destTsconfigPath}"`);
    }
    cloneables.forEach((oCloneable) => {
      const sApplicationName = oCloneable.sApplicationName;
      const sSourcePath = oCloneable.sSourcePath;
      const sTargetPath = `${oCloneable.sTargetPath}/${sApplicationName}`;
      console.log(chalk.cyan('MDK Bundler - ') + chalk. gray('copying ') + chalk.white(sSourcePath) + chalk. gray(' to ') + chalk.white(path.join(instance.buildOutputPath, sApplicationName)));

      if (shelljs) {
        shelljs.cp('-r', sSourcePath, sTargetPath);
      } else {
        exec(`cp -r "${sSourcePath}" "${sTargetPath}"`);
      }
    });
  }

  /**
   * convert .less style file to .css for Nativescript,
   * and then generate .nss for iOS and .json for Android
   */
  _compileStyleFile() {
    return new Promise((resolve, reject) => {
      const sApplicationAppPath = `${instance.buildOutput}/${instance.sBaseApplicationName}/Application.app`;
      if (isFile(sApplicationAppPath)) {
        try {
          let oApplicationAppJson = fs.readJsonSync(sApplicationAppPath);
          if (!oApplicationAppJson) {
            return resolve();
          }

          oApplicationAppJson.StyleSheets = {};
          const sStylesDir = `${instance.buildOutput}/${instance.sBaseApplicationName}/Styles/`;
          if (isDirectory(sStylesDir)) {
            console.log(chalk.cyan('MDK Bundler - ') + chalk. gray('compiling ') + chalk.white(sStylesDir));
            if (less == null) {
              return new Promise((resolve, reject) => {
                return reject('Cannot find module \'less\'');
              });
            }
            if (CSSJSON == null) {
              return new Promise((resolve, reject) => {
                return reject('Cannot find module \'CSSJSON\'');
              });
            }
            const aStyleSheets = fs.readdirSync(sStylesDir).filter((sFile) => {
              if (sFile.endsWith('.less')) {
                return sFile;
              }
            });
            let promises = [];
            let backwardAdaption = false;
            if (aStyleSheets.length === 1 && aStyleSheets[0] && !(instance.bundlerArgs.isForWeb && instance.bundlerArgs.isForWeb())) {
              let styleName = aStyleSheets[0].slice(0, -5);
              if (styleName && styleName.indexOf('.dark') <= 0 && styleName.indexOf('.light') <= 0) {
                backwardAdaption = true;
              }
            }
            aStyleSheets.forEach((sStyleSheet) => {
              if (sStyleSheet) {
                const sStyles = `/${instance.sBaseApplicationName}/Styles/${sStyleSheet}`;
                promises.push(instance._writeStyleFileContent(sStyleSheet.slice(0, -5), sStyles, backwardAdaption));
              }
            });
            return Promise.all(promises).then((styleDefs) => {
              if (styleDefs && styleDefs.length > 0) {
                if (backwardAdaption) {
                  oApplicationAppJson.Styles = styleDefs[0].orgCss;
                  oApplicationAppJson.SDKStyles = {
                    ios: styleDefs[0].entries.ios,
                    android: styleDefs[0].entries.android
                  };
                }
                styleDefs.forEach((def) => {
                  oApplicationAppJson.StyleSheets[def.name] = def.entries;
                });
                fs.writeFileSync(sApplicationAppPath, JSON.stringify(oApplicationAppJson, null, '\t'), 'utf8');
              }
              resolve();
            });
          } else {
            resolve();
          }
        } catch (err) {
          console.error(chalk.red(err));
          reject(err);
        }
      } else {
        reject();
      }
    });
  }

  _writeStyleFileContent(sStyleName, sStyles, backwardAdaption) {
    return new Promise((resolve, reject) => {
      // generate files
      fs.readFile(`${instance.buildOutput}${sStyles}`, function ( error, data ) {
        if (error) {
          return reject(error);
        }
        const sContent = data.toString();
        const jsonLess = JSON.parse(
          JSON.stringify(CSSJSON.toJSON(sContent)).replace(/"color"/gi, '"font-color"')
        );
        // less to css
        less.render(sContent, {}, function(err, oCSS) {
          if (err) {
            return reject(err);
          }
          let sWebCss = oCSS.css;
          if (instance.bundlerArgs.isForWeb && instance.bundlerArgs.isForWeb()) {
            console.log(chalk.cyan('MDK Bundler - ') + chalk. gray('converting type selectors for ') + chalk.white('WebClient'));
            sWebCss = sWebCss
              // nativescript controls
              .replace(/Page/gi, 'div.MDKPage')
              .replace(/StackLayout/gi, 'div#stackLayout')
              .replace(/ActionBar/gi, 'ui5-mdk-bar.actionbar')
              .replace(/ActionBarTitle/gi, 'ui5-mdk-bar.actionbar>ui5-title')
              .replace(/ToolBar/gi, 'ui5-mdk-overflow-toolbar.toolbar')
              // formcell controls
              .replace(/AttachmentFormCellBackground/gi, 'div.afcBackground')
              .replace(/ButtonFormCellBackground/gi, 'div.bfcBackground')
              .replace(/ButtonFormCellValue/gi, 'ui5-button.bfcValue')
              .replace(/DatePickerFormCellBackground/gi, 'div.dafcBackground')
              .replace(/DatePickerFormCellCaption/gi, 'ui5-label.dafcCaption')
              .replace(/DatePickerFormCellValue/gi, 'ui5-timepicker.dafcValue')
              .replace(/DurationPickerFormCellBackground/gi, 'div.dufcBackground')
              .replace(/DurationPickerFormCellCaption/gi, 'ui5-label.dufcCaption')
              .replace(/DurationPickerFormCellValue/gi, 'ui5-duration-picker.dufcValue')
              .replace(/FilterFormCellBackground/gi, 'div.ffcBackground')
              .replace(/FilterFormCellCaption/gi, 'ui5-label.ffcCaption')
              .replace(/ListPickerFormCellBackground/gi, 'div.lpfcBackground')
              .replace(/ListPickerFormCellCaption/gi, 'ui5-label.lpfcCaption')
              .replace(/ListPickerFormCellValue/gi, 'ui5-input.lpfcValue')
              .replace(/NoteFormCellBackground/gi, 'div.nfcBackground')
              .replace(/NoteFormCellValue/gi, 'ui5-textarea.nfcValue')
              .replace(/SegmentedControlFormCellBackground/gi, 'div.scfcBackground')
              .replace(/SegmentedControlFormCellCaption/gi, 'ui5-label.scfcCaption')
              .replace(/SimplePropertyFormCellBackground/gi, 'div.spfcBackground')
              .replace(/SimplePropertyFormCellCaption/gi, 'ui5-label.spfcCaption')
              .replace(/SimplePropertyFormCellValue/gi, 'ui5-input.spfcValue')
              .replace(/SwitchFormCellBackground/gi, 'div.sfcBackground')
              .replace(/SwitchFormCellSwitch/gi, 'ui5-label.sfcCaption')
              .replace(/SwitchFormCellCaption/gi, 'ui5-switch.sfcSwitch')
              .replace(/TitleFormCellBackground/gi, 'div.tfcBackground')
              .replace(/TitleFormCellValue/gi, 'ui5-input.tfcValue')
              .replace(/ImageCellImage/gi, 'ui5-avatar.icImage')
              // for section controls
              .replace(/ObjectHeaderDetailImage/gi, 'ui5-avatar.ohDetailImage')
              .replace(/ObjectHeaderHeadlineText/gi, 'span.ohHeadlineText')
              .replace(/ObjectHeaderSubhead/gi, 'span.ohSubhead')
              .replace(/ObjectHeaderStatusImage/gi, '.ohStatusImage')
              .replace(/ObjectHeaderSubstatusImage/gi, '.ohSubstatusImage')
              .replace(/ObjectHeaderStatusText/gi, '.ohStatusText')
              .replace(/ObjectHeaderSubstatusText/gi, '.ohSubstatusText')
              .replace(/ObjectHeaderDescription/gi, 'span.ohDescription')
              .replace(/ObjectHeaderBodyText/gi, 'span.ohBodyText')
              .replace(/ObjectHeaderFootnote/gi, 'span.ohFootnote')
              .replace(/SimplePropertyCellKeyName/gi, 'span.scKeyName')
              .replace(/SimplePropertyCellValue/gi, 'span.scValue')
              .replace(/ObjectCellBackgroundColor/gi, 'ui5-mdk-object-cell.ocBackgroundColor')
              .replace(/ObjectCellDetailImage/gi, 'ui5-avatar.ocDetailImage')
              .replace(/ObjectCellTitle/gi, 'span.ocTitle')
              .replace(/ObjectCellSubhead/gi, 'span.ocSubhead')
              .replace(/ObjectCellDescription/gi, 'span.ocDescription')
              .replace(/ObjectCellFootnote/gi, 'span.ocFootnote')
              .replace(/ObjectCellStatusImage/gi, '.ocStatusImage')
              .replace(/ObjectCellSubstatusImage/gi, '.ocSubstatusImage')
              .replace(/ObjectCellStatusText/gi, '.ocStatusText')
              .replace(/ObjectCellSubstatusText/gi, '.ocSubstatusText')
              .replace(/ContactCellDetailImage/gi, 'ui5-avatar.ccDetailImage')
              .replace(/ContactCellHeadline/gi, 'span.ccHeadline')
              .replace(/ContactCellSubheadline/gi, 'span.ccSubheadline')
              .replace(/ContactCellDescription/gi, 'span.ccDescription')
            ;
          } else {
            // MDK-7883: to include .ns-light / .ns-dark identifier on css type selector
            // this is because MDK internal css is using the identifier, when all selectors are available
            // the one with identifier would take precendence.
            let modeToBeAppended = '.ns-light'; // default as ns-light to ensure it would override the MDK internal css
            if (sStyleName.indexOf('.dark') > 0) {
              modeToBeAppended = '.ns-dark';
            } else if (sStyleName.indexOf('.light') > 0) {
              modeToBeAppended = '.ns-light';
            }

            if (modeToBeAppended !== '') {
              const jsonCssMain = CSSJSON.toJSON(sWebCss);
              const newJsonCssMain = Object.keys(jsonCssMain.children).reduce((acc, key) => {
                let newKey = key;
                newKey = modeToBeAppended + ' ' + key;
                const renamedObject = {
                  [newKey]: jsonCssMain.children[key]
                };
                return {
                  ...acc,
                  ...renamedObject
                };
              }, {});

              const newJsonCss = {
                children: newJsonCssMain,
                attributes: jsonCssMain.attributes
              }
              sWebCss = CSSJSON.toCSS(newJsonCss);
            }
          }
          const sOrgCSSFile = sStyles.replace('.less', '.css');
          if (backwardAdaption) {
            fs.writeFileSync( `${instance.buildOutput}${sOrgCSSFile}`, oCSS.css, 'utf8');
            sStyles = sStyles.replace('.less', '.light.less');
          }
          const sCSSFile = sStyles.replace('.less', '.css');
          fs.writeFileSync( `${instance.buildOutput}${sCSSFile}`, sWebCss, 'utf8');

          // css to json, only keep class selectors
          // remove '.' in front of selector
          const includeTypeSelectors = ['ActionBar'];
          const jsonCss = JSON.parse(
            JSON.stringify(CSSJSON.toJSON(oCSS.css)).replace(/"color"/gi, '"font-color"')
          );
          const fontFamilyProp = 'font-family';
          const filtered = Object.keys(jsonCss.children)
            .filter(key => !key.includes(':active'))
            .reduce((obj, key) => {
              if (key.startsWith('.')) {
                obj[key.substr(1)] = jsonCss.children[key];
                delete obj[key.substr(1)].attributes[fontFamilyProp];
              } else if (includeTypeSelectors.includes(key)) {
                obj[key] = jsonCss.children[key];
                delete obj[key].attributes[fontFamilyProp];
              }
              return obj;
            }, {});
          // json to nss
          const jsonNss = {
            children: filtered,
            attributes: jsonLess.attributes
          }
          const nss = CSSJSON.toCSS(jsonNss);
          const sNSSFile = sStyles.replace('.less', '.nss');
          fs.writeFileSync(`${instance.buildOutput}${sNSSFile}`, nss, 'utf8');

          // json file for android
          const jsonAndroid = Object.keys(filtered)
            .reduce((obj, key) => {
              obj[key] = filtered[key].attributes;
              return obj;
            }, {});
          const sJSONFile = sStyles.replace('.less', '.json');
          fs.writeFileSync(`${instance.buildOutput}${sJSONFile}`, JSON.stringify(jsonAndroid, null, '\t'), 'utf8');

          let def = {
            name: sStyleName,
            entries: {
              css: sCSSFile,
              ios: sNSSFile,
              android: sJSONFile
            },
            orgCss: backwardAdaption ? sOrgCSSFile : null
          };
          resolve(def);
        });
      });
    });
  }

  /**
   *
   */
  _createBundlerVersionFile() {
    // This is a simple way of writing the bundler version into the bundle
    // so that it can be accessed just like a definition.
    exec(`echo 1.1 > "${instance.buildOutput}"/version.mdkbundlerversion`);
  }

  /**
   * Produces a array of export statements from aExportNames of the form:
   * <export name> : <export name>
   *
   * Example:
   * application_app : application_app"
   *
   * Example output:
   * "module.exports = {"
   *     application_app : application_app,"
   *    // additional export statements may follow
   * "}"
   * @param {string[]} aExportNames
   */
  _createExportStatements(aExports) {
    let aExportStatements = ['', 'module.exports = {']
    .concat(aExports.map(oExport => {
      return `\t${oExport.name} : ${oExport.name},`;
    }));
    // all export statements excluding the last one must end with ','
    aExportStatements[aExportStatements.length - 1] = aExportStatements[aExportStatements.length - 1].replace(',', '');
    aExportStatements.push('}');
    return aExportStatements;
  }

  /**
   * Produces a array of require statements from aExportNames of the form:
   *
   * Requires that aExportNames[n] maps to aFiles[n]
   *
   * "let <export name> = require('<path to export> ');"
   *
   * @param {string[]} aExportNames - array of exported names
   * @param {string[]} aFiles - array of paths
   */
  _createRequireStatements(aExports) {
    const aRequireStatements = aExports.map(oExport => {

      // if (oExport.path.endsWith('.png')) {
      //   // npm install image-webpack-loader --save
      //   //sRequire = "require('url-loader?mimetype=image/png!" + sFilePath + "');";
      //   // npm install  img-loader --save
      //   //sRequire = "require('file!img!" + sFilePath + "');";
      // }
      let requirePath = oExport.path;
      if (path.sep === '\\') { // in windows
        requirePath = requirePath.replace(/\\/g, '/');
      }
      return `let ${oExport.name} = require('${requirePath}')`;
    });

    // push a empty string to add final newline during join
    aRequireStatements.push('');
    return aRequireStatements;
  }

  /**
   * Produces a list of filtered bundled files or an error if reading.
   *
   * See _isValidBundleFile for the filtering details
   */
  _generateBundleFiles() {
    return new Promise(function(resolve, reject) {
      dir.files(instance.buildOutput, function(error, aFiles) {

        if (error) {
          reject(error);
        }

        let aBundleFiles = aFiles.filter((sFilePath) => {
          return instance._isValidBundleFile(sFilePath);
        });

        resolve(aBundleFiles);
      });
    });
  }

  /**
   * Determines of the list of
   * @param {*} aNames
   */
  _filterDuplicateNames(aExports) {
    const counts = {};
    aExports.forEach(oExport => {
      counts[oExport.name] = (counts[oExport.name] || 0) + 1;
    });
    return Object.keys(counts).filter(count => counts[count] > 1);
  }

    /**
   * Method to determine if the file should be added to the list
   * of webpack files.
   *
   * @param {string} sFilePath
   * @returns {boolean} false if the file is not a valid MDK webpack file
   * otherwise true
   */
  _isValidBundleFile(sFilePath) {
    // Swap backslashes in the path with a forward slash
    sFilePath = sFilePath.replace(/\\/g, '/');
    // Skip unneeded files
    if (sFilePath.includes('DS_Store')
      || sFilePath.includes('README.md')
      // This json file is created by the editor.
      // We don't need to include it in the bundle and it causes an error
      // because webpack chokes on file names with dashes.
      || sFilePath.includes('neo-app.json')
      // Ignore .spec.js files so that metadata can contain unit tests
      || sFilePath.includes('.spec.js')
      // Ignore Component Integration Files
      || sFilePath.includes('.cim')
      // Ignore Object Files
      || sFilePath.includes('.object')
      // Ignore extension support file generated by editor
      || sFilePath.includes('.extension')
      // Ignore .rule files because they're created and used by the editor.
      // These are JSON files that are used to generate .rule.js files, which are bundled.
      || sFilePath.substring(sFilePath.length - 5) === '.rule'
      || sFilePath.substring(sFilePath.length - 4) === '.xml'
      || sFilePath.substring(sFilePath.length - 4) === '.SMF') {
      return false;
    }

    // Only bundle the root Application.app file, all other component base Application.app files
    if (sFilePath.includes('Application.app')) {
      let segments = sFilePath.split('/');
      if (segments.length > 2) {
        return false;
      }
    }

    // Ignore all hidden files and directories.
    if (sFilePath.split('/').some(sPathComponent => {
      return sPathComponent.length > 1 && sPathComponent[0] === '.';
    })) {
      return false;
    }

    return true;
  }

  /**
   * Link a single application and one ore more components. Recursively
   * process the component as a base application.
   * @param {string} sApplicationPath
   * @param {string} sBuildPath
   */
  _linkApplication(sApplicationPath, sApplicationName) {
    let componentQueue = [];
    // read the components for this application
    return instance._readComponentIntegrationFiles(sApplicationPath).then((aComponents) => {
      aComponents.forEach((oComponent) => {
        oComponent.IntegrationPoints.forEach(integrationPoint => {
          const aSourceSegements = integrationPoint.Source.split(path.sep);
          const aTargetSegements = integrationPoint.Target.split(path.sep);
          if (aSourceSegements[1] === oComponent.ApplicationName && aTargetSegements[1] === sApplicationName) {
            instance._linkComponent(sApplicationName, instance.componentSourcePath(oComponent), integrationPoint);
          }
          if (aSourceSegements[1] === sApplicationName && aTargetSegements[1] === oComponent.ApplicationName) {
            instance._linkComponent(oComponent.ApplicationName, sApplicationPath, integrationPoint);
          }
        });
      });
      return aComponents;
    }).then((aComponents) => {
      return instance._linkComponents(aComponents, componentQueue);
    });
  }

  /**
   * Entry point for applicaton linking.  Start by linking the base
   * application to its componenent, then recursively link any components
   * that may exist in the component application.
   */
  _link() {
    console.log(chalk.cyan('MDK Bundler - ') + chalk. gray('linking application ') + chalk.white(instance.clientDefinitionsPath));
    return instance._linkApplication(instance.clientDefinitionsPath, instance.sBaseApplicationName);
  }

  /**
   *
   * @param {object} sSourcePath
   * @param {object} integrationPoint
   */
  _linkComponent(sApplicationName, sSourcePath, integrationPoint) {
    const sPath = path.join(process.cwd(), 'bundle.js');
    if (fs.existsSync(sPath)) {
      let sContents = fs.readFileSync(sPath, 'utf8');
      //let pattern = '\/ \"\./build\.definitions' + integrationPoint.Target + '\"';
      let pattern = 'var \.* = __webpack_require__\.*\/ \"\./build\.definitions' + integrationPoint.Target + '\"';
      let regex = new RegExp(pattern, 'gmi');
      if (regex.test(sContents)) {
        let newContents = sContents.replace(regex, function (match) {
            return match.replace('\"\./build\.definitions' + integrationPoint.Target + '\"',
            '\"\./build\.definitions' + integrationPoint.Source + '\"');
        });

        fs.writeFileSync(sPath, newContents, 'utf8');
        console.log("\n" + '[hh:mm:ss]'.timestamp + chalk.magenta(" -- replace Import --"));
      }
    } else {
      console.log(chalk.cyan('MDK Bundler - File not found: ') + chalk.white(sPath));
    }
  }

  /**
   *
   * @param {object[]} aComponents
   * @param {object[]} componentQueue
   */
  _linkComponents(aComponents, componentQueue) {
    // first
    aComponents.forEach((oComponent) => {
      componentQueue.push(oComponent);
    });

    if (componentQueue.length > 0) {
      const oComponent = componentQueue.shift();
      return instance._linkApplication(instance.componentSourcePath(oComponent), oComponent.ApplicationName);
    }

    return Promise.resolve();
  }

  /**
   * Reads and returns the list of components for an application
   *
   * @param {string} sSourcePath - path to folder containing Application.app
   */
  _readComponentIntegrationFiles(sSourcePath) {
    console.log(chalk.cyan('MDK Bundler - ') + chalk. gray('reading components @path ') + chalk.white(sSourcePath));

    return new Promise((resolve, reject) => {
      let aComponents = [];
      dir.readFiles(sSourcePath, {match: /^(.*\.cim$)*$/, recursive: false}, (error, content, next) => {
        if (!error) {
          aComponents.push(JSON.parse(content));
          next();
        } else {
          resolve([]);
        }
      },
      (error, files) => {
        if (!error) {
          files.forEach((file) => {
            console.log(chalk.cyan('MDK Bundler - ') + chalk. gray('processed component @path ') + chalk.white(file));
          });
          resolve(aComponents);
        }

        resolve([]);
      });
    }).catch(error => {
      return [];
    });
  }

  _rootBaseApplication() {
    if (!isFile(`${instance.buildOutput}/${instance.sBaseApplicationName}/Application.app`)) {
      fail(`Cannot find base project Application.app file at ${instance.buildOutput}/${instance.sBaseApplicationName}/Application.app`);
    }

    if (shelljs) {
      shelljs.mv(`${instance.buildOutput}/${instance.sBaseApplicationName}/Application.app`, instance.buildOutput);
    } else {
      exec(`mv "${instance.buildOutput}/${instance.sBaseApplicationName}"/Application.app ${instance.buildOutput}`);
    }
  }

  _saveAppIndexFile(sIndexFileContent) {
    return new Promise(function(resolve, reject) {
      createFile(path.join(instance.buildOutput, instance.bundlerArgs.projectIndexFile()), sIndexFileContent, (error) => {
        if (error) {
          reject(error);
        }
        resolve(sIndexFileContent);
      });
    });
  }

  _toCloneable(sApplicationName, sSourcePath, sTargetPath, bValid = true, sInvalidReason = '') {
    return { sApplicationName, sSourcePath, sTargetPath, bValid, sInvalidReason };
  }

  _toComponentCloneable(oComponent, sTargetPath) {
    const sComponentSourcePath = instance.componentSourcePath(oComponent);
    const sComponentApplicationName = instance._appNameFromAppFile(sComponentSourcePath)
    if (oComponent.ApplicationName != sComponentApplicationName) {
      const sComponentMismatchText = `Component Integration - application nmae mismatch cim says: ${oComponent.ApplicationName}`;
      const sApplicationMismatchText = `Application.app says: ${sComponentApplicationName}`;
      const sInvalidReason = `${sComponentMismatchText}, ${sApplicationMismatchText}`;
      return instance._toCloneable(sComponentApplicationName, sComponentSourcePath, sTargetPath, false, sInvalidReason);
    }
    return instance._toCloneable(sComponentApplicationName, sComponentSourcePath, sTargetPath);
  }

  _unzipEditorExport() {
    console.log(chalk.cyan('MDK Bundler - unzipping archive at ') + chalk.white(instance.bundlerArgs.editorExport()) + chalk. gray(' to ') + chalk.white(this.clientDefinitionsPath));
    const zip = new AdmZip(instance.bundlerArgs.editorExport());
    zip.extractAllTo(instance.exportedApplicationPath, /*overwrite*/ true);
  }

  _updateBundle() {
    console.log("\n" + '[hh:mm:ss]'.timestamp + chalk.magenta(" -- updating definitions --"));
    instance.updateClientDefinitions();
    if (instance.bundlerArgs.shouldCreateBundle()) {
      console.log("\n" + '[hh:mm:ss]'.timestamp + chalk.magenta(" -- creating upload bundle --"));
      return instance.createUploadBundle();
    }
  }

  _replaceImport()
  {
    console.log(chalk.cyan('MDK Bundler - ') + chalk. gray('replacing bundle ') + chalk.white(instance.clientDefinitionsPath));
    return instance._linkApplication(instance.clientDefinitionsPath, instance.sBaseApplicationName);
  }
};

exports.Bundler = Bundler;
