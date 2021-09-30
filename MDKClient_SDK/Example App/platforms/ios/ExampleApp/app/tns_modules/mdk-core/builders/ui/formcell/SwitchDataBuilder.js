"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellDataBuilder_1 = require("./FormCellDataBuilder");
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var SwitchDataBuilder = (function (_super) {
    __extends(SwitchDataBuilder, _super);
    function SwitchDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellSwitch;
        return _this;
    }
    return SwitchDataBuilder;
}(FormCellDataBuilder_1.FormCellDataBuilder));
exports.SwitchDataBuilder = SwitchDataBuilder;
