(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(mdkRequire("tns-core-modules/ui/dialogs"));
	else if(typeof define === 'function' && define.amd)
		define(["tns-core-modules/ui/dialogs"], factory);
	else if(typeof exports === 'object')
		exports["tns-core-modules/ui/dialogs"] = factory(mdkRequire("tns-core-modules/ui/dialogs"));
	else
		root["tns-core-modules/ui/dialogs"] = factory(root["tns-core-modules/ui/dialogs"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var application_app = __webpack_require__(1);
	var actions_logoutuser_action = __webpack_require__(2);
	var pages_splash_page = __webpack_require__(3);
	var rules_onwillupdate_js = __webpack_require__(4);

	module.exports = {
		application_app: application_app,
		actions_logoutuser_action: actions_logoutuser_action,
		pages_splash_page: pages_splash_page,
		rules_onwillupdate_js: rules_onwillupdate_js
	};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = {"MainPage":"/Default/Pages/Splash.page","OnWillUpdate":"/Default/Rules/OnWillUpdate.js","_Name":"Default"}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = {"_Type":"Action.Type.Logout"}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = {"Caption":"SAP Mobile Development Kit","ToolBar":{"Controls":[{"SystemItem":"FlexibleSpace","_Type":"Control.Type.ToolbarItem","_Name":"FlexibleSpaceb"},{"_Name":"LogoutToolbarItem","_Type":"Control.Type.ToolbarItem","Caption":"Log out","OnPress":"/Default/Actions/LogoutUser.action"}]},"_Name":"Splash","_Type":"Page"}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = OnWillUpdate;
	var dialogs = __webpack_require__(5);

	function OnWillUpdate(clientAPI) {
		return dialogs.confirm("Update now?").then(function (result) {
			if (result === true) {
				return Promise.resolve();
			} else {
				return Promise.reject('User Deferred');
			}
		});
	}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ })
/******/ ])
});
;