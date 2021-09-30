"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("../BaseAction");
var LogMessageActionDefinition_1 = require("../../definitions/actions/logger/LogMessageActionDefinition");
var ActionResultBuilder_1 = require("../../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var LogMessageAction = (function (_super) {
    __extends(LogMessageAction, _super);
    function LogMessageAction(actionDefinition) {
        var _this = this;
        if (!(actionDefinition instanceof LogMessageActionDefinition_1.LogMessageActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_LOGMESSAGEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, actionDefinition) || this;
        return _this;
    }
    LogMessageAction.prototype.execute = function () {
        var definition = this.definition;
        return this._logAction(definition.getMessage(), definition.getLevel()).then(function (data) {
            return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
        });
    };
    return LogMessageAction;
}(BaseAction_1.BaseAction));
exports.LogMessageAction = LogMessageAction;
