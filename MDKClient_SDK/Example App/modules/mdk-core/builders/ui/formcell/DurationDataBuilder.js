"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellDataBuilder_1 = require("./FormCellDataBuilder");
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var DurationDataBuilder = (function (_super) {
    __extends(DurationDataBuilder, _super);
    function DurationDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellDurationPicker;
        return _this;
    }
    Object.defineProperty(DurationDataBuilder.prototype, "originalUnit", {
        get: function () {
            return this.builtData.DefUnit;
        },
        enumerable: true,
        configurable: true
    });
    DurationDataBuilder.prototype.setOriginalUnit = function (defUnit) {
        this.builtData.DefUnit = defUnit;
        return this;
    };
    DurationDataBuilder.prototype.setUnit = function (unit) {
        this.builtData.Unit = unit;
        return this;
    };
    return DurationDataBuilder;
}(FormCellDataBuilder_1.FormCellDataBuilder));
exports.DurationDataBuilder = DurationDataBuilder;
