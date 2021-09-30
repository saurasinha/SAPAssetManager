"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var BaseCollectionSectionObservable_1 = require("./BaseCollectionSectionObservable");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var Logger_1 = require("../../utils/Logger");
var ValueResolver_1 = require("../../utils/ValueResolver");
var KeyValueSectionObservable = (function (_super) {
    __extends(KeyValueSectionObservable, _super);
    function KeyValueSectionObservable(section) {
        var _this = _super.call(this, section) || this;
        _this._keyValuesParamKey = 'items';
        _this._keyValueKeyParam = 'key';
        _this._keyValueValueParam = 'value';
        _this._keyValueVisibleParam = "visible";
        _this._keyValueOnPressParam = 'onPress';
        _this._keyValueLinkColorParam = 'linkColor';
        _this._boundItems = [];
        return _this;
    }
    KeyValueSectionObservable.prototype.bind = function () {
        var _this = this;
        var definition = this.section.definition;
        var targetPromise = Promise.resolve();
        var targetSpecifier = this.getRuntimeSpecifier(definition.data);
        if (targetSpecifier.Target) {
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetSpecifier.Target)) {
                targetPromise = ValueResolver_1.ValueResolver.resolveValue(targetSpecifier.Target, this.section.context, false).then(function (data) {
                    var result = data instanceof observable_array_1.ObservableArray ? data : new observable_array_1.ObservableArray(data || []);
                    if (result && result.length > 0) {
                        _this.binding = result.getItem(0);
                    }
                });
            }
            else {
                targetPromise = EvaluateTarget_1.asService(targetSpecifier, this.section.context).then(function (service) {
                    return _this._readFromService(service).then(function (result) {
                        if (result && result.length > 0) {
                            _this.binding = result.getItem(0);
                        }
                    });
                });
            }
        }
        else if (this._definitionUsesStaticCells()) {
            this._staticCells = true;
        }
        return targetPromise.then(function () {
            return _super.prototype.bind.call(_this).then(function () {
                return Promise.all(definition.KeyAndValues.map(_this._bindKeyValues.bind(_this))).then(function (keyValues) {
                    _this.sectionParameters[_this._keyValuesParamKey] = _this._filterCells(keyValues);
                    _this._boundItems = _this.sectionParameters[_this._keyValuesParamKey];
                    return _this._sectionParameters;
                });
            });
        });
    };
    KeyValueSectionObservable.prototype.getBoundData = function (row) {
        return this._boundItems[row];
    };
    KeyValueSectionObservable.prototype.onPress = function (row) {
        var selectedItem = this.getBoundData(row);
        this.section.page.context.clientAPIProps.actionBinding = selectedItem;
        var onPress = undefined;
        if (selectedItem.onPress) {
            onPress = selectedItem.onPress;
        }
        if (onPress) {
            var handler = this.buildBaseSectionEventHandler();
            return handler.executeActionOrRule(onPress, this.section.context);
        }
        return Promise.resolve();
    };
    KeyValueSectionObservable.prototype.isSectionEmpty = function () {
        return this.section.definition.KeyAndValues.length === 0;
    };
    KeyValueSectionObservable.prototype._filterCells = function (items) {
        return this._filterVisibleCells(items);
    };
    KeyValueSectionObservable.prototype._definitionUsesStaticCells = function () {
        var definition = this.section.definition;
        return !!definition.KeyAndValues && !definition.data.Target;
    };
    KeyValueSectionObservable.prototype._bindKeyValues = function (definition) {
        var _this = this;
        var keyValue = {};
        var promises = [];
        promises.push(this._bindValue(this.binding, 'KeyName', definition.KeyName).then(function (value) {
            if (!value) {
                Logger_1.Logger.instance.ui.warn(Logger_1.Logger.OBSERVABLE_KEYVALUESECTION_BINDING_FAILURE_KEY, definition.KeyName);
            }
            keyValue[_this._keyValueKeyParam] = value || '';
        }));
        promises.push(this._bindValue(this.binding, 'Value', definition.Value).then(function (value) {
            if (value === undefined) {
                Logger_1.Logger.instance.ui.warn(Logger_1.Logger.OBSERVABLE_KEYVALUESECTION_BINDING_FAILURE_VALUE, definition.value);
                keyValue[_this._keyValueValueParam] = '';
            }
            else {
                keyValue[_this._keyValueValueParam] = String(value);
            }
        }));
        promises.push(this._bindValue(this.binding, 'Visible', definition.Visible).then(function (value) {
            if (value !== undefined) {
                keyValue[_this._keyValueVisibleParam] = value;
            }
        }));
        keyValue[this._keyValueOnPressParam] = definition.OnPress;
        if (definition.OnPress) {
            promises.push(this._bindValue(this.binding, 'LinkColor', definition.LinkColor).then(function (value) {
                if (value !== undefined) {
                    keyValue[_this._keyValueLinkColorParam] = value;
                }
            }));
        }
        return Promise.all(promises).then(function () {
            return keyValue;
        });
    };
    return KeyValueSectionObservable;
}(BaseCollectionSectionObservable_1.BaseCollectionSectionObservable));
exports.KeyValueSectionObservable = KeyValueSectionObservable;
