"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellCollectionDataBuilder_1 = require("./FormCellCollectionDataBuilder");
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var ListPickerDataBuilder = (function (_super) {
    __extends(ListPickerDataBuilder, _super);
    function ListPickerDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this._displayItemKey = 'PickerItems';
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellListPicker;
        _this.doNotResolveKeys = {
            PickerItems: true,
        };
        return _this;
    }
    Object.defineProperty(ListPickerDataBuilder.prototype, "staticCollection", {
        get: function () {
            return this.builtData.IsStaticCollection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPickerDataBuilder.prototype, "requiresUniqueIdentifiers", {
        get: function () {
            return this.builtData.IsDataSourceRequiringUniqueIdentifiers;
        },
        enumerable: true,
        configurable: true
    });
    ListPickerDataBuilder.prototype.setStaticCollection = function (state) {
        this.builtData.IsStaticCollection = state;
        return this;
    };
    ListPickerDataBuilder.prototype.setUniqueIdentifiers = function (state) {
        this.builtData.IsDataSourceRequiringUniqueIdentifiers = state;
        return this;
    };
    ListPickerDataBuilder.prototype.setUsesObjectCells = function (state) {
        this.builtData.UsesObjectCells = state;
        return this;
    };
    Object.defineProperty(ListPickerDataBuilder.prototype, "pickerItems", {
        get: function () {
            return this.builtData.PickerItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPickerDataBuilder.prototype, "isLazyLoadingIndicatorEnabled", {
        get: function () {
            return this.builtData.DataPaging && this.builtData.DataPaging.ShowLoadingIndicator ? true : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPickerDataBuilder.prototype, "pageSize", {
        get: function () {
            return this.builtData.DataPaging && this.builtData.DataPaging.PageSize && this.builtData.DataPaging.PageSize > 0
                ? this.builtData.DataPaging.PageSize : 50;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ListPickerDataBuilder.prototype, "allowDefaultValueIfOneItem", {
        get: function () {
            return this.builtData.AllowDefaultValueIfOneItem ? this.builtData.AllowDefaultValueIfOneItem : false;
        },
        enumerable: true,
        configurable: true
    });
    return ListPickerDataBuilder;
}(FormCellCollectionDataBuilder_1.FormCellCollectionDataBuilder));
exports.ListPickerDataBuilder = ListPickerDataBuilder;
