"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchDataBuilder_1 = require("./SearchDataBuilder");
var FormCellCollectionDataBuilder = (function (_super) {
    __extends(FormCellCollectionDataBuilder, _super);
    function FormCellCollectionDataBuilder(context, definition) {
        return _super.call(this, context, definition) || this;
    }
    FormCellCollectionDataBuilder.prototype.setDisplayedItems = function (items) {
        return this.setBuildDataPropertyValue(this._displayItemKey, items);
    };
    FormCellCollectionDataBuilder.prototype.setSelectedItems = function (items) {
        this.setValue(items);
        return this;
    };
    return FormCellCollectionDataBuilder;
}(SearchDataBuilder_1.SearchDataBuilder));
exports.FormCellCollectionDataBuilder = FormCellCollectionDataBuilder;
