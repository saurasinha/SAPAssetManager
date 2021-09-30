(global["webpackJsonp"] = global["webpackJsonp"] || []).push([[2],{

/***/ 25:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {const loadCss = __webpack_require__(26);

module.exports = function() {
    loadCss(function() {
        const appCssContext = __webpack_require__(28);
        global.registerWebpackModules(appCssContext);
    });
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(5)))

/***/ }),

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

module.exports = function (loadModuleFn) {
    const nsCore = __webpack_require__(27);
    __webpack_require__(13);

    loadModuleFn();

    nsCore.Application.loadAppCss();
}


/***/ }),

/***/ 5:
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


/***/ })

}]);