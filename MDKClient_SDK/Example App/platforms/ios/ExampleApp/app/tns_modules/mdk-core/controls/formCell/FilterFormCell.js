"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCell_1 = require("./BaseFormCell");
var FilterFormCellObservable_1 = require("../../observables/FilterFormCellObservable");
var IFilterable_1 = require("../IFilterable");
var ValueResolver_1 = require("../../utils/ValueResolver");
var CommonUtil_1 = require("../../utils/CommonUtil");
var FilterFormCell = (function (_super) {
    __extends(FilterFormCell, _super);
    function FilterFormCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilterFormCell.prototype.getValue = function () {
        return this.getValueWithFilterType(IFilterable_1.FilterType.Filter);
    };
    FilterFormCell.prototype.getCollection = function () {
        return this.observable().getCollection();
    };
    FilterFormCell.prototype.setFilterCriteria = function (filterable) {
        var _this = this;
        var promises = [];
        promises.push(ValueResolver_1.ValueResolver.resolveValue(this.definition().data.FilterProperty, this.context).then(function (result) {
            _this._filterProperty = result;
        }));
        promises.push(ValueResolver_1.ValueResolver.resolveValue(this.definition().data.Caption, this.context).then(function (result) {
            _this._caption = result;
        }));
        return Promise.all(promises).then(function () {
            var filterItem;
            var nameOfColumn;
            var filterValues;
            if (_this._filterProperty instanceof Object) {
                if (Array.isArray(_this._filterProperty)) {
                    filterValues = _this._filterProperty;
                    filterItem = filterable.getFilterCriteria(undefined, filterValues, true);
                }
                else {
                    nameOfColumn = _this._filterProperty.name;
                    filterItem = filterable.getFilterCriteria(nameOfColumn, _this._filterProperty.values);
                }
            }
            else {
                nameOfColumn = _this._filterProperty;
                filterItem = filterable.getFilterCriteria(nameOfColumn, null);
            }
            if (filterItem && filterItem.filterItems.length > 0) {
                var ob_1 = _this.observable();
                if (_this._caption) {
                    ob_1.setFilterCaption(_this._caption);
                }
                else if (filterItem.caption) {
                    ob_1.setFilterCaption(filterItem.caption);
                }
                var myPromise = Promise.resolve();
                if (filterItem.filterItems.length > 0) {
                    myPromise = ob_1.updateCollection(filterItem.filterItems);
                }
                return myPromise.then(function () {
                    var previous = filterable.getSelectedValues();
                    if (previous) {
                        for (var _i = 0, previous_1 = previous; _i < previous_1.length; _i++) {
                            var prevValue = previous_1[_i];
                            if (prevValue.isFilter()) {
                                if (prevValue.name && prevValue.name === nameOfColumn) {
                                    return ob_1.updateSelectedValues(prevValue.filterItems);
                                }
                                else if (prevValue.isArrayFilterProperty === true) {
                                    var allFilterItems = filterItem.filterItems;
                                    if (_this.areAllSelectedValuesPresent(prevValue.filterItems, allFilterItems)) {
                                        return ob_1.updateSelectedValues(prevValue.filterItems);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        return ob_1.updateSelectedValues([]);
                    }
                });
            }
        });
    };
    FilterFormCell.prototype.areAllSelectedValuesPresent = function (selectedItems, allFilterItems) {
        var allFound = 0;
        var valueStr;
        for (var _i = 0, selectedItems_1 = selectedItems; _i < selectedItems_1.length; _i++) {
            var value = selectedItems_1[_i];
            valueStr = value.toString();
            if (valueStr.includes("\'") === true) {
                valueStr = CommonUtil_1.CommonUtil.refineFilterQueryString(valueStr);
            }
            for (var _a = 0, allFilterItems_1 = allFilterItems; _a < allFilterItems_1.length; _a++) {
                var item = allFilterItems_1[_a];
                if (item.ReturnValue.toString() === valueStr) {
                    allFound++;
                    break;
                }
            }
        }
        return allFound && selectedItems.length == allFound;
    };
    FilterFormCell.prototype.onLoaded = function () {
        var _this = this;
        if (this.page().filter && !this._filterProperty) {
            return this.setFilterCriteria(this.page().filter).then(function () {
                _this.updateFormCellModel();
                return true;
            });
        }
        return Promise.resolve(null);
    };
    FilterFormCell.prototype.getValueWithFilterType = function (filterType) {
        var ob = this.observable();
        var selected = ob.getValue();
        var filterItems = [];
        for (var _i = 0, selected_1 = selected; _i < selected_1.length; _i++) {
            var item = selected_1[_i];
            filterItems.push(item.ReturnValue);
        }
        if (this._filterProperty instanceof Object) {
            if (Array.isArray(this._filterProperty)) {
                return new IFilterable_1.FilterCriteria(filterType, undefined, undefined, filterItems, true);
            }
            return new IFilterable_1.FilterCriteria(filterType, this._filterProperty.name, this._filterProperty.caption, filterItems);
        }
        else {
            return new IFilterable_1.FilterCriteria(filterType, this._filterProperty, this._filterProperty, filterItems);
        }
    };
    FilterFormCell.prototype.createObservable = function () {
        return new FilterFormCellObservable_1.FilterFormCellObservable(this, this.definition(), this.page());
    };
    return FilterFormCell;
}(BaseFormCell_1.BaseFormCell));
exports.FilterFormCell = FilterFormCell;
