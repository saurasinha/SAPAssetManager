"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellCollectionDataBuilder_1 = require("./FormCellCollectionDataBuilder");
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var SegmentedDataBuilder = (function (_super) {
    __extends(SegmentedDataBuilder, _super);
    function SegmentedDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this._displayItemKey = 'Segments';
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellSegmentedControl;
        _this.doNotResolveKeys = {
            Segments: true,
        };
        return _this;
    }
    return SegmentedDataBuilder;
}(FormCellCollectionDataBuilder_1.FormCellCollectionDataBuilder));
exports.SegmentedDataBuilder = SegmentedDataBuilder;
