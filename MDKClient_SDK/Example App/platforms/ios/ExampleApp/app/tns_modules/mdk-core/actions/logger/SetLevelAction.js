"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("../BaseAction");
var SetLevelActionDefinition_1 = require("../../definitions/actions/logger/SetLevelActionDefinition");
var mdk_sap_1 = require("mdk-sap");
var ActionResultBuilder_1 = require("../../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var SetLevelAction = (function (_super) {
    __extends(SetLevelAction, _super);
    function SetLevelAction(actionDefinition) {
        var _this = this;
        if (!(actionDefinition instanceof SetLevelActionDefinition_1.SetLevelActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_SETLEVELACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, actionDefinition) || this;
        return _this;
    }
    SetLevelAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        return this._resolveValue(definition.getLevel()).then(function (resolvedLogLevel) {
            return _this.setLoggerLevel(resolvedLogLevel).then(function (data) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        });
    };
    SetLevelAction.prototype.setLoggerLevel = function (resolvedLogLevel) {
        var _this = this;
        return mdk_sap_1.LoggerManager.getInstance().setLevel(resolvedLogLevel).then(function (result) {
            _this._debugLog('ACTION_LOG_LEVEL', resolvedLogLevel);
            return result;
        });
    };
    return SetLevelAction;
}(BaseAction_1.BaseAction));
exports.SetLevelAction = SetLevelAction;
