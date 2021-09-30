#!/usr/bin/env node

const fs = require('fs-extra');
const dir = require('node-dir');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer');
const toolUtils = require('../tool-utils');
const fail = toolUtils.fail;
const isDirectory = toolUtils.isDirectory;
const shelljs = require('shelljs');

class MetadataMigrate {
  constructor() {
    let argvCommand = program
      .version('1.0.0')
      .option('-s, --srcdir <dir-path>', 'path to source directory')
      .option('-o, --outdir <dir-path>', 'path to output directory; if it is not specified, migrate files in the source directory')
      ;
    argvCommand.parse(process.argv);

    this.sSdkPath = path.resolve(__dirname, '..', '..');
    this.defaultSourceFolder = 'template.mdkproject';
    this.sMdkProject = program.srcdir;
    this.sOutDir = program.outdir;
    this.udaptedFileCount = 0;
  }

  getMDKProjectPath() {
    const that = this;
    function testMDKProjectPath(sValue) {
      sValue = sValue
        .trim()
        .replace(/\/$/, '')
        .replace('~', process.env.HOME);
      if (!isDirectory(sValue)) {
        return `Could not find the source directory: ${sValue}`;
      }

      // Use the transformed value going forward
      that.sMdkProject = path.resolve(sValue);
      return true;
    }
    if (this.sMdkProject) {
      const r = testMDKProjectPath(this.sMdkProject);
      if (r === true) {
        console.log(`Using ${this.sMdkProject}`);
        return Promise.resolve();
      } else {
        return Promise.reject(r);
      }
    } else {
      const that = this;
      const oMDKProjectQuestion = {
        type: 'input',
        name: 'mdkproject',
        message: 'Enter the path of the source directory.',
        default: path.resolve(that.sSdkPath, this.defaultSourceFolder),
        validate: testMDKProjectPath,
      };
      return inquirer.prompt([oMDKProjectQuestion])
        .then(function (answers) {
          console.log(`Using ${that.sMdkProject}`);
        });
    }
  }

  getOutDir() {
    const that = this;
    function testOutPath(sValue) {
      sValue = sValue
        .trim()
        .replace(/\/$/, '')
        .replace('~', process.env.HOME);
      if (!isDirectory(sValue)) {
        return `Could not find the output directory: ${sValue}`;
      }
      // Use the transformed value going forward
      that.sOutDir = path.resolve(sValue);
      return true;
    }

    if (this.sOutDir) {
      const r = testOutPath(this.sOutDir);
      if (r === true) {
        console.log(`Using ${this.sOutDir} for output directory`);
        return Promise.resolve();
      } else {
        return Promise.reject(r);
      }
    }
  }

  run() {
    this.getMDKProjectPath()
      .then(this.getOutDir.bind(this))
      .then(this.migrate.bind(this))
      .catch(e => {
        fail(e);
      });
  }

  migrate() {
    if (this.sOutDir) {
      let outFolder = path.resolve(this.sOutDir, path.basename(this.sMdkProject));
      if (fs.existsSync(outFolder)) {
        console.log(`Removing existing directory ${outFolder}`);
        shelljs.rm('-rf', outFolder);
      }

      shelljs.cp('-r', this.sMdkProject, this.sOutDir);

      this.sMdkProject = outFolder;
      console.log(`Output to ${this.sMdkProject}`);
    }

    this.udaptedFileCount = 0;
    dir.readFiles(this.sMdkProject, {
      match: /\.ts$|\.js$/,
      exclude: /^\.|demo.js|bundle.js|default.js/
    }, (err, content, filename, next) => {
      if (filename.endsWith('.ts')) {
        this.migrateTS(filename, content);
      } else if (filename.endsWith('.js')) {
        this.migrateJS(filename, content);
      }

      next();
    }, (err, files) => {
      console.log(`\nfinished reading files: ${files.length}, updated files: ${this.udaptedFileCount}`);

      if (err) throw err;
    });
  }

  migrateTS(filename, content) {
    this.updateFileDataUsingRegExp(filename, content, [{
      regexp: "(import.*?from\\s*?')(.*?)(')",
      replaceFunc: this.migrateTSModules.bind(this)
    }, {
      regexp: '(import.*?from\\s*?")(.*?)(")',
      replaceFunc: this.migrateTSModules.bind(this)
    }]);
  }

  migrateJS(filename, content) {
  }

  migrateTSModules(re, filePath, fileData) {
    const excludeNames = [ '/Application' ];
    let fileFolder = path.dirname(filePath);
    let fileChanged = false;
    fileData = fileData.replace(re, (match, s1, importPath, s3) => {
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        let replaceIt = true;
        for (let excludeName of excludeNames) {
          if (importPath.endsWith(excludeName)) {
            replaceIt = false;
            break;
          }
        }

        if (replaceIt) {
          let f1 = path.resolve(fileFolder, importPath);
          let fileExt = path.extname(f1);
          let files = [ f1 ];
          if (!fileExt) {
            files.push(f1 + '.ts');
            files.push(f1 + '.d.ts');
            files.push(f1 + '.js');
          }

          for (let f of files) {
            if (fs.existsSync(f)) {
              replaceIt = false;
              break;
            }
          }
        }
        
        if (replaceIt) {
          let items = importPath.split('/');
          let newItems = [ 'mdk-core' ];
          for (let item of items) {
            if (item !== '.' && item !== '..') {
              newItems.push(item);
            }
          }

          let newImportPath = newItems.join('/');
          fileChanged = true;

          return s1 + newImportPath + s3;
        }
      }

      return match;
    });

    return { fileChanged: fileChanged, fileData: fileData };
  }

  updateFileDataUsingRegExp(filePath, fileData, regexps) {
    let fileChanged = false;

    for (const item of regexps) {
      const re = new RegExp(item.regexp, 'g');
      if (re.test(fileData)) {
        let r = item.replaceFunc(re, filePath, fileData);

        fileChanged = fileChanged || r.fileChanged;
        if (r.fileChanged) {
          fileData = r.fileData;
        }
      }
    }

    if (fileChanged) {
      fs.writeFileSync(filePath, fileData, 'utf-8');
      this.udaptedFileCount++;
      console.log(`Updated ${filePath}`);
    }
  }
}

exports.MetadataMigrate = MetadataMigrate;

if (require.main === module) {
  const c = new MetadataMigrate();
  return c.run();
}
