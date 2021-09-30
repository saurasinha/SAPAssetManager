"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("../BaseAction");
var SetStateActionDefinition_1 = require("../../definitions/actions/logger/SetStateActionDefinition");
var mdk_sap_1 = require("mdk-sap");
var ActionResultBuilder_1 = require("../../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var AppSettingsManager_1 = require("../../utils/AppSettingsManager");
var SetStateAction = (function (_super) {
    __extends(SetStateAction, _super);
    function SetStateAction(actionDefinition) {
        var _this = this;
        if (!(actionDefinition instanceof SetStateActionDefinition_1.SetStateActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_SETSTATEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, actionDefinition) || this;
        return _this;
    }
    SetStateAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        var promises = [this._resolveValue(definition.getLogFileName()),
            this._resolveValue(definition.getMaxFileSize()),
            this._resolveValue(definition.getLoggerState())];
        return Promise.all(promises).then(function (values) {
            return _this.setLoggerState(values[0], values[1], values[2]).then(function (data) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        });
    };
    SetStateAction.prototype.setLoggerState = function (logfileName, logfileSize, state) {
        var size = 1;
        if (logfileSize) {
            size = parseInt(logfileSize, 10);
            if (isNaN(size)) {
                size = 1;
            }
        }
        var isTurnedOn = mdk_sap_1.LoggerManager.getInstance().isTurnedOn();
        if (state.toLowerCase() === 'on' || (isTurnedOn === false && state.toLowerCase() === 'toggle')) {
            var savedLogFileName = AppSettingsManager_1.AppSettingsManager.instance().getString('AppModeler_logFileName');
            var savedFileSize = AppSettingsManager_1.AppSettingsManager.instance().getNumber('AppModeler_logFileSize');
            if (logfileName !== savedLogFileName || savedFileSize !== size) {
                mdk_sap_1.LoggerManager.clearLog();
                mdk_sap_1.LoggerManager.init(logfileName, size);
            }
        }
        if (!mdk_sap_1.LoggerManager.getInstance()[state.toLowerCase()]) {
            throw new Error(ErrorMessage_1.ErrorMessage.DEFINED_STATE_NOT_VALID);
        }
        return mdk_sap_1.LoggerManager.getInstance()[state.toLowerCase()]();
    };
    return SetStateAction;
}(BaseAction_1.BaseAction));
exports.SetStateAction = SetStateAction;
