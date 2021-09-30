"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseNoPagingSectionObservable_1 = require("./BaseNoPagingSectionObservable");
var SimplePropertyCollectionSectionDefinition_1 = require("../../definitions/sections/SimplePropertyCollectionSectionDefinition");
var Logger_1 = require("../../utils/Logger");
var Context_1 = require("../../context/Context");
var ValueResolver_1 = require("../../utils/ValueResolver");
var SimplePropertyCollectionSectionObservable = (function (_super) {
    __extends(SimplePropertyCollectionSectionObservable, _super);
    function SimplePropertyCollectionSectionObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._accessoryTypeParamKey = 'accessoryType';
        _this._keyNameParamKey = 'keyName';
        _this._valueParamKey = 'value';
        _this._stylesKey = 'Styles';
        return _this;
    }
    Object.defineProperty(SimplePropertyCollectionSectionObservable.prototype, "genericCellAggregationPropertyName", {
        get: function () {
            return 'simplePropertyCells';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePropertyCollectionSectionObservable.prototype, "genericCellPropertyName", {
        get: function () {
            return 'simplePropertyCell';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimplePropertyCollectionSectionObservable.prototype, "genericSectionDefinitionClass", {
        get: function () {
            return SimplePropertyCollectionSectionDefinition_1.SimplePropertyCollectionSectionDefinition;
        },
        enumerable: true,
        configurable: true
    });
    SimplePropertyCollectionSectionObservable.prototype._bindRow = function (row, bindingObject, definition) {
        var _this = this;
        bindingObject = this._getValidBindObject(bindingObject);
        var promises = [];
        var item = {};
        item[this._objectID] = row;
        var cell = definition[this.genericCellPropertyName];
        this._setDisableSelectionStyle(cell, item);
        Object.keys(cell).forEach(function (key) {
            var itemKey = _this._keyToItemKey(key);
            if (itemKey) {
                if (itemKey === 'Styles') {
                    item[itemKey] = item[itemKey] || {};
                    var oContext = new Context_1.Context(bindingObject, _this.section.table);
                    promises.push(ValueResolver_1.ValueResolver.resolveValue(cell[key], oContext).then(function (styles) {
                        var stylePromises = [];
                        Object.keys(styles).map(function (target, id) {
                            stylePromises.push(_this._bindValue(bindingObject, target + 'Style', styles[target]).then(function (newStyle) {
                                item[itemKey][target] = newStyle;
                            }));
                        });
                        return Promise.all(stylePromises);
                    }));
                }
                else {
                    promises.push(_this._bindValue(bindingObject, key, cell[key]).then(function (value) {
                        item[itemKey] = value;
                    }));
                }
            }
        });
        return Promise.all(promises).then(function () {
            return item;
        });
    };
    SimplePropertyCollectionSectionObservable.prototype._keyToItemKey = function (key) {
        switch (key) {
            case 'AccessoryType':
                return this._accessoryTypeParamKey;
            case 'KeyName':
                return this._keyNameParamKey;
            case 'Value':
                return this._valueParamKey;
            case 'Styles':
                return this._stylesKey;
            case 'OnPress':
                return undefined;
            case 'Visible':
                return this._visibleKey;
            default:
                Logger_1.Logger.instance.ui.log("_keyToItemKey unrecognized key " + key);
                return undefined;
        }
    };
    SimplePropertyCollectionSectionObservable.prototype._setMaxItemCount = function () {
        if (this.section.definition.usePreviewMode) {
            this._maxItemCount = Math.min(this.sectionParameters[this._maxItemCountParamKey], this._data ?
                this._data.length : 0);
        }
        else {
            this._maxItemCount = this._data ? this._data.length : 0;
        }
    };
    SimplePropertyCollectionSectionObservable.prototype._filterCells = function (items) {
        return this._filterVisibleCells(items);
    };
    return SimplePropertyCollectionSectionObservable;
}(BaseNoPagingSectionObservable_1.BaseNoPagingSectionObservable));
exports.SimplePropertyCollectionSectionObservable = SimplePropertyCollectionSectionObservable;
