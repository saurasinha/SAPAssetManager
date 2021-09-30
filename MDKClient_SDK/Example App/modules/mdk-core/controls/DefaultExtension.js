"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControl_1 = require("../controls/BaseControl");
var ValueResolver_1 = require("../utils/ValueResolver");
var Logger_1 = require("../utils/Logger");
var mdk_sap_1 = require("mdk-sap");
var DefaultExtension = (function (_super) {
    __extends(DefaultExtension, _super);
    function DefaultExtension(_className) {
        var _this = _super.call(this) || this;
        _this._className = _className;
        return _this;
    }
    DefaultExtension.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
        var bridge = new mdk_sap_1.SwiftExtension();
        this._viewController = bridge.create(this._className, this.extensionProperties, this);
        this._delegate = bridge.getDelegate();
        this.redraw();
    };
    DefaultExtension.prototype.view = function () {
        return this._viewController.view;
    };
    DefaultExtension.prototype.viewIsNative = function () {
        return true;
    };
    Object.defineProperty(DefaultExtension.prototype, "extensionProperties", {
        get: function () {
            var definition = this.definition();
            if (definition && definition.data
                && definition.data.hasOwnProperty('ExtensionProperties')) {
                return definition.data.ExtensionProperties;
            }
            return {};
        },
        enumerable: true,
        configurable: true
    });
    DefaultExtension.prototype.executeAction = function (mActionPath) {
        Logger_1.Logger.instance.action.log("executeAction with path " + mActionPath);
        return _super.prototype.executeAction.call(this, mActionPath);
    };
    DefaultExtension.prototype.update = function (params) {
        this.bridge.updateParams(params || {});
    };
    DefaultExtension.prototype.redraw = function () {
        var value = this._props.page.context.binding;
        this.bridge.onControlValueChanged(value);
    };
    DefaultExtension.prototype.setControlValue = function (value) {
        Logger_1.Logger.instance.ui.log("setControlValue with value " + value);
        this.setValue(value, false);
    };
    DefaultExtension.prototype.executeActionOrRule = function (definitionPath) {
        var _this = this;
        Logger_1.Logger.instance.ui.log("executeActionOrRule with value " + definitionPath);
        return this.executeAction(definitionPath)
            .then(function (result) {
            _this.bridge.actionOrRuleResult(result.data ? result.data.toString() : '');
        });
    };
    DefaultExtension.prototype.resolveValue = function (value) {
        var _this = this;
        Logger_1.Logger.instance.ui.log("resolveValue with value " + value);
        ValueResolver_1.ValueResolver.resolveValue(value, this.context)
            .then(function (result) {
            _this.bridge.resolvedValue(result);
        });
    };
    return DefaultExtension;
}(BaseControl_1.BaseControl));
exports.DefaultExtension = DefaultExtension;
