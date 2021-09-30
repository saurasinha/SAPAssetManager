"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionSectionObservable_1 = require("./BaseCollectionSectionObservable");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var Context_1 = require("../../context/Context");
var Logger_1 = require("../../utils/Logger");
var ValueResolver_1 = require("../../utils/ValueResolver");
var BaseNoPagingSectionObservable = (function (_super) {
    __extends(BaseNoPagingSectionObservable, _super);
    function BaseNoPagingSectionObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._objectID = 'ObjectID';
        _this._itemsParamKey = 'items';
        return _this;
    }
    Object.defineProperty(BaseNoPagingSectionObservable.prototype, "binding", {
        get: function () {
            return (this._data && this._data.length) ? this._data : this.section.context.binding;
        },
        enumerable: true,
        configurable: true
    });
    BaseNoPagingSectionObservable.prototype.bind = function () {
        var _this = this;
        var definition = this.section.definition;
        return this._resolveData(definition).then(function (data) {
            _this._data = data;
            return _super.prototype.bind.call(_this).then(function (_sectionParameters) {
                _this._sectionParameters = Object.assign(_sectionParameters || {});
                _this._setMaxItemCount();
                var rowBindings = [];
                for (var i = 0; i < _this._maxItemCount; i++) {
                    rowBindings.push(_this._bindRow(i, _this._data.getItem(i), _this._definitionForRow(i)));
                }
                return Promise.all(rowBindings).then(function (items) {
                    _this.sectionParameters[_this._itemsParamKey] = _this._filterCells(items);
                    return _this._sectionParameters;
                });
            });
        });
    };
    BaseNoPagingSectionObservable.prototype.getData = function () {
        return this.sectionParameters[this._itemsParamKey];
    };
    BaseNoPagingSectionObservable.prototype.getItem = function (row) {
        if (this._data && this._data !== undefined && row <= this._data.length) {
            return this._data.getItem(row);
        }
    };
    BaseNoPagingSectionObservable.prototype.onPress = function (cell) {
        var handler = this.buildBaseSectionEventHandler();
        var adjustedCell = this.adjustForHiddenRows(cell);
        var selectedItem = this.getItem(adjustedCell);
        this.section.page.context.clientAPIProps.actionBinding = selectedItem;
        var onPress = undefined;
        if (this._staticCells && selectedItem && selectedItem.onPress) {
            onPress = selectedItem.onPress;
            this.section.page.context.clientAPIProps.actionBinding = Context_1.Context.fromPage(handler.getEventSource()).binding || selectedItem;
        }
        else {
            if (this.section.definition.onPress !== undefined) {
                onPress = this.section.definition.onPress;
            }
        }
        return handler.executeActionOrRule(onPress, this.section.context);
    };
    BaseNoPagingSectionObservable.prototype.isSectionEmpty = function () {
        return !this._data || this._data.length === 0;
    };
    BaseNoPagingSectionObservable.prototype._bindRow = function (row, bindingObject, definition) {
        var _this = this;
        bindingObject = this._getValidBindObject(bindingObject);
        var promises = [];
        var item = {};
        item[this._objectID] = row;
        var cell = definition[this.genericCellPropertyName];
        this._setDisableSelectionStyle(cell, item);
        item[this._visibleKey] = cell["Visible"];
        return this._bindStyles(cell, bindingObject).then(function (styles) {
            if (styles) {
                item[BaseNoPagingSectionObservable._stylesKey] = styles;
            }
            Object.keys(cell).forEach(function (key) {
                var itemKey = _this._keyToItemKey(key);
                if (itemKey && itemKey !== 'Styles') {
                    promises.push(_this._bindValue(bindingObject, key, cell[key], styles && styles.hasOwnProperty(key) ? styles[key] : null).then(function (value) {
                        item[itemKey] = value;
                    }));
                }
            });
            return Promise.all(promises).then(function () {
                return item;
            });
        });
    };
    BaseNoPagingSectionObservable.prototype._definitionForRow = function (row) {
        if (this._staticCells) {
            return this._data.getItem(row);
        }
        else {
            return this.section.definition;
        }
    };
    BaseNoPagingSectionObservable.prototype._resolveData = function (definition) {
        var _this = this;
        var targetSpecifier = this.getRuntimeSpecifier(definition.data);
        if (targetSpecifier.Target) {
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetSpecifier.Target)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetSpecifier.Target, this.section.context, false).then(function (data) {
                    var resolvedData = data instanceof observable_array_1.ObservableArray ? data : new observable_array_1.ObservableArray(data || []);
                    return Promise.resolve(resolvedData);
                });
            }
            else {
                var origQuery_1 = targetSpecifier.Target.QueryOptions;
                return EvaluateTarget_1.asService(targetSpecifier, this.section.context).then(function (service) {
                    targetSpecifier.Target.QueryOptions = origQuery_1;
                    return _this._readFromService(service).then(function (data) {
                        return data;
                    }).catch(function (error) {
                        Logger_1.Logger.instance.ui.error(Logger_1.Logger.ERROR, error, error.stack);
                        return undefined;
                    }).then(function (data) {
                        return data;
                    });
                });
            }
        }
        else if (definition[this.genericCellAggregationPropertyName]) {
            return Promise.all(definition[this.genericCellAggregationPropertyName]).then(function (cells) {
                _this._staticCells = true;
                return new observable_array_1.ObservableArray(cells.map(function (cell) {
                    return new _this.genericSectionDefinitionClass('', cell, _this);
                }));
            });
        }
    };
    BaseNoPagingSectionObservable.prototype._setMaxItemCount = function () {
        this._maxItemCount = this._data ? this._data.length : 0;
    };
    return BaseNoPagingSectionObservable;
}(BaseCollectionSectionObservable_1.BaseCollectionSectionObservable));
exports.BaseNoPagingSectionObservable = BaseNoPagingSectionObservable;
