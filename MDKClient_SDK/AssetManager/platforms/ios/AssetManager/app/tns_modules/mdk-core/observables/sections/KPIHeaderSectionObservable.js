"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionObservable_1 = require("./BaseSectionObservable");
var ValueResolver_1 = require("../../utils/ValueResolver");
var Context_1 = require("../../context/Context");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var app = require("tns-core-modules/application");
var KPIHeaderSectionObservable = (function (_super) {
    __extends(KPIHeaderSectionObservable, _super);
    function KPIHeaderSectionObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KPIHeaderSectionObservable.prototype.bind = function () {
        var definition = this.section.definition;
        var KPIHeader = definition.KPIHeader;
        return this.bindKPIData(KPIHeader);
    };
    KPIHeaderSectionObservable.prototype.bindKPIData = function (KPIDef) {
        var _this = this;
        var promises = [];
        var kpiPromises = [];
        Object.keys(KPIDef).forEach(function (key) {
            switch (key) {
                case KPIHeaderSectionObservable._kpiItemsKey:
                    promises.push(new Promise(function (resolve) {
                        var properties = {};
                        properties[key] = {};
                        var kpiHeaderValue = KPIDef[key];
                        var kpiItemsPromises = [];
                        kpiHeaderValue.forEach(function (kpiItemDefinition) {
                            kpiPromises.push(_this._resolveData(kpiItemDefinition).then(function (kpiItemResolvedValue) {
                                kpiItemResolvedValue = _this._getValidBindObject(kpiItemResolvedValue);
                                var kpiViewItems = {};
                                var _loop_1 = function (kpiViewItemKey) {
                                    if (kpiViewItemKey !== 'OnPress') {
                                        if (kpiItemDefinition.hasOwnProperty(kpiViewItemKey)) {
                                            if (kpiViewItemKey === 'Target') {
                                                return "continue";
                                            }
                                            kpiItemsPromises.push(_this._bindValue(kpiItemResolvedValue, kpiViewItemKey, kpiItemDefinition[kpiViewItemKey]).then(function (newValue) {
                                                kpiViewItems[kpiViewItemKey] = newValue;
                                            }));
                                        }
                                    }
                                    else {
                                        kpiViewItems[kpiViewItemKey] = kpiItemDefinition[kpiViewItemKey];
                                    }
                                };
                                for (var kpiViewItemKey in kpiItemDefinition) {
                                    _loop_1(kpiViewItemKey);
                                }
                                return Promise.all(kpiItemsPromises).then(function () {
                                    return kpiViewItems;
                                });
                            }));
                        });
                        return Promise.all(kpiPromises).then(function (kpiItems) {
                            properties[key] = kpiItems;
                            resolve(properties);
                        });
                    }));
                    break;
                case KPIHeaderSectionObservable._stylesKey:
                    var oContext = new Context_1.Context(_this.binding, _this.section.table);
                    promises.push(ValueResolver_1.ValueResolver.resolveValue(KPIDef[key], oContext).then(function (styles) {
                        var properties = {};
                        properties[key] = {};
                        var stylePromises = [];
                        Object.keys(styles).forEach(function (target) {
                            stylePromises.push(_this._bindValue(_this.binding, target + 'Style', styles[target]).then(function (newStyle) {
                                properties[key][target] = newStyle;
                            }));
                        });
                        return Promise.all(stylePromises).then(function () {
                            return properties;
                        });
                    }));
                    break;
                default: break;
            }
        });
        return _super.prototype.bind.call(this).then(function () {
            return Promise.all(promises).then(function (items) {
                var paramsObject;
                if (app.ios) {
                    paramsObject = JSON.stringify(items);
                }
                else {
                    paramsObject = {};
                    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                        var item = items_1[_i];
                        Object.assign(paramsObject, item);
                    }
                }
                _this.sectionParameters[KPIHeaderSectionObservable.ITEMS_PARAM_KEY] = paramsObject;
                return _this.sectionParameters;
            });
        });
    };
    KPIHeaderSectionObservable.prototype.onItemPress = function (item) {
        var selectedItem = this.section.definition.KPIHeader.KPIItems[item];
        return this.executeItemOnPress(selectedItem);
    };
    KPIHeaderSectionObservable.prototype.executeItemOnPress = function (selectedItem) {
        if (selectedItem && selectedItem.OnPress) {
            var handler = this.buildBaseSectionEventHandler();
            return handler.executeActionOrRule(selectedItem.OnPress, this.section.context);
        }
        return Promise.resolve();
    };
    KPIHeaderSectionObservable.prototype._resolveData = function (definition) {
        var _this = this;
        if (definition.Target) {
            var targetDefinition = definition.Target;
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isGlobal(targetDefinition)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetDefinition, this.section.context, false).then(function (data) {
                    return (data || {});
                });
            }
            else {
                return EvaluateTarget_1.asService(definition, this.section.context).then(function (service) {
                    return _this._readFromService(service).then(function (result) {
                        return result.length > 0 ? result.getItem(0) : {};
                    });
                });
            }
        }
        else {
            return Promise.resolve(this.section.context.binding);
        }
    };
    KPIHeaderSectionObservable.ITEMS_PARAM_KEY = 'items';
    KPIHeaderSectionObservable._kpiItemsKey = 'KPIItems';
    return KPIHeaderSectionObservable;
}(BaseSectionObservable_1.BaseSectionObservable));
exports.KPIHeaderSectionObservable = KPIHeaderSectionObservable;
