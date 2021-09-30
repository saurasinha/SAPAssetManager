"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ObjectHeaderSectionObservable_1 = require("../observables/sections/ObjectHeaderSectionObservable");
var ExtensionBuilder_1 = require("../builders/ui/ExtensionBuilder");
var ExtensionViewDefinition_1 = require("../definitions/ExtensionViewDefinition");
var app = require("tns-core-modules/application");
var HeaderSection_1 = require("./HeaderSection");
var ObjectHeaderSection = (function (_super) {
    __extends(ObjectHeaderSection, _super);
    function ObjectHeaderSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectHeaderSection.prototype.getView = function (row) {
        if (this._props.definition.DetailContentContainer) {
            try {
                if (!this._extensions[0]) {
                    var extensionDefinition = new ExtensionViewDefinition_1.ExtensionViewDefinition('', this._props.definition.DetailContentContainer, this.table.definition());
                    var extensionProps = Object.assign({}, this._props);
                    extensionProps.definition = extensionDefinition;
                    extensionProps.page = this.page;
                    this._extensions[0] = new ExtensionBuilder_1.ExtensionBuilder().build(extensionDefinition, this.observable().binding, extensionProps);
                }
                if (this._extensions[0].viewIsNative()) {
                    return this._extensions[0].view();
                }
                else {
                    if (app.ios) {
                        return this._extensions[0].view().ios;
                    }
                    throw new Error(ErrorMessage_1.ErrorMessage.EXTENSION_NATIVE_VIEW_REQUIRED);
                }
            }
            catch (error) {
                return ExtensionBuilder_1.ExtensionBuilder.createFallbackExtension(error, { page: this.page }).view();
            }
        }
        else {
            return undefined;
        }
    };
    ObjectHeaderSection.prototype.updateProgressBar = function (visible) {
        if (this._sectionBridge) {
            this._sectionBridge.updateProgressBar(visible);
        }
    };
    ObjectHeaderSection.prototype.onAnalyticViewPress = function () {
        return this.observable().onAnalyticViewPress();
    };
    ObjectHeaderSection.prototype._createObservable = function () {
        return new ObjectHeaderSectionObservable_1.ObjectHeaderSectionObservable(this);
    };
    return ObjectHeaderSection;
}(HeaderSection_1.HeaderSection));
exports.ObjectHeaderSection = ObjectHeaderSection;
;
