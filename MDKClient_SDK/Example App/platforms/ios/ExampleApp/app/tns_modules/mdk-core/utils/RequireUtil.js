"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("tns-core-modules/file-system");
var app = require("tns-core-modules/application");
var Logger_1 = require("./Logger");
var _webpackRequire;
var _globalRequire = require;
if (typeof (global) !== 'undefined') {
    _globalRequire = global.require;
}
var existExternalModules = [];
var tnsModulesPath = fs.path.join(fs.knownFolders.currentApp().path, 'tns_modules');
if (fs.Folder.exists(tnsModulesPath)) {
    var tnsModulesFolder = fs.Folder.fromPath(tnsModulesPath);
    var entities = tnsModulesFolder.getEntitiesSync();
    for (var _i = 0, entities_1 = entities; _i < entities_1.length; _i++) {
        var item = entities_1[_i];
        if (fs.Folder.exists(item.path)) {
            existExternalModules.push(item.name);
        }
    }
}
var RequireUtil = (function () {
    function RequireUtil() {
    }
    RequireUtil.replaceMdkRequire = function (sContents) {
        if (sContents) {
            var regex = new RegExp('^\\(function[\\s\\S]*?\\}\\)\\(this\\,', 'gm');
            if (regex.test(sContents)) {
                var newContents = sContents.replace(regex, function (match) {
                    var regex2 = new RegExp('([^\\.])(require\\()', 'gm');
                    if (regex2.test(match)) {
                        return match.replace(regex2, '$1mdkRequire(');
                    }
                    else {
                        return match;
                    }
                });
                return newContents;
            }
            else {
                return sContents;
            }
        }
        else {
            return '';
        }
    };
    RequireUtil.copyTextFile = function (srcPath, destPath, replaceMdkRequire) {
        if (replaceMdkRequire === void 0) { replaceMdkRequire = true; }
        var error;
        var srcFile = fs.File.fromPath(srcPath);
        var srcData = srcFile.readTextSync(function (e) {
            error = e;
            Logger_1.Logger.instance.core.error(srcPath + " file read failed: " + error);
        });
        if (!error) {
            var destData = srcData;
            if (replaceMdkRequire) {
                destData = RequireUtil.replaceMdkRequire(srcData);
            }
            var destFile = fs.File.fromPath(destPath);
            destFile.writeTextSync(destData, function (e) {
                error = e;
                Logger_1.Logger.instance.core.error(destPath + " file write failed: " + error);
            });
        }
        return error;
    };
    RequireUtil.getFolderName = function (filePath) {
        if (filePath) {
            var idx = filePath.lastIndexOf('/');
            if (idx === -1) {
                return filePath;
            }
            else {
                return filePath.substring(0, idx);
            }
        }
        else {
            return '';
        }
    };
    RequireUtil.getFileName = function (filePath) {
        return filePath ? filePath.split(/[\\/]/).pop() : '';
    };
    RequireUtil.setRequire = function (webpackRequire, globalRequire) {
        if (globalRequire === void 0) { globalRequire = null; }
        _webpackRequire = webpackRequire;
        if (globalRequire) {
            _globalRequire = globalRequire;
        }
    };
    RequireUtil.require = function (sPath) {
        for (var _i = 0, existExternalModules_1 = existExternalModules; _i < existExternalModules_1.length; _i++) {
            var item = existExternalModules_1[_i];
            if (sPath.startsWith(item)) {
                return _globalRequire(fs.path.join(tnsModulesPath, sPath));
            }
        }
        return RequireUtil.tryRequire(sPath);
    };
    ;
    RequireUtil.isInDefinitionBundleFolder = function (filePath) {
        return RequireUtil.getDefinitionBundleFolder() === RequireUtil.getFolderName(filePath);
    };
    RequireUtil.getDefinitionBundleFolder = function () {
        if (app.ios) {
            return fs.path.join(fs.knownFolders.ios.library().path, 'definitions');
        }
        return RequireUtil.BUNDLE_FOLDER_PATH;
    };
    RequireUtil.tryRequire = function (sPath) {
        if (_webpackRequire) {
            try {
                var r = _webpackRequire(sPath);
                if (r) {
                    return r;
                }
            }
            catch (e) { }
        }
        return _globalRequire(sPath);
    };
    RequireUtil.hasFileExtension = function (sPath) {
        var fileName = RequireUtil.getFileName(sPath);
        var pos = fileName.lastIndexOf('.');
        if (fileName === '' || pos < 1) {
            return false;
        }
        else {
            return true;
        }
    };
    RequireUtil.BUNDLE_FOLDER_PATH = fs.path.join(fs.knownFolders.documents().path, 'definitions');
    return RequireUtil;
}());
exports.RequireUtil = RequireUtil;
