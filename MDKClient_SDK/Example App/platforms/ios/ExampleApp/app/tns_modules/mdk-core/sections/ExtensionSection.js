"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var BaseSection_1 = require("./BaseSection");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var EventHandler_1 = require("../EventHandler");
var ExtensionSectionObservable_1 = require("../observables/sections/ExtensionSectionObservable");
var ExtensionBuilder_1 = require("../builders/ui/ExtensionBuilder");
var ExtensionViewDefinition_1 = require("../definitions/ExtensionViewDefinition");
var Logger_1 = require("../utils/Logger");
var ExecuteSource_1 = require("../common/ExecuteSource");
var ExtensionSection = (function (_super) {
    __extends(ExtensionSection, _super);
    function ExtensionSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExtensionSection.prototype.onPress = function (cell, view) {
        if (this.definition.onPress !== undefined) {
            var handler = new EventHandler_1.EventHandler();
            var source = new ExecuteSource_1.ExecuteSource(this.page.frame.id);
            handler.setEventSource(source, this.context);
            return handler.executeActionOrRule(this.definition.onPress, this.context)
                .catch(function (e) { return Logger_1.Logger.instance.extension.error(e); });
        }
    };
    ExtensionSection.prototype.getView = function () {
        try {
            if (this.extensions.length <= 0) {
                var obs = this.observable();
                var extensionDefinition = new ExtensionViewDefinition_1.ExtensionViewDefinition('', this.definition.data, this.table.definition());
                var extensionProps = Object.assign({}, this._props);
                extensionProps.definition = extensionDefinition;
                extensionProps.page = this.page;
                this._extensions.push(new ExtensionBuilder_1.ExtensionBuilder().build(extensionDefinition, this.observable().binding, extensionProps));
            }
            if (this._extensions[0].viewIsNative()) {
                return this._extensions[0].view();
            }
            else {
                if (app.ios) {
                    return this._extensions[0].view().ios;
                }
                else if (app.android) {
                    throw new Error(ErrorMessage_1.ErrorMessage.EXTENSION_NATIVE_VIEW_REQUIRED);
                }
            }
        }
        catch (error) {
            return ExtensionBuilder_1.ExtensionBuilder.createFallbackExtension(error, { page: this.page }).view();
        }
    };
    ExtensionSection.prototype._createObservable = function () {
        return new ExtensionSectionObservable_1.ExtensionSectionObservable(this);
    };
    return ExtensionSection;
}(BaseSection_1.BaseSection));
exports.ExtensionSection = ExtensionSection;
;
