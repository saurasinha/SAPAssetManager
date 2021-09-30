"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var SetRegionActionDefinition_1 = require("../definitions/actions/SetRegionActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var SetRegionAction = (function (_super) {
    __extends(SetRegionAction, _super);
    function SetRegionAction(definition) {
        var _this = this;
        if (!(definition instanceof SetRegionActionDefinition_1.SetRegionActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_SETREGIONACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    SetRegionAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        return this._resolveValue(definition.getRegion()).then(function (resolvedRegionValue) {
            _this.context().clientAPI.setRegion(resolvedRegionValue.trim());
            return new ActionResultBuilder_1.ActionResultBuilder().data(resolvedRegionValue).build();
        });
    };
    return SetRegionAction;
}(BaseAction_1.BaseAction));
exports.SetRegionAction = SetRegionAction;
