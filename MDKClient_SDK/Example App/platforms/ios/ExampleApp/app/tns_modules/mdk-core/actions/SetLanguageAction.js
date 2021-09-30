"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var SetLanguageActionDefinition_1 = require("../definitions/actions/SetLanguageActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var SetLanguageAction = (function (_super) {
    __extends(SetLanguageAction, _super);
    function SetLanguageAction(definition) {
        var _this = this;
        if (!(definition instanceof SetLanguageActionDefinition_1.SetLanguageActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_SETLANGUAGEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    SetLanguageAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        return this._resolveValue(definition.getLanguage()).then(function (resolvedLanguageLevel) {
            _this.context().clientAPI.setLanguage(resolvedLanguageLevel.trim());
            return new ActionResultBuilder_1.ActionResultBuilder().data(resolvedLanguageLevel).build();
        });
    };
    return SetLanguageAction;
}(BaseAction_1.BaseAction));
exports.SetLanguageAction = SetLanguageAction;
