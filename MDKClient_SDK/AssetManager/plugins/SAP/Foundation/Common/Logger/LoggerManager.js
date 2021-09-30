"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoggerManager = (function () {
    function LoggerManager() {
    }
    LoggerManager.init = function (logFileName, maxFileSizeInMegaBytes) {
        if (logFileName === void 0) { logFileName = 'ClientLog.txt'; }
        if (maxFileSizeInMegaBytes === void 0) { maxFileSizeInMegaBytes = 1; }
    };
    LoggerManager.getInstance = function () {
        return '';
    };
    LoggerManager.clearLog = function () {
    };
    LoggerManager.prototype.toggle = function () {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    LoggerManager.prototype.on = function () {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    LoggerManager.prototype.off = function () {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    LoggerManager.prototype.isTurnedOn = function () {
        return false;
    };
    LoggerManager.prototype.isLogSeverityHigher = function (severity) {
        return false;
    };
    LoggerManager.prototype.getLevel = function () {
        return '';
    };
    LoggerManager.prototype.setLevel = function (newLevel) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    LoggerManager.prototype.log = function (message, severity) {
        if (severity === void 0) { severity = undefined; }
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    LoggerManager.prototype.uploadLogFile = function (backendURL, applicationID) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    LoggerManager.prototype.getLevelFromUserDefaults = function () {
        return '';
    };
    return LoggerManager;
}());
exports.LoggerManager = LoggerManager;
