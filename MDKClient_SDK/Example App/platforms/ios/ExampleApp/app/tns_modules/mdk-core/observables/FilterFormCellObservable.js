"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionFormCellObservable_1 = require("./BaseCollectionFormCellObservable");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var CommonUtil_1 = require("../utils/CommonUtil");
var FilterFormCellObservable = (function (_super) {
    __extends(FilterFormCellObservable, _super);
    function FilterFormCellObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._DISPLAYED_ITEMS_KEY = 'FilterProperty';
        return _this;
    }
    FilterFormCellObservable.prototype.setValue = function (value, notify, isTextValue) {
        var _this = this;
        var oldValue = this._target;
        this._valueChanged = false;
        return this._updateTarget(value)
            .then(function () {
            return _this._assignItems();
        }).then(function () {
            return _this._assignSelections();
        }).then(function () {
            if (_this._isValueChanged(oldValue)) {
                _this._valueChanged = true;
                return _this.onValueChange(notify);
            }
            else {
                return Promise.resolve();
            }
        });
    };
    FilterFormCellObservable.prototype.setFilterItems = function (items) {
        var builder = this.builder;
        if (items.length === 0 || typeof items[0] === 'string') {
            builder.setFilterItems(items);
        }
        else {
            var displayItems = items.map(function (item) {
                return item.DisplayValue;
            });
            builder.setFilterItems(displayItems);
        }
    };
    FilterFormCellObservable.prototype.setFilterCaption = function (caption) {
        var builder = this.builder;
        builder.setCaption(caption);
    };
    FilterFormCellObservable.prototype.updateCollection = function (items) {
        this.setFilterItems(items);
        this._collection = [];
        return this._bindCollection(new observable_array_1.ObservableArray(items));
    };
    ;
    FilterFormCellObservable.prototype.updateSelectedValues = function (values) {
        var valueNumbers = [];
        var idx = 0;
        var valueStr;
        for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
            var value = values_1[_i];
            idx = 0;
            valueStr = value.toString();
            if (valueStr.includes("\'") === true) {
                valueStr = CommonUtil_1.CommonUtil.refineFilterQueryString(valueStr);
            }
            for (var _a = 0, _b = this._collection; _a < _b.length; _a++) {
                var item = _b[_a];
                if (item.ReturnValue.toString() === valueStr) {
                    valueNumbers.push(idx);
                    break;
                }
                idx++;
            }
        }
        var builder = this.builder;
        builder.setValue(valueNumbers);
        return this.setValue(valueNumbers, false);
    };
    return FilterFormCellObservable;
}(BaseCollectionFormCellObservable_1.BaseCollectionFormCellObservable));
exports.FilterFormCellObservable = FilterFormCellObservable;
