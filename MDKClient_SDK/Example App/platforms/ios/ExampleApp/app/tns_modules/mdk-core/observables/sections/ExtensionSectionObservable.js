"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionObservable_1 = require("./BaseSectionObservable");
var PropertyTypeChecker_1 = require("../../utils/PropertyTypeChecker");
var EvaluateTarget_1 = require("../../data/EvaluateTarget");
var ValueResolver_1 = require("../../utils/ValueResolver");
var ExtensionSectionObservable = (function (_super) {
    __extends(ExtensionSectionObservable, _super);
    function ExtensionSectionObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._heightParamKey = 'Height';
        return _this;
    }
    ExtensionSectionObservable.prototype.bind = function () {
        var _this = this;
        var definition = this.section.definition;
        return this._resolveData(definition)
            .then(function (data) {
            _this.binding = data;
            return _super.prototype.bind.call(_this).then(function () {
                return _this._bindValue(_this.binding, 'Height', definition.height);
            });
        }).then(function (value) {
            _this._sectionParameters[_this._heightParamKey] = value;
            return _this._sectionParameters;
        });
    };
    ExtensionSectionObservable.prototype._resolveData = function (definition) {
        var _this = this;
        var targetSpecifier = this.getRuntimeSpecifier(definition.data);
        if (targetSpecifier.Target) {
            if (PropertyTypeChecker_1.PropertyTypeChecker.isTargetPath(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isBinding(targetSpecifier.Target) ||
                PropertyTypeChecker_1.PropertyTypeChecker.isRule(targetSpecifier.Target)) {
                return ValueResolver_1.ValueResolver.resolveValue(targetSpecifier.Target, this.section.context, false).then(function (data) {
                    return Promise.resolve(data || []);
                });
            }
            else {
                return EvaluateTarget_1.asService(targetSpecifier, this.section.context).then(function (service) {
                    return _this._readFromService(service);
                });
            }
        }
        else {
            return Promise.resolve(this.section.context.binding);
        }
    };
    return ExtensionSectionObservable;
}(BaseSectionObservable_1.BaseSectionObservable));
exports.ExtensionSectionObservable = ExtensionSectionObservable;
