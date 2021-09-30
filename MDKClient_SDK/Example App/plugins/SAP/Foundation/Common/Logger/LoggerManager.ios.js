"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SharedLoggerManager_1 = require("../SharedLogger/SharedLoggerManager");
var ErrorMessage_1 = require("../../../ErrorHandling/ErrorMessage");
var CommonUtil_1 = require("../../../ErrorHandling/CommonUtil");
var trace_1 = require("tns-core-modules/trace");
var appSettings = require("tns-core-modules/application-settings");
var LoggerState;
(function (LoggerState) {
    LoggerState[LoggerState["On"] = 0] = "On";
    LoggerState[LoggerState["Off"] = 1] = "Off";
})(LoggerState || (LoggerState = {}));
var LoggerSeverity;
(function (LoggerSeverity) {
    LoggerSeverity[LoggerSeverity["Off"] = 0] = "Off";
    LoggerSeverity[LoggerSeverity["Error"] = 1] = "Error";
    LoggerSeverity[LoggerSeverity["Warn"] = 2] = "Warn";
    LoggerSeverity[LoggerSeverity["Info"] = 3] = "Info";
    LoggerSeverity[LoggerSeverity["Debug"] = 4] = "Debug";
})(LoggerSeverity || (LoggerSeverity = {}));
var LoggerManager = (function () {
    function LoggerManager() {
        this.currentLoggerState = LoggerState.Off;
        this.logLevel = LoggerSeverity.Off;
        this.bridge = LoggerManagerSwift;
    }
    LoggerManager.init = function (logFileName, maxFileSizeInMegaBytes) {
        if (logFileName === void 0) { logFileName = 'ClientLog.txt'; }
        if (maxFileSizeInMegaBytes === void 0) { maxFileSizeInMegaBytes = 1; }
        if (!LoggerManager.isInitialized) {
            LoggerManager.isInitialized = true;
            LoggerManager.instance.attachUploaderToRootLogger(maxFileSizeInMegaBytes);
            LoggerManager.instance.initLogLocalFileHandler(logFileName, maxFileSizeInMegaBytes);
            LoggerManager.instance.saveLoggerParams(logFileName, maxFileSizeInMegaBytes);
            LoggerManager.instance.initLogLevelFromNSDefaults();
            trace_1.write('Logger initialized successfully.', 'mdk.trace.logging', trace_1.messageType.log);
        }
        else {
            SharedLoggerManager_1.SharedLoggerManager.pluginWarn(ErrorMessage_1.ErrorMessage.WARN_LOG_FILE_NOT_CREATED, logFileName);
        }
    };
    LoggerManager.getInstance = function () {
        if (LoggerManager.instance == null) {
            throw new Error(ErrorMessage_1.ErrorMessage.LOGGER_MANAGER_NOT_INITIALIZED_YET);
        }
        else {
            return LoggerManager.instance;
        }
    };
    LoggerManager.clearLog = function () {
        if (LoggerManager.isInitialized) {
            LoggerManager.isInitialized = false;
            var errorRef = new interop.Reference();
            LoggerManager.getInstance().bridge.clearLogAndReturnError(errorRef);
            if (errorRef && errorRef.value) {
                throw new Error(ErrorMessage_1.ErrorMessage.LOGGER_FAILED_TO_DELETE_LOG_FILE);
            }
        }
    };
    LoggerManager.prototype.isTurnedOn = function () {
        return this.currentLoggerState === LoggerState.On;
    };
    LoggerManager.prototype.getLevel = function () {
        return LoggerSeverity[this.logLevel];
    };
    LoggerManager.prototype.isLogSeverityHigher = function (severity) {
        var logSeverity = LoggerSeverity[severity];
        return (logSeverity > 0 && this.logLevel >= logSeverity);
    };
    LoggerManager.prototype.toggle = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.currentLoggerState === LoggerState.Off) {
                _this.on();
                resolve();
            }
            else {
                _this.off();
                resolve();
            }
        });
    };
    LoggerManager.prototype.on = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.currentLoggerState === LoggerState.Off) {
                _this.currentLoggerState = LoggerState.On;
                if (_this.logLevel === LoggerSeverity.Off) {
                    _this.logLevel = LoggerSeverity.Error;
                }
                _this.activateNewLogSeverity(_this.logLevel);
                trace_1.write('Logging turned on.', 'mdk.trace.logging', trace_1.messageType.log);
            }
            resolve();
        });
    };
    LoggerManager.prototype.off = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.currentLoggerState === LoggerState.On) {
                _this.logLevel = LoggerSeverity.Off;
                _this.currentLoggerState = LoggerState.Off;
                _this.activateNewLogSeverity(LoggerSeverity.Off);
                trace_1.write('Logging turned off.', 'mdk.trace.logging', trace_1.messageType.log);
            }
            resolve();
        });
    };
    LoggerManager.prototype.setLevel = function (newLevel) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var newSeverity = LoggerSeverity[newLevel];
            if (newSeverity === undefined) {
                reject('Defined log level is not a valid value.');
                return;
            }
            _this.logLevel = newSeverity;
            _this.updateLoggerState(newSeverity);
            _this.activateNewLogSeverity(_this.logLevel);
            resolve();
        });
    };
    LoggerManager.prototype.uploadLogFile = function (backendURL, applicationID) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.bridge.uploadLogsWithBackendURLApplicationIDResolveReject(backendURL, applicationID, function (result) {
                resolve(result);
            }, function (code, message, error) {
                reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
            });
        });
    };
    LoggerManager.prototype.getLevelFromUserDefaults = function () {
        var groupDefaults = NSUserDefaults.standardUserDefaults;
        var logLevelAsString = groupDefaults.objectForKey('AppModeler_logLevel');
        return logLevelAsString === undefined || logLevelAsString === null ? '' : logLevelAsString;
    };
    LoggerManager.prototype.log = function (message, severity) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var logSeverity = LoggerSeverity[severity];
            if (logSeverity === undefined) {
                logSeverity = _this.logLevel;
            }
            if ((_this.currentLoggerState === LoggerState.On) && (logSeverity !== LoggerSeverity.Off)) {
                var logSeverityString = LoggerSeverity[logSeverity];
                if (!_this.isLogSeverityHigher(logSeverityString)) {
                    var logLevelString = _this.getLevel();
                    var msg_1 = "Log severity '" + logSeverityString + "' is lower than log level '" + logLevelString + "'";
                    trace_1.write(msg_1, 'mdk.trace.logging', trace_1.messageType.log);
                }
                else {
                    _this.bridge.logWithSeverity(message, logSeverityString);
                    var logMessage = "Logged a message with severity '" + logSeverityString + "'";
                    trace_1.write(logMessage, 'mdk.trace.logging', trace_1.messageType.log);
                }
                resolve();
            }
            else {
                reject('Logger is turned off.');
            }
        });
    };
    LoggerManager.prototype.activateNewLogSeverity = function (newLogLevelSeverity) {
        var logLevelAsString = LoggerSeverity[newLogLevelSeverity];
        this.bridge.activateLogLevelWithSeverity(logLevelAsString);
        this.saveLogLevelToNSDefaults(newLogLevelSeverity);
    };
    LoggerManager.prototype.attachUploaderToRootLogger = function (maxFileSizeInMegaBytes) {
        var errorRef = new interop.Reference();
        this.bridge.attachUploaderToRootLoggerWithMaxFileSizeError(maxFileSizeInMegaBytes, errorRef);
        if (errorRef.value) {
            throw new Error(ErrorMessage_1.ErrorMessage.ERROR_WHILE_CREATING_LOG_UPLOAD);
        }
    };
    LoggerManager.prototype.initLogLocalFileHandler = function (fileName, maxFileSizeInMegaBytes) {
        var errorRef = new interop.Reference();
        this.bridge.addLocalFileHandlerWithFileNameMaxFileSizeError(fileName, maxFileSizeInMegaBytes, errorRef);
        if (errorRef.value) {
            throw new Error(ErrorMessage_1.ErrorMessage.ERROR_CREATING_LOCAL_FILE);
        }
    };
    LoggerManager.prototype.initLogLevelFromNSDefaults = function () {
        var groupDefaults = NSUserDefaults.standardUserDefaults;
        var logLevelAsString = groupDefaults.objectForKey('AppModeler_logLevel');
        var newSeverity = LoggerSeverity[logLevelAsString];
        if (newSeverity) {
            this.logLevel = newSeverity;
            this.updateLoggerState(newSeverity);
        }
    };
    LoggerManager.prototype.saveLogLevelToNSDefaults = function (newLogLevelSeverity) {
        var groupDefaults = NSUserDefaults.standardUserDefaults;
        var logLevelAsString = LoggerSeverity[newLogLevelSeverity];
        if (logLevelAsString) {
            groupDefaults.setObjectForKey(logLevelAsString, 'AppModeler_logLevel');
            groupDefaults.synchronize();
        }
    };
    LoggerManager.prototype.updateLoggerState = function (logLevelSeverity) {
        if (logLevelSeverity === LoggerSeverity.Off) {
            this.currentLoggerState = LoggerState.Off;
        }
        else {
            this.currentLoggerState = LoggerState.On;
        }
    };
    LoggerManager.prototype.saveLoggerParams = function (logFileName, maxFileSizeInMegaBytes) {
        appSettings.setString('AppModeler_logFileName', logFileName);
        appSettings.setNumber('AppModeler_logFileSize', maxFileSizeInMegaBytes);
        appSettings.flush();
    };
    LoggerManager.instance = new LoggerManager();
    LoggerManager.isInitialized = false;
    return LoggerManager;
}());
exports.LoggerManager = LoggerManager;
