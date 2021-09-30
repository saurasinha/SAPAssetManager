"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var SetThemeActionDefinition_1 = require("../definitions/actions/SetThemeActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var StyleHelper_1 = require("../utils/StyleHelper");
var SetThemeAction = (function (_super) {
    __extends(SetThemeAction, _super);
    function SetThemeAction(definition) {
        var _this = this;
        if (!(definition instanceof SetThemeActionDefinition_1.SetThemeActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_SETTHEMEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    SetThemeAction.prototype.execute = function () {
        var definition = this.definition;
        return this._resolveValue(definition.getTheme()).then(function (resolvedTheme) {
            var result = StyleHelper_1.StyleHelper.setTheme(resolvedTheme);
            if (result) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(resolvedTheme).build();
            }
            else {
                return new ActionResultBuilder_1.ActionResultBuilder().failed().data('invalid theme').build();
            }
        });
    };
    return SetThemeAction;
}(BaseAction_1.BaseAction));
exports.SetThemeAction = SetThemeAction;
