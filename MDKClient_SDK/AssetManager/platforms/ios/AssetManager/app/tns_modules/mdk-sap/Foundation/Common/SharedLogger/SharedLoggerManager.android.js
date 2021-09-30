"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../../../ErrorHandling/ErrorMessage");
var SharedLoggerManager = (function () {
    function SharedLoggerManager() {
    }
    SharedLoggerManager.log = function (message, severity) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.bridge.log('SAP.MDKClient', severity, message);
            resolve();
        });
    };
    SharedLoggerManager.pluginDebug = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return SharedLoggerManager.pluginLog('Debug', message, args);
    };
    SharedLoggerManager.pluginError = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return SharedLoggerManager.pluginLog('Error', message, args);
    };
    SharedLoggerManager.pluginInfo = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return SharedLoggerManager.pluginLog('Info', message, args);
    };
    SharedLoggerManager.pluginWarn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return SharedLoggerManager.pluginLog('Warn', message, args);
    };
    SharedLoggerManager.pluginLog = function (severity, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var str = ErrorMessage_1.ErrorMessage.format.apply(ErrorMessage_1.ErrorMessage, __spreadArrays([message], args));
        return new Promise(function (resolve, reject) {
            SharedLoggerManager.bridge.log('SAP.Plugin', severity, str);
            resolve();
        });
    };
    SharedLoggerManager.instance = new SharedLoggerManager();
    SharedLoggerManager.bridge = com.sap.mdk.client.foundation.SharedLoggerManager;
    return SharedLoggerManager;
}());
exports.SharedLoggerManager = SharedLoggerManager;
