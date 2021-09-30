"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SharedLoggerManager = (function () {
    function SharedLoggerManager() {
    }
    SharedLoggerManager.log = function (message, severity) {
        if (severity === void 0) { severity = undefined; }
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    SharedLoggerManager.pluginError = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    SharedLoggerManager.pluginDebug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    SharedLoggerManager.pluginInfo = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    SharedLoggerManager.pluginWarn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    return SharedLoggerManager;
}());
exports.SharedLoggerManager = SharedLoggerManager;
