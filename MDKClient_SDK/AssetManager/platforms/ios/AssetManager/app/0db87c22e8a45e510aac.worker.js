/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(2);
var AppExtractHelper_1 = __webpack_require__(3);
var context = self;
context.onmessage = function (msg) {
    setTimeout(function () {
        var error = AppExtractHelper_1.AppExtractHelper.getInstance().extract(msg);
        global.postMessage({ err: error });
        AppExtractHelper_1.AppExtractHelper.getInstance().removeFolder();
        AppExtractHelper_1.AppExtractHelper.getInstance().removeDownloadedZipFile();
    }, 500);
};
; 
if (false ) {} 
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/globals");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var zip_plugin_1 = __webpack_require__(4);
var fs = __webpack_require__(5);
var Logger_1 = __webpack_require__(6);
var RequireUtil_1 = __webpack_require__(7);
var AppExtractHelper = (function () {
    function AppExtractHelper() {
    }
    AppExtractHelper.getInstance = function () {
        return AppExtractHelper._instance;
    };
    AppExtractHelper.prototype.extract = function (msg) {
        var error;
        this.zipSource = msg.data.zipSource;
        this.zipDest = msg.data.zipDestPath;
        var bundleDest = msg.data.bundleDest;
        Logger_1.Logger.instance.core.info('Unzip started: from ' + this.zipSource + ' to ' + this.zipDest);
        zip_plugin_1.Zip.unzip(this.zipSource, this.zipDest);
        var bundleSourcePath = fs.path.join(this.zipDest, 'bundle.js');
        error = this._moveBundleFile(bundleSourcePath, bundleDest, function (sContents) {
            return RequireUtil_1.RequireUtil.replaceMdkRequire(sContents);
        });
        if (!error) {
            this._moveBundleFile(fs.path.join(this.zipDest, 'bundle.js.map'), bundleDest + '.map');
        }
        return error;
    };
    AppExtractHelper.prototype.removeFolder = function () {
        var extractedZipFolder = fs.Folder.fromPath(this.zipDest);
        extractedZipFolder.removeSync(function (e) {
            Logger_1.Logger.instance.core.error("Failed to remove extracted zip folder: " + e);
        });
    };
    AppExtractHelper.prototype.removeDownloadedZipFile = function () {
        var zipSourceFile = fs.File.fromPath(this.zipSource);
        zipSourceFile.removeSync(function (e) {
            Logger_1.Logger.instance.core.error("Failed to remove temp download zip: " + e);
        });
    };
    AppExtractHelper.prototype._moveBundleFile = function (bundleSourcePath, bundleDest, cb) {
        var error;
        var bundleExists = fs.File.exists(bundleSourcePath);
        var bundleSourceFile;
        var bundleSourceData;
        if (bundleExists) {
            bundleSourceFile = fs.File.fromPath(bundleSourcePath);
        }
        else {
            error = bundleSourcePath + ' does not exist';
        }
        if (!error) {
            bundleSourceData = bundleSourceFile.readTextSync(function (e) {
                error = e;
                Logger_1.Logger.instance.core.error("App download file read failed: " + error);
            });
        }
        if (!error) {
            if (cb) {
                bundleSourceData = cb(bundleSourceData);
            }
            var bundleDesthFile = fs.File.fromPath(bundleDest);
            bundleDesthFile.writeTextSync(bundleSourceData, function (e) {
                error = e;
                Logger_1.Logger.instance.core.error("App download file write failed: " + error);
            });
        }
        return error;
    };
    AppExtractHelper._instance = new AppExtractHelper();
    return AppExtractHelper;
}());
exports.AppExtractHelper = AppExtractHelper;
; 
if (false ) {} 

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("zip-plugin");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("tns-core-modules/file-system");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/Logger");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("mdk-core/utils/RequireUtil");

/***/ })
/******/ ]);