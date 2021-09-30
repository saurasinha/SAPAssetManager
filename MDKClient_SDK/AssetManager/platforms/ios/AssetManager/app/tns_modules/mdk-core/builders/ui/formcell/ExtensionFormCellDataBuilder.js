"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellDataBuilder_1 = require("./FormCellDataBuilder");
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var ExtensionFormCellDataBuilder = (function (_super) {
    __extends(ExtensionFormCellDataBuilder, _super);
    function ExtensionFormCellDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellExtension;
        _this.doNotResolveKeys = {
            ExtensionProperties: true,
        };
        return _this;
    }
    return ExtensionFormCellDataBuilder;
}(FormCellDataBuilder_1.FormCellDataBuilder));
exports.ExtensionFormCellDataBuilder = ExtensionFormCellDataBuilder;
