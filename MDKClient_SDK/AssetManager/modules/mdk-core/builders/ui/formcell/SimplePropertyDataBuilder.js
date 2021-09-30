"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellDataBuilder_1 = require("./FormCellDataBuilder");
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var SimplePropertyDataBuilder = (function (_super) {
    __extends(SimplePropertyDataBuilder, _super);
    function SimplePropertyDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellSimpleProperty;
        return _this;
    }
    SimplePropertyDataBuilder.prototype.setKeyName = function (keyName) {
        this.builtData.KeyName = keyName;
        return this;
    };
    return SimplePropertyDataBuilder;
}(FormCellDataBuilder_1.FormCellDataBuilder));
exports.SimplePropertyDataBuilder = SimplePropertyDataBuilder;
