"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../../utils/Logger");
var app = require("tns-core-modules/application");
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var ValueResolver_1 = require("../../utils/ValueResolver");
var BaseSectionObservable_1 = require("./BaseSectionObservable");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var ChartContentSectionObservable = (function (_super) {
    __extends(ChartContentSectionObservable, _super);
    function ChartContentSectionObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._data = new observable_array_1.ObservableArray();
        return _this;
    }
    ChartContentSectionObservable.prototype.bind = function () {
        var _this = this;
        var definition = this.section.definition;
        var chartContent = definition.ChartContent;
        var promises = [];
        return this._resolveData(definition).then(function (resolvedData) {
            _this.binding = resolvedData;
            Object.keys(chartContent).forEach(function (key) {
                promises.push(_this._bindValue(_this.binding, key, chartContent[key]).then(function (value) {
                    var properties = {};
                    properties[key] = value;
                    return properties;
                }));
            });
        }).catch(function (error) {
            Logger_1.Logger.instance.ui.error(error + " " + error.stack);
        }).then(function () {
            return _super.prototype.bind.call(_this).then(function () {
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
                    _this.sectionParameters[ChartContentSectionObservable.ITEMS_PARAM_KEY] = paramsObject;
                    return _this.sectionParameters;
                });
            });
        });
    };
    ChartContentSectionObservable.prototype.getTargetSpecifier = function () {
        var targetSpecifier;
        if (this._targetSpecifier && this._targetSpecifier.Target) {
            targetSpecifier = this._targetSpecifier;
        }
        else {
            targetSpecifier = { 'Target': undefined };
            if (this.section.definition.ChartContent.Target) {
                targetSpecifier.Target = Object.assign({}, this.section.definition.ChartContent.Target);
            }
        }
        return targetSpecifier;
    };
    ChartContentSectionObservable.prototype._resolveData = function (definition) {
        var _this = this;
        var targetSpecifier = this.getRuntimeSpecifier(definition.data.ChartContent);
        if (targetSpecifier.Target) {
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isGlobal(targetSpecifier.Target)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetSpecifier.Target, this.section.context, false).then(function (data) {
                    return (data || {});
                });
            }
            else {
                return EvaluateTarget_1.asService(targetSpecifier, this.section.context).then(function (service) {
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
    ChartContentSectionObservable.ITEMS_PARAM_KEY = 'items';
    return ChartContentSectionObservable;
}(BaseSectionObservable_1.BaseSectionObservable));
exports.ChartContentSectionObservable = ChartContentSectionObservable;
