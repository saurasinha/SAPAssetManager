"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdk_sap_1 = require("mdk-sap");
var ValueResolver_1 = require("../utils/ValueResolver");
var EventHandler_1 = require("../EventHandler");
var Context_1 = require("../context/Context");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ClientEnums_1 = require("../ClientEnums");
var Logger_1 = require("../utils/Logger");
var BaseAction = (function () {
    function BaseAction(definition) {
        this.definition = definition;
        this._debug = false;
        this._defaultIndicatorText = '';
    }
    Object.defineProperty(BaseAction.prototype, "enabled", {
        get: function () {
            var actionResult = new ActionResultBuilder_1.ActionResultBuilder().enabled(true).build();
            return Promise.resolve(actionResult);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "name", {
        get: function () {
            return this.definition.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "type", {
        get: function () {
            return this.definition.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "valid", {
        get: function () {
            var result = Promise.resolve(new ActionResultBuilder_1.ActionResultBuilder().valid(true).build());
            if (this.definition.validationRule) {
                result = this._executeActionOrRule(this.definition.validationRule);
            }
            return result.then(function (validResult) {
                var valid = false;
                if (typeof validResult === 'object' && validResult.status !== undefined) {
                    valid = (validResult.status === ClientEnums_1.ActionExecutionStatus.Valid);
                }
                else if (typeof validResult === 'boolean') {
                    valid = validResult;
                }
                var actionResult = new ActionResultBuilder_1.ActionResultBuilder().valid(valid).build();
                return actionResult;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "defaultIndicatorText", {
        get: function () {
            return this._defaultIndicatorText;
        },
        enumerable: true,
        configurable: true
    });
    BaseAction.prototype.setDefaultIndicatorText = function (defaultIndicatorText) {
        this._defaultIndicatorText = defaultIndicatorText;
    };
    Object.defineProperty(BaseAction.prototype, "source", {
        get: function () {
            return this._source;
        },
        set: function (source) {
            this._source = source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "sourceFrameId", {
        get: function () {
            return this._source ? this._source.frameId : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseAction.prototype, "alwaysParentIfChildIsTabs", {
        get: function () {
            return this._alwaysParentIfChildIsTabs;
        },
        set: function (alwaysParentIfChildIsTabs) {
            this._alwaysParentIfChildIsTabs = alwaysParentIfChildIsTabs;
        },
        enumerable: true,
        configurable: true
    });
    BaseAction.prototype.execute = function () {
        var actionResult = new ActionResultBuilder_1.ActionResultBuilder().build();
        return Promise.resolve(actionResult);
    };
    BaseAction.prototype.onCompletion = function (result) {
        return Promise.resolve(result);
    };
    BaseAction.prototype.onFailure = function (result) {
        return this._handleActionStepComplete(result, this.definition.failureAction);
    };
    BaseAction.prototype.onInvalid = function (result) {
        return this._handleActionStepComplete(result, this.definition.invalidAction);
    };
    BaseAction.prototype.onSuccess = function (result) {
        return this._handleActionStepComplete(result, this.definition.successAction);
    };
    BaseAction.prototype.context = function () {
        return Context_1.Context.fromPage(this._source);
    };
    BaseAction.prototype._debugLog = function (message) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this._debug) {
            (_a = Logger_1.Logger.instance.action).log.apply(_a, __spreadArrays([message], args));
        }
    };
    BaseAction.prototype._executeActionOrRule = function (handler) {
        if (handler) {
            var oEventHandler = new EventHandler_1.EventHandler();
            if (this.source) {
                oEventHandler.setEventSource(this.source);
            }
            return oEventHandler.executeActionOrRule(handler, Context_1.Context.fromPage(this.source));
        }
        return Promise.resolve(new ActionResultBuilder_1.ActionResultBuilder().build());
    };
    BaseAction.prototype._logAction = function (message, level) {
        var _this = this;
        var logMessage = this._resolveValue(message);
        var logLevel = this._resolveValue(level);
        return Promise.all([logMessage, logLevel]).then(function (definitionValues) {
            return _this._nativeLog(definitionValues);
        });
    };
    BaseAction.prototype._resolveValue = function (value) {
        return ValueResolver_1.ValueResolver.resolveValue(value, this.context());
    };
    BaseAction.prototype._nativeLog = function (definitionValues) {
        try {
            return mdk_sap_1.LoggerManager.getInstance().log(definitionValues[0], definitionValues[1]);
        }
        catch (error) {
            this._debugLog("_nativeLog " + this.name + ":\u00A0" + error + " - propagating error");
            throw error;
        }
    };
    BaseAction.prototype._saveActionResult = function (result, actionResult) {
        var _this = this;
        var saveResultPromise = Promise.resolve();
        if (actionResult && actionResult._Name) {
            saveResultPromise = ValueResolver_1.ValueResolver.resolveValue(actionResult._Name, this.context()).then(function (resolved) {
                _this.context().clientData.actionResults[resolved] = result;
            });
        }
        return saveResultPromise;
    };
    BaseAction.prototype._deleteAllActionResults = function () {
        this.context().clientData.actionResults = {};
    };
    BaseAction.prototype._handleActionStepComplete = function (result, nextActionStep) {
        var _this = this;
        var completionPromise = Promise.resolve();
        if (nextActionStep) {
            completionPromise = this._saveActionResult(result, this.definition.actionResult);
        }
        else {
            this._deleteAllActionResults();
        }
        return completionPromise.then(function () {
            return _this._executeActionOrRule(nextActionStep);
        });
    };
    return BaseAction;
}());
exports.BaseAction = BaseAction;
;
