"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellCollectionDataBuilder_1 = require("./FormCellCollectionDataBuilder");
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var FilterDataBuilder = (function (_super) {
    __extends(FilterDataBuilder, _super);
    function FilterDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this._displayItemKey = 'FilterProperty';
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellFilter;
        _this.doNotResolveKeys = {
            FilterProperty: true,
        };
        return _this;
    }
    Object.defineProperty(FilterDataBuilder.prototype, "filterItems", {
        get: function () {
            return this.builtData.FilterItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterDataBuilder.prototype, "filterProperty", {
        get: function () {
            return this.builtData.FilterProperty;
        },
        enumerable: true,
        configurable: true
    });
    FilterDataBuilder.prototype.setFilterItems = function (items) {
        this.builtData.FilterItems = items;
        return this;
    };
    return FilterDataBuilder;
}(FormCellCollectionDataBuilder_1.FormCellCollectionDataBuilder));
exports.FilterDataBuilder = FilterDataBuilder;
