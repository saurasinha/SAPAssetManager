"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
var FilterType;
(function (FilterType) {
    FilterType[FilterType["Filter"] = 1] = "Filter";
    FilterType[FilterType["Sorter"] = 2] = "Sorter";
})(FilterType = exports.FilterType || (exports.FilterType = {}));
var FilterActionResult = (function () {
    function FilterActionResult(filter, sorter) {
        this._filter = filter;
        this._sorter = sorter;
    }
    Object.defineProperty(FilterActionResult.prototype, "filter", {
        get: function () {
            return this._filter;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterActionResult.prototype, "sorter", {
        get: function () {
            return this._sorter;
        },
        enumerable: true,
        configurable: true
    });
    return FilterActionResult;
}());
exports.FilterActionResult = FilterActionResult;
var FilterCriteria = (function () {
    function FilterCriteria(type, name, caption, filterItems, isArrayFilterProperty) {
        if (isArrayFilterProperty === void 0) { isArrayFilterProperty = false; }
        this._type = type;
        this._name = name;
        this._caption = caption;
        this._filterItems = filterItems;
        this._isArrayFilterProperty = isArrayFilterProperty;
    }
    FilterCriteria.prototype.isFilter = function () {
        return this._type === FilterType.Filter;
    };
    FilterCriteria.prototype.isSorter = function () {
        return this._type === FilterType.Sorter;
    };
    Object.defineProperty(FilterCriteria.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterCriteria.prototype, "caption", {
        get: function () {
            return this._caption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterCriteria.prototype, "filterItems", {
        get: function () {
            return this._filterItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FilterCriteria.prototype, "isArrayFilterProperty", {
        get: function () {
            return this._isArrayFilterProperty;
        },
        enumerable: true,
        configurable: true
    });
    return FilterCriteria;
}());
exports.FilterCriteria = FilterCriteria;
