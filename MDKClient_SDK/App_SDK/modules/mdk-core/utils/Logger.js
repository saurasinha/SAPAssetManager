"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonUtil_1 = require("./CommonUtil");
var mdk_sap_1 = require("mdk-sap");
var mdk_sap_2 = require("mdk-sap");
var trace_1 = require("tns-core-modules/trace");
var TraceCategories;
(function (TraceCategories) {
    TraceCategories["action"] = "mdk.trace.action";
    TraceCategories["api"] = "mdk.trace.api";
    TraceCategories["app"] = "mdk.trace.app";
    TraceCategories["binding"] = "mdk.trace.binding";
    TraceCategories["branding"] = "mdk.trace.branding";
    TraceCategories["core"] = "mdk.trace.core";
    TraceCategories["i18n"] = "mdk.trace.i18n";
    TraceCategories["lcms"] = "mdk.trace.lcms";
    TraceCategories["logging"] = "mdk.trace.logging";
    TraceCategories["odata"] = "mdk.trace.odata";
    TraceCategories["onboarding"] = "mdk.trace.onboarding";
    TraceCategories["profiling"] = "mdk.trace.profiling";
    TraceCategories["push"] = "mdk.trace.push";
    TraceCategories["restservice"] = "mdk.trace.restservice";
    TraceCategories["settings"] = "mdk.trace.settings";
    TraceCategories["targetPath"] = "mdk.trace.targetpath";
    TraceCategories["ui"] = "mdk.trace.ui";
})(TraceCategories = exports.TraceCategories || (exports.TraceCategories = {}));
;
var ConsoleLogger = (function () {
    function ConsoleLogger() {
        this._category = '';
        this.severity = 'Info';
    }
    ConsoleLogger.prototype.error = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.severity = 'Error';
        this._logMessage.apply(this, __spreadArrays(['error', message], args));
    };
    ConsoleLogger.prototype.info = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.severity = 'Info';
        this._logMessage.apply(this, __spreadArrays(['info', message], args));
    };
    ConsoleLogger.prototype.log = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.severity = 'Debug';
        this._logMessage.apply(this, __spreadArrays(['log', message], args));
    };
    ConsoleLogger.prototype.warn = function (message) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.severity = 'Warn';
        this._logMessage.apply(this, __spreadArrays(['warn', message], args));
    };
    ConsoleLogger.prototype.setCategory = function (category) {
        this._category = category;
        return this;
    };
    ConsoleLogger.prototype.toConsole = function (severity, message) {
        if (this._category === '') {
            throw new Error('Invalid call to Logger.toConsole - category cannot be empty');
        }
        trace_1.write(message, this._category, this._severityToAsNumber(severity));
        this._category = '';
    };
    ConsoleLogger.prototype._logMessage = function (method, message) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.toConsole(method, CommonUtil_1.CommonUtil.format.apply(CommonUtil_1.CommonUtil, __spreadArrays([message], args)));
    };
    ConsoleLogger.prototype._severityToAsNumber = function (severity) {
        switch (severity) {
            case 'error':
                return trace_1.messageType.error;
            case 'info':
                return trace_1.messageType.info;
            case 'log':
                return trace_1.messageType.log;
            case 'warn':
                return trace_1.messageType.warn;
            default:
                return trace_1.messageType.log;
        }
    };
    return ConsoleLogger;
}());
var DefaultLogger = (function (_super) {
    __extends(DefaultLogger, _super);
    function DefaultLogger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DefaultLogger, "instance", {
        get: function () {
            return DefaultLogger._instance;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "action", {
        get: function () {
            return this.getLogger('Action').setCategory(TraceCategories.action);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "api", {
        get: function () {
            return this.getLogger('Application').setCategory(TraceCategories.app);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "app", {
        get: function () {
            return this.getLogger('Application').setCategory(TraceCategories.app);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "appDelegate", {
        get: function () {
            return this.getLogger('AppDelegate').setCategory(TraceCategories.app);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "appUpdate", {
        get: function () {
            return this.getLogger('AppUpdate').setCategory(TraceCategories.app);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "branding", {
        get: function () {
            return this.getLogger('Branding').setCategory(TraceCategories.branding);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "clientSettings", {
        get: function () {
            return this.getLogger('ClientSettings').setCategory(TraceCategories.settings);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "core", {
        get: function () {
            return this.getLogger('ClientSettings').setCategory(TraceCategories.core);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "definitionLoader", {
        get: function () {
            return this.getLogger('DefinitionLoader').setCategory(TraceCategories.core);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "extension", {
        get: function () {
            return this.getLogger('Extension').setCategory(TraceCategories.ui);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "formCell", {
        get: function () {
            return this.getLogger('FormCellExtension').setCategory(TraceCategories.ui);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "formCellExtension", {
        get: function () {
            return this.getLogger('FormCellExtension').setCategory(TraceCategories.ui);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "i18n", {
        get: function () {
            return this.getLogger('i18n').setCategory(TraceCategories.i18n);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "lcms", {
        get: function () {
            return this.getLogger('LCMS').setCategory(TraceCategories.lcms);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "logManager", {
        get: function () {
            return this.getLogger('LogManager').setCategory(TraceCategories.logging);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "odata", {
        get: function () {
            return this.getLogger('OData').setCategory(TraceCategories.odata);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "paths", {
        get: function () {
            return this.getLogger('Paths').setCategory(TraceCategories.core);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "profiling", {
        get: function () {
            return this.getLogger('Tracing').setCategory(TraceCategories.profiling);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "restservice", {
        get: function () {
            return this.getLogger('RestService').setCategory(TraceCategories.restservice);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "startup", {
        get: function () {
            return this.getLogger('Startup').setCategory(TraceCategories.app);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "targetPath", {
        get: function () {
            return this.getLogger('TargetPathInterpreter').setCategory(TraceCategories.targetPath);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "page", {
        get: function () {
            return this.getLogger('MDKPage').setCategory(TraceCategories.ui);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "ui", {
        get: function () {
            return this.getLogger('MDK UI').setCategory(TraceCategories.ui);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "validation", {
        get: function () {
            return this.getLogger('Validation').setCategory(TraceCategories.ui);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultLogger.prototype, "valueResolver", {
        get: function () {
            return this.getLogger('ValueResolver').setCategory(TraceCategories.binding);
        },
        enumerable: true,
        configurable: true
    });
    DefaultLogger.prototype.toConsole = function (method, message) {
        _super.prototype.toConsole.call(this, method, "" + message);
    };
    DefaultLogger.prototype.getLogger = function (componentName) {
        if (DefaultLogger._innerInstance) {
            DefaultLogger._innerInstance.componentName = componentName;
        }
        else {
            DefaultLogger._innerInstance = new SharedLogManagerLogger(componentName);
        }
        return DefaultLogger._innerInstance;
    };
    DefaultLogger.ACTION_RUNNING_FAILED = 'Error running action propagating error {0}: {1} : {2}';
    DefaultLogger.APPUPDATE_FAILED = "failure error is '{0}'";
    DefaultLogger.CLIENTSETTINGS_MISSING_APPLICATION = 'Missing application';
    DefaultLogger.CLIENTSETTINGS_MISSING_DEMO_APPLICATION = 'Missing demo application';
    DefaultLogger.DEFINITIONLOADER_APPLICATION_DEFINITIONS_NOT_FOUND = 'No application definitions available.';
    DefaultLogger.ERROR = "Error: {0} {1}";
    DefaultLogger.LOGMANAGER_UPLOAD_FAILED = "upload failed: {0}";
    DefaultLogger.NO_SELECTED_ITEM_FOR_ROW = "There's no selected item for row: {0}";
    DefaultLogger.PATHS_FAILED_ACCESSS_EXTERNAL_STORAGE = "Failed to get the external storage: {0}";
    DefaultLogger.PATHS_FAILED_ACCESSS_INTERNAL_STORAGE = "Failed to get the internal storage: {0}";
    DefaultLogger.STARTUP_EXECUTE_FAILED = "failed to execute startup handler '{0}' error is '{1}'";
    DefaultLogger.STARTUP_LAUNCH_FAILED = "onLaunch failure error is '{0}'";
    DefaultLogger.STARTUP_SETTING_KEY_INCORRECT_VALUE = "Incorrect value in setting for Key '{0}'";
    DefaultLogger.STARTUP_URL_KEY_INCORRECT_VALUE = "Incorrect value in URL for Key '{0}'";
    DefaultLogger.VALUERESOLVER_PARSE_FAILED = "{0} Failed to parse value of {1}: {2}\n Continuing";
    DefaultLogger.INCORRECT_DATE_INPUT = "Incorrect date value on converting to UTC date";
    DefaultLogger.RESOLVE_INITOFFLINEODATA_PROGRESS_TEXT_FAILED = "Failed to resolve InitOfflineOData ProgressText";
    DefaultLogger.UNABLE_TO_FETCH_DATA_FROM_TARGET_SERVICE = 'Unable to fetch data from Target service';
    DefaultLogger.SIDEDRAWER_HEADER_ICON_PARSE_FAILED = 'The SideDrawer header icon parsing has failed.';
    DefaultLogger.FAILED_TO_SET_CLICK_LISTENER = 'Failed to set click listener for Drawer.';
    DefaultLogger.INVALID_JSON_FORMAT = "Invalid JSON format";
    DefaultLogger.CACHE_DIRECTORY_ACCESS_FAILED = 'Failed to access cache directory';
    DefaultLogger.INVALID_OFFLINE_ODATA_INITIALIZE_DEFINITION = 'Unable to parse odata initialize defintions.';
    DefaultLogger.OBSERVABLE_KEYVALUESECTION_BINDING_FAILURE_KEY = 'KeyValueSectionObservable.bind binding failure Key:  \' {0} \'';
    DefaultLogger.OBSERVABLE_KEYVALUESECTION_BINDING_FAILURE_VALUE = 'KeyValueSectionObservable.bind binding failure value:  \' {0} \'';
    DefaultLogger.OBSERVABLE_OBJECTHEADERSECTION_BINDING_FAILED = 'ObjectHeaderSectionObservable binding failed: {0}';
    DefaultLogger.SETITEMCAPTION_TOOLBAR_ITEM_NOT_FOUND = "setItemCaption() toolbar item not found '{0}'";
    DefaultLogger.SETTOOLBARITEMCAPTION_TOOLBAR_NOT_FOUND = "setToolbarItemCaption() toolbar not found {0}";
    DefaultLogger.SETITEMCAPTION_TAB_ITEM_NOT_FOUND = "setItemCaption() tab item not found '{0}'";
    DefaultLogger.GETITEMCAPTION_TAB_ITEM_NOT_FOUND = "getItemCaption() tab item not found '{0}'";
    DefaultLogger.INVALID_FONTICON_UNICODE = "Invalid FontIcon Unicode '{0}'";
    DefaultLogger.UNABLE_TO_GET_SIDEDRAWER_SELECTED_FRAME = 'Unable to get the selected item frame for SideDrawer.';
    DefaultLogger.CLIENTSETTINGS_LOG_FOUND_WITH_VALUE = "{0} found {1} with value: {2}";
    DefaultLogger.CLIENTSETTINGS_NO_VALUE_FOUND_FOR_KEY = "No value found for key: {0}";
    DefaultLogger.CLIENTSETTINGS_PATH_TO_OVERRIDES = "Path to Overrides: {0}";
    DefaultLogger.PATHS_EXTERNAL_STORAGE_MOUNT_STATUS = "Mounted: {0}  | MountedReadOnly {1}";
    DefaultLogger.STARTUP_APP_LAUNCHED_VIA_URL = "In applicationHandleOpenURL - App launched via URL: '{0}'";
    DefaultLogger.STARTUP_APP_URL_PARAM_CHECK_SUCCESS = 'All connection settings received in the URL...Ready to onboard.';
    DefaultLogger.STARTUP_INSIDE_APPLICATIONDIDBECOMEACTIVE_DELEGATE_METHOD = 'Inside applicationDidBecomeActive app delegate method';
    DefaultLogger.STARTUP_INSIDE_APPLICATIONWILLRESIGNACTIVE_DELEGATE_METHOD = 'Inside applicationWillResignActive app delegate method';
    DefaultLogger.STARTUP_READY_FOR_ONBOARDING = 'All settings are available and ready for onboarding';
    DefaultLogger.RESTORING_ONBOARDED_APP = 'Loading...';
    DefaultLogger.LOADMOREITEMS_NOT_SUPPORTED = 'Load more items not supported';
    DefaultLogger.PULL_TO_REFRESH_NOT_SUPPORTED = 'PullToRefresh is not supported';
    DefaultLogger.INVALID_PAGE_DEFINITION = 'Invalid page definition';
    DefaultLogger.ACTION_LOG_LEVEL = "Log level set to: {0}";
    DefaultLogger.ACTION_NATIVE_LOG = "_nativeLog {0}: {1} - propagating error";
    DefaultLogger.APPUPDATE_ROLL_BACK_PREVIOUS = "Rolling back to previous definitions: '{0}'";
    DefaultLogger.SUCCESSFULLY_APPLY_SDK_STYLES = "succesfully applied SDK styles from application path '{0}'";
    DefaultLogger.SUCCESSFULLY_APPLY_STYLES = "succesfully applied styles from application path '{0}'";
    DefaultLogger.DEFINITIONLOADER_LOADING_DEFINITIONS = 'loading application definitions from {0}';
    DefaultLogger.LOGMANAGER_UPLOAD_SUCCEEDED = 'upload succeeded.';
    DefaultLogger.STARTUP_ERROR_IN_APPEVENTDATA_IOS = "{0} error {1}";
    DefaultLogger.STARTUP_PROCESSING_KEYVALUEPAIR = "Processing {0}: '{1}'";
    DefaultLogger.STARTUP_STACKTRACE = "stacktrace: {0}";
    DefaultLogger.STARTUP_STORE_CLIENT_RESET_SUCCEED = 'Store and Client Reset Successfully';
    DefaultLogger.TARGETPATHINTERPRETER_PROCESSING_PATH_SEGMENT = "processing path segment: '{0}'";
    DefaultLogger.VALIDATION_NOT_BOOLEAN = "{0} is not a boolean for key '{1}'";
    DefaultLogger.VALIDATION_NOT_STRING = "{0} is not a string for key '{1}'";
    DefaultLogger.VALIDATION_NOT_SUPPORTED_PROPERTY = "The {0} is not supported validation property";
    DefaultLogger.VALIDATION_NOT_VALID_HEX_COLOR = "{0} is not a valid hex color for key '{1}'";
    DefaultLogger._instance = new DefaultLogger();
    DefaultLogger._innerInstance = null;
    return DefaultLogger;
}(ConsoleLogger));
exports.Logger = DefaultLogger;
var ComponentLogger = (function (_super) {
    __extends(ComponentLogger, _super);
    function ComponentLogger(componentName) {
        var _this = _super.call(this) || this;
        _this._componentName = componentName;
        return _this;
    }
    Object.defineProperty(ComponentLogger.prototype, "componentName", {
        set: function (componentName) {
            this._componentName = componentName;
        },
        enumerable: true,
        configurable: true
    });
    ComponentLogger.prototype.toConsole = function (method, message) {
        _super.prototype.toConsole.call(this, method, message);
    };
    return ComponentLogger;
}(DefaultLogger));
var SharedLogManagerLogger = (function (_super) {
    __extends(SharedLogManagerLogger, _super);
    function SharedLogManagerLogger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SharedLogManagerLogger.prototype.toConsole = function (method, message) {
        _super.prototype.toConsole.call(this, method, message);
        var loggerManager = mdk_sap_2.LoggerManager.getInstance();
        if (loggerManager && loggerManager.isLogSeverityHigher(this.severity)) {
            mdk_sap_1.SharedLoggerManager.log("" + message, method);
        }
    };
    return SharedLogManagerLogger;
}(ComponentLogger));
