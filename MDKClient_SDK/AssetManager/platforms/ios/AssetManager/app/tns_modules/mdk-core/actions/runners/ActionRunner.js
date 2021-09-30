"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientEnums_1 = require("../../ClientEnums");
var mdk_sap_1 = require("mdk-sap");
var ActionResultBuilder_1 = require("../../builders/actions/ActionResultBuilder");
var Logger_1 = require("../../utils/Logger");
var ValueResolver_1 = require("../../utils/ValueResolver");
var I18nHelper_1 = require("../../utils/I18nHelper");
var ActionRunner = (function () {
    function ActionRunner() {
        this._handlerRan = false;
        this._actionResult = new ActionResultBuilder_1.ActionResultBuilder().build();
    }
    ActionRunner.prototype.run = function (action) {
        var _this = this;
        return this._showIndicator(action).then(function () {
            return _this._beginExecution(action).catch(function (error) {
                _this._dismissIndicator(action);
                if (error instanceof Error) {
                    _this._actionResult.error = error;
                }
                else if (ActionResultBuilder_1.ActionResultBuilder.implementsIActionResult(error)) {
                    _this._actionResult = error;
                }
                if (_this._actionResult.status !== ClientEnums_1.ActionExecutionStatus.Invalid &&
                    _this._actionResult.status !== ClientEnums_1.ActionExecutionStatus.Canceled &&
                    _this._actionResult.enabled) {
                    _this._actionResult.status = ClientEnums_1.ActionExecutionStatus.Failed;
                    Logger_1.Logger.instance.action.error(Logger_1.Logger.ACTION_RUNNING_FAILED, action.name, error, error ? error.stack : '');
                    if (!_this._handlerRan) {
                        return _this._runFailure(action).then(function () {
                            throw error;
                        });
                    }
                }
                throw error;
            });
        });
    };
    ActionRunner.prototype._beginExecution = function (action) {
        var _this = this;
        return action.enabled.then(function (actionResult) {
            _this._actionResult.enabled = actionResult.enabled;
            if (_this._actionResult.enabled) {
                return _this._runValid(action);
            }
            _this._actionResult.enabled = false;
            return Promise.reject(_this._actionResult);
        });
    };
    ActionRunner.prototype._runExecute = function (action) {
        var _this = this;
        return action.execute().then(function (actionResult) {
            _this._actionResult.data = actionResult.data;
            _this._actionResult.status = actionResult.status;
            var promise;
            if (_this._actionResult.status === ClientEnums_1.ActionExecutionStatus.Success) {
                promise = _this._runSuccess(action);
            }
            else if (_this._actionResult.status === ClientEnums_1.ActionExecutionStatus.Failed) {
                promise = _this._runFailure(action);
            }
            if (promise) {
                return promise.then(function (actionResults) {
                    return action.onCompletion(_this._actionResult);
                }).catch(function (error) {
                    _this._actionResult.status = ClientEnums_1.ActionExecutionStatus.Failed;
                    action.onCompletion(_this._actionResult);
                    throw error;
                });
            }
            return Promise.reject(_this._actionResult);
        });
    };
    ActionRunner.prototype._runInvalid = function (action) {
        this._handlerRan = true;
        this._dismissIndicator(action);
        return action.onInvalid(this._actionResult);
    };
    ActionRunner.prototype._runSuccess = function (action) {
        this._handlerRan = true;
        this._dismissIndicator(action);
        return action.onSuccess(this._actionResult);
    };
    ActionRunner.prototype._runFailure = function (action) {
        this._handlerRan = true;
        this._dismissIndicator(action);
        return action.onFailure(this._actionResult);
    };
    ActionRunner.prototype._runValid = function (action) {
        var _this = this;
        return action.valid.then(function (actionResult) {
            _this._actionResult.data = actionResult.data;
            _this._actionResult.status = actionResult.status;
            if (_this._actionResult.status !== ClientEnums_1.ActionExecutionStatus.Invalid) {
                return _this._runExecute(action);
            }
            return _this._runInvalid(action).then(function () {
                return Promise.reject(_this._actionResult);
            });
        });
    };
    ActionRunner.prototype._showIndicator = function (action) {
        if (action.definition.showActivityIndicator) {
            var canResolve_1 = ValueResolver_1.ValueResolver.canResolve(action.definition.activityIndicatorText);
            var textPromise_1;
            return ValueResolver_1.ValueResolver.resolveValue(action.definition.activityIndicatorText).then(function (result) {
                if (result !== undefined &&
                    ((canResolve_1 && result !== action.definition.activityIndicatorText) ||
                        !canResolve_1)) {
                    textPromise_1 = Promise.resolve(result);
                }
                else {
                    textPromise_1 = Promise.resolve(I18nHelper_1.I18nHelper.localizeMDKText(action.defaultIndicatorText));
                }
                return textPromise_1.then(function (finalResult) {
                    return mdk_sap_1.ActivityIndicator.instance.show(finalResult, action);
                });
            });
        }
        return Promise.resolve(void 0);
    };
    ActionRunner.prototype._dismissIndicator = function (action) {
        if (action.definition.showActivityIndicator) {
            mdk_sap_1.ActivityIndicator.instance.dismiss(action);
        }
    };
    return ActionRunner;
}());
exports.ActionRunner = ActionRunner;
