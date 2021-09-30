"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCellObservable_1 = require("./BaseFormCellObservable");
var PropertyTypeChecker_1 = require("../utils/PropertyTypeChecker");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ValueResolver_1 = require("../utils/ValueResolver");
var ExtensionFormCellObservable = (function (_super) {
    __extends(ExtensionFormCellObservable, _super);
    function ExtensionFormCellObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ExtensionFormCellObservable.prototype, "binding", {
        get: function () {
            return this._binding || this.control.context.binding;
        },
        enumerable: true,
        configurable: true
    });
    ExtensionFormCellObservable.prototype.bind = function () {
        var _this = this;
        var definition = this.control.definition();
        return this._resolveData(definition)
            .then(function (data) {
            _this._binding = data;
        });
    };
    ExtensionFormCellObservable.prototype.getValue = function () {
        return this.control.getValue();
    };
    ExtensionFormCellObservable.prototype.getView = function () {
        return this.control.getView();
    };
    ExtensionFormCellObservable.prototype.onPress = function (cell, view) {
        return this.control.onPress(cell, view);
    };
    ExtensionFormCellObservable.prototype.setValue = function (value, notify, isTextValue) {
        return this.control.setValue(value, notify, isTextValue);
    };
    ExtensionFormCellObservable.prototype._resolveData = function (definition) {
        var _this = this;
        if (definition.data.Target) {
            var targetDefinition = definition.data.Target;
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetDefinition) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetDefinition)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetDefinition, this.control.context, false).then(function (data) {
                    return Promise.resolve(data || []);
                });
            }
            else {
                return EvaluateTarget_1.asService(definition.data, this.control.context).then(function (service) {
                    return _this._readFromService(service);
                });
            }
        }
        else {
            return Promise.resolve(this.control.context.binding);
        }
    };
    return ExtensionFormCellObservable;
}(BaseFormCellObservable_1.BaseFormCellObservable));
exports.ExtensionFormCellObservable = ExtensionFormCellObservable;
