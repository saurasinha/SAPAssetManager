const { join, relative, resolve, sep, basename, dirname, extname } = require("path");
const fs = require("fs");
const os = require("os");
const { execSync } = require("child_process");
const webpack = require("webpack");
const nsWebpack = require("@nativescript/webpack");
const nativescriptTarget = require("@nativescript/webpack/nativescript-target");
const { getNoEmitOnErrorFromTSConfig } = require("@nativescript/webpack/utils/tsconfig-utils");
const nsTransformNativeClasses = require("@nativescript/webpack/transformers/ns-transform-native-classes").default;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { NativeScriptWorkerPlugin } = require("nativescript-worker-loader/NativeScriptWorkerPlugin");
const ExternalsPlugin = require("webpack/lib/ExternalsPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const hashSalt = Date.now().toString();

function isWindows() {
    return os.type() === "Windows_NT"
}

function replaceMdkRequire(sContents) {
    if (sContents) {
        let regex = new RegExp('^\\(function[\\s\\S]*?\\}\\)\\(this\\,', 'gm');
        if (regex.test(sContents)) {
            let newContents = sContents.replace(regex, (match) => {
                let regex2 = new RegExp('([^\\.])(require\\()', 'gm');
                if (regex2.test(match)) {
                    return match.replace(regex2, '$1mdkRequire(');
                } else {
                    return match;
                }
            });

            return newContents;
        } else {
            return sContents;
        }
    } else {
        return '';
    }
}

function replaceMdkRequireFromBuffer(content) {
    return Buffer.from(replaceMdkRequire(content.toString()));
}

module.exports = env => {
    const activityFileName = "app/MDKAndroidActivity.android";
    // Clean generated js files under app folder if exists
    if (fs.existsSync(resolve(__dirname, activityFileName + ".js"))) {
        console.log('Remove generated js files under app folder');
        try {
            execSync("npm run clean-app", {
                cwd: __dirname,
                maxBuffer: 4 * 1024 * 1024,
            });
        } catch (ex) {
            console.error(ex);
        }
    }
    // Add your custom Activities, Services and other Android app components here.
    const appComponents = env.appComponents || [];
    appComponents.push(...[
        "@nativescript/core/ui/frame",
        "@nativescript/core/ui/frame/activity",
        resolve(__dirname, activityFileName + ".ts"),
    ]);

    const platform = env && (env.android && "android" || env.ios && "ios" || env.platform);
    if (!platform) {
        throw new Error("You need to provide a target platform!");
    }

    const platforms = ["ios", "android"];
    const projectRoot = __dirname;

    if (env.platform) {
        platforms.push(env.platform);
    }

    // Default destination inside platforms/<platform>/...
    const dist = resolve(projectRoot, nsWebpack.getAppPath(platform, projectRoot));

    const {
        // The 'appPath' and 'appResourcesPath' values are fetched from
        // the nsconfig.json configuration file.
        appPath = "app",
        appResourcesPath = "app/App_Resources",

        // You can provide the following flags when running 'tns run android|ios'
        snapshot, // --env.snapshot
        production, // --env.production
        uglify, // --env.uglify
        report, // --env.report
        sourceMap, // --env.sourceMap
        hiddenSourceMap, // --env.hiddenSourceMap
        hmr, // --env.hmr,
        unitTesting, // --env.unitTesting,
        testing, // --env.testing
        verbose, // --env.verbose
        snapshotInDocker, // --env.snapshotInDocker
        skipSnapshotTools, // --env.skipSnapshotTools
        compileSnapshot // --env.compileSnapshot
    } = env;

    const useLibs = compileSnapshot;
    const isAnySourceMapEnabled = !!sourceMap || !!hiddenSourceMap;

    const PACKAGE_JSON_FILE_NAME = "package.json";
    const NODE_MODULES_FOLDER_NAME = "node_modules";

    function readJson(filePath) {
        const stringContent = fs.readFileSync(filePath);
        return JSON.parse(stringContent);
    }

    function getProductionDependencies(projectPath) {
        const packageJsonContent = readJson(join(projectRoot, PACKAGE_JSON_FILE_NAME));
        const rootNodeModulesPath = join(projectPath, NODE_MODULES_FOLDER_NAME);
        const projectPackageJsonPath = join(projectPath, PACKAGE_JSON_FILE_NAME);
        const dependencies = packageJsonContent && packageJsonContent.dependencies;

        const resolvedDependencies = [];

        const queue = Object.keys(dependencies)
            .map(dependencyName => ({
                parent: null,
                parentDir: projectPath,
                name: dependencyName,
                depth: 0
            }));

        while (queue.length) {
            const currentModule = queue.shift();
            const resolvedDependency = findModule(rootNodeModulesPath, currentModule, resolvedDependencies);

            if (resolvedDependency && !resolvedDependencies.some(r => r.directory === resolvedDependency.directory)) {
                resolvedDependency.dependencies.forEach(d => {
                    const dependency = { parent: currentModule, name: d, parentDir: resolvedDependency.directory, depth: resolvedDependency.depth + 1 };

                    const shouldAdd = !queue.some(element =>
                        element.parent === dependency.parent &&
                        element.name === dependency.name &&
                        element.parentDir === dependency.parentDir &&
                        element.depth === dependency.depth);

                    if (shouldAdd) {
                        queue.push(dependency);
                    }
                });

                resolvedDependencies.push(resolvedDependency);
            }
        }

        return resolvedDependencies;
    }

    function findModule(rootNodeModulesPath, depDescription, resolvedDependencies) {
        let modulePath = join(depDescription.parentDir, NODE_MODULES_FOLDER_NAME, depDescription.name); // node_modules/parent/node_modules/<package>
        const rootModulesPath = join(rootNodeModulesPath, depDescription.name);
        let depthInNodeModules = depDescription.depth;

        if (!moduleExists(modulePath)) {

            let exists = false;
            let parent = depDescription.parent;

            while (parent && !exists) {
                modulePath = join(depDescription.parent.parentDir, NODE_MODULES_FOLDER_NAME, depDescription.name);
                exists = moduleExists(modulePath);
                if (!exists) {
                    parent = parent.parent;
                }
            }

            if (!exists) {
                modulePath = rootModulesPath; // /node_modules/<package>
                if (!moduleExists(modulePath)) {
                    return null;
                }
            }

            depthInNodeModules = 0;
        }

        if (resolvedDependencies.some(r => r.name === depDescription.name && r.directory === modulePath)) {
            return null;

        }

        return getDependencyData(depDescription.name, modulePath, depthInNodeModules);
    }

    function getDependencyData(name, directory, depth) {
        const dependency = {
            name,
            directory,
            depth
        };

        const packageJsonPath = join(directory, PACKAGE_JSON_FILE_NAME);
        const packageJsonExists = fs.lstatSync(packageJsonPath).isFile();

        if (packageJsonExists) {
            const packageJsonContents = readJson(packageJsonPath);

            if (!!packageJsonContents.nativescript) {
                // add `nativescript` property, necessary for resolving plugins
                dependency.nativescript = packageJsonContents.nativescript;
            }

            dependency.dependencies = Object.keys(packageJsonContents.dependencies || {});
            return dependency;
        }

        return null;
    }

    function moduleExists(modulePath) {
        try {
            let modulePathLsStat = fs.lstatSync(modulePath);
            if (modulePathLsStat.isSymbolicLink()) {
                modulePathLsStat = fs.lstatSync(fs.realpathSync(modulePath));
            }

            return modulePathLsStat.isDirectory();
        } catch (e) {
            return false;
        }
    }

    const allDependencies = getProductionDependencies(projectRoot).filter(dep => dep.depth === 0);

    env.externals = env.externals || [];
    env.externals.push(...allDependencies.map(dep => {
        return dep.name;
    }));

    const dataToCopyPatterns = allDependencies.map(dep => {
        const rootNodeModulesPath = join(projectRoot, NODE_MODULES_FOLDER_NAME);
        const depRelativePath = relative(rootNodeModulesPath, dep.directory);
        const platformLowerCase = platform.toLowerCase();
        const oppositePlatform = platformLowerCase === "android" ? "ios" : "android";
        //debugger;         
        return {
            from: `../node_modules/${depRelativePath}`,
            to: `${dist}/tns_modules/${depRelativePath}`,
            transformPath: (targetPath) => {
                const originalBasename = basename(targetPath);
                const modifiedBasename = originalBasename.replace(new RegExp(`\.${platformLowerCase}\.`), ".");
                const result = join(dirname(targetPath), modifiedBasename);
                return result;
            },
            globOptions: {
                ignore: ["**/platforms/**", `.${oppositePlatform}.`, "**/*.ts", "**/*.js.map"]
            }
        };
    });     

    const nativescriptRTLPath = [];
    nativescriptRTLPath.push(join(projectRoot, NODE_MODULES_FOLDER_NAME, "@nativescript-rtl"));
    const rtlToCopyPatterns = nativescriptRTLPath.map(dep => {
      const rootNodeModulesPath = join(projectRoot, NODE_MODULES_FOLDER_NAME);
      const depRelativePath = relative(rootNodeModulesPath, dep);
      const platformLowerCase = platform.toLowerCase();
      const oppositePlatform = platformLowerCase === "android" ? "ios" : "android";
      //debugger;         
      return {
          from: `../node_modules/${depRelativePath}`,
          to: `${dist}/tns_modules/${depRelativePath}`,
          filter: (resourcePath) => {
            if (resourcePath.match(new RegExp(`@nativescript-rtl.+\.${platformLowerCase}\.js$`))) {
              return true;
            } else {
              return false;
            }
          },
          globOptions: {
              ignore: ["**/platforms/**", `.${oppositePlatform}.`, "**/*.ts", "**/*.js.map"]
          }
      };
  });     


    const externals = nsWebpack.getConvertedExternals(env.externals);

    let appFullPath = resolve(projectRoot, appPath);
    if (!fs.existsSync(appFullPath)) {
        // some apps use 'app' directory
        appFullPath = resolve(projectRoot, 'app');
    }
    const hasRootLevelScopedModules = nsWebpack.hasRootLevelScopedModules({ projectDir: projectRoot });
    let coreModulesPackageName = "tns-core-modules";
    const alias = env.alias || {};
    alias['~'] = appFullPath;
    alias['@extensions'] = resolve(__dirname, 'app', 'extensions');

    if (hasRootLevelScopedModules) {
        coreModulesPackageName = "@nativescript/core";
        alias["tns-core-modules"] = coreModulesPackageName;
    }
    const appResourcesFullPath = resolve(projectRoot, appResourcesPath);

    let i18nLoaderPath = resolve(projectRoot, "..", "..", "tools", "application-bundler", "loaders", "i18n-strings-loader");
    if (!fs.existsSync(i18nLoaderPath)) {
        i18nLoaderPath = resolve(projectRoot, "loaders", "i18n-strings-loader");
    }

    const copyIgnore = { ignore: [`${relative(appPath, appResourcesFullPath)}/**`] };

    const entryModule = nsWebpack.getEntryModule(appFullPath, platform);
    const entryPath = `.${sep}${entryModule}.ts`;
    const entries = env.entries || {};
    entries.main = entryPath;

    if (platform === "android") {
        entries["application"] = "./MDKAndroidApplication.android";
    }

    const tsConfigPath = resolve(projectRoot, "tsconfig.json");
    const areCoreModulesExternal = Array.isArray(env.externals) && env.externals.some(e => e.indexOf("@nativescript") > -1);
    if (platform === "ios" && !areCoreModulesExternal && !testing) {
        entries["tns_modules/@nativescript/core/inspector_modules"] = "inspector_modules";
    };

    let sourceMapFilename = nsWebpack.getSourceMapFilename(hiddenSourceMap, __dirname, dist);
    const itemsToClean = [`${dist}/**/*`];
    if (platform === "android") {
        itemsToClean.push(`${join(projectRoot, "platforms", "android", "app", "src", "main", "assets", "snapshots")}`);
        itemsToClean.push(`${join(projectRoot, "platforms", "android", "app", "build", "configurations", "nativescript-android-snapshot")}`);
    }

    const noEmitOnErrorFromTSConfig = getNoEmitOnErrorFromTSConfig(tsConfigPath);

    const libraryTarget = "commonjs2";

    nsWebpack.processAppComponents(appComponents, platform);
    const config = {
        mode: production ? "production" : "development",
        context: appFullPath,
        externals,
        watchOptions: {
            ignored: [
                appResourcesFullPath,
                // Don't watch hidden files
                "**/.*",
            ]
        },
        target: nativescriptTarget,
        entry: entries,
        output: {
            pathinfo: false,
            path: dist,
            sourceMapFilename,
            libraryTarget,
            filename: "[name].js",
            globalObject: "global",
            hashSalt
        },
        resolve: {
            extensions: [".ts", ".js", ".scss", ".css"],
            // Resolve {N} system modules from @nativescript/core
            modules: [
                resolve(__dirname, `node_modules/${coreModulesPackageName}`),
                resolve(__dirname, "node_modules"),
                `node_modules/${coreModulesPackageName}`,
                "node_modules",
            ],
            alias,
            // resolve symlinks to symlinked modules
            symlinks: true
        },
        resolveLoader: {
            alias: {
                'i18n-strings-loader': i18nLoaderPath
            },
            // don't resolve symlinks to symlinked loaders
            symlinks: false
        },
        node: {
            // Disable node shims that conflict with NativeScript
            "http": false,
            "timers": false,
            "setImmediate": false,
            "fs": "empty",
            "__dirname": false,
        },
        devtool: hiddenSourceMap ? "hidden-source-map" : (sourceMap ? "inline-source-map" : "none"),
        optimization: {
            runtimeChunk: "single",
            noEmitOnErrors: noEmitOnErrorFromTSConfig,
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: "vendor",
                        chunks: "all",
                        test: (module, chunks) => {
                            const moduleName = module.nameForCondition ? module.nameForCondition() : '';
                            return /[\\/]node_modules[\\/]/.test(moduleName) ||
                                appComponents.some(comp => comp === moduleName);

                        },
                        enforce: true,
                    },
                }
            },
            minimize: !!uglify,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    cache: true,
                    sourceMap: isAnySourceMapEnabled,
                    terserOptions: {
                        output: {
                            comments: false,
                            semicolons: !isAnySourceMapEnabled
                        },
                        compress: {
                            // The Android SBG has problems parsing the output
                            // when these options are enabled
                            'collapse_vars': platform !== "android",
                            sequences: platform !== "android",
                        }
                    }
                })
            ],
        },
        module: {
            rules: [
                {
                    include: join(appFullPath, entryPath),
                    use: [
                        // Require all Android app components
                        platform === "android" && {
                            loader: "@nativescript/webpack/helpers/android-app-components-loader",
                            options: { modules: appComponents }
                        },

                        {
                            loader: "@nativescript/webpack/bundle-config-loader",
                            options: {
                                loadCss: !snapshot, // load the application css if in debug mode
                                unitTesting,
                                appFullPath,
                                projectRoot,
                                ignoredFiles: nsWebpack.getUserDefinedEntries(entries, platform)
                            }
                        },
                    ].filter(loader => !!loader)
                },

                {
                    test: /\.(ts|css|scss|html|xml)$/,
                    use: "@nativescript/webpack/hmr/hot-loader"
                },

                { test: /\.(html|xml)$/, use: "@nativescript/webpack/helpers/xml-namespace-loader" },

                {
                    test: /\.css$/,
                    use: "@nativescript/webpack/helpers/css2json-loader"
                },

                {
                    test: /\.scss$/,
                    use: [
                        "@nativescript/webpack/helpers/css2json-loader",
                        "sass-loader"
                    ]
                },

                {
                    test: /\.ts$/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            configFile: tsConfigPath,
                            // https://github.com/TypeStrong/ts-loader/blob/ea2fcf925ec158d0a536d1e766adfec6567f5fb4/README.md#faster-builds
                            // https://github.com/TypeStrong/ts-loader/blob/ea2fcf925ec158d0a536d1e766adfec6567f5fb4/README.md#hot-module-replacement
                            transpileOnly: true,
                            allowTsInNodeModules: true,
                            compilerOptions: {
                                sourceMap: isAnySourceMapEnabled,
                                declaration: false
                            },
                            getCustomTransformers: (program) => ({
                              before: [nsTransformNativeClasses]
                            })
                        },
                    }
                },
                {
                    test: /\.properties$/,
                    loader: "i18n-strings-loader"
                }
            ]
        },
        plugins: [
            new webpack.IgnorePlugin(/^\.\/(tests\/|branding\/|bundle\.js|demo\.js|default\.js)/),
            // Define useful constants like TNS_WEBPACK
            new webpack.DefinePlugin({
                "global.TNS_WEBPACK": "true",
                "global.isAndroid": platform === 'android',
                "global.isIOS": platform === 'ios',
                "process": "global.process",
            }),
            // Remove all files from the out dir.
            new CleanWebpackPlugin({ 
              cleanOnceBeforeBuildPatterns: itemsToClean,
              cleanStaleWebpackAssets: false,
              verbose: !!verbose
            }),
            // Copy assets
            new CopyWebpackPlugin({
              patterns: [
                {
                    from: "bundle.js", transform: (content, path) => {
                        return replaceMdkRequireFromBuffer(content);
                    }, noErrorOnMissing: true
                },
                {
                    from: "demo.js", transform: (content, path) => {
                        return replaceMdkRequireFromBuffer(content);
                    }, noErrorOnMissing: true
                },
                {
                    from: "default.js", transform: (content, path) => {
                        return replaceMdkRequireFromBuffer(content);
                    }, noErrorOnMissing: true
                },
                { from: "branding/**", noErrorOnMissing: true, globOptions: { dot: false, ...copyIgnore } },
                { from: "extensions/**/*.properties", noErrorOnMissing: true, globOptions: { dot: false, ...copyIgnore } },
                { from: "i18n/**", noErrorOnMissing: true, globOptions: { dot: false, ...copyIgnore } },
                { from: 'assets/**', noErrorOnMissing: true, globOptions: { dot: false, ...copyIgnore } },
                { from: 'fonts/**', noErrorOnMissing: true, globOptions: { dot: false, ...copyIgnore } },
                { from: '**/*.jpg', noErrorOnMissing: true, globOptions: { dot: false, ...copyIgnore } },
                { from: '**/*.png', noErrorOnMissing: true, globOptions: { dot: false, ...copyIgnore } },
            ]
            }),
            new nsWebpack.GenerateNativeScriptEntryPointsPlugin("main"),
            // For instructions on how to set up workers with webpack
            // check out https://github.com/nativescript/worker-loader
            new NativeScriptWorkerPlugin({
                plugins: [new ExternalsPlugin(libraryTarget, externals)],
            }),
            new nsWebpack.PlatformFSPlugin({
                platform,
                platforms,
            }),
            // Does IPC communication with the {N} CLI to notify events when running in watch mode.
            new nsWebpack.WatchStateLoggerPlugin(),
            // https://github.com/TypeStrong/ts-loader/blob/ea2fcf925ec158d0a536d1e766adfec6567f5fb4/README.md#faster-builds
            // https://github.com/TypeStrong/ts-loader/blob/ea2fcf925ec158d0a536d1e766adfec6567f5fb4/README.md#hot-module-replacement
            new ForkTsCheckerWebpackPlugin({
              async: false,
              typescript: {
                configFile: tsConfigPath,
                memoryLimit: 4096,
                diagnosticOptions: {
                  syntactic: true,
                  semantic: true
                }
              }
            }),
            new CopyWebpackPlugin({
                patterns: dataToCopyPatterns
            }),
            new CopyWebpackPlugin({
              patterns: rtlToCopyPatterns
            })                           
        ],
    };

    if (report) {
        // Generate report files for bundles content
        config.plugins.push(new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            generateStatsFile: true,
            reportFilename: resolve(projectRoot, "report", `report.html`),
            statsFilename: resolve(projectRoot, "report", `stats.json`),
        }));
    }

    if (snapshot) {
        config.plugins.push(new nsWebpack.NativeScriptSnapshotPlugin({
            chunk: "vendor",
            requireModules: [
                "@nativescript/core/bundle-entry-points",
            ],
            projectRoot,
            webpackConfig: config,
            snapshotInDocker,
            skipSnapshotTools,
            useLibs
        }));
    }

    if (hmr) {
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }

    return config;
};
