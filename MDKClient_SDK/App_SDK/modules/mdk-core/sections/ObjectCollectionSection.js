"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ExtensionBuilder_1 = require("../builders/ui/ExtensionBuilder");
var ObjectTableSection_1 = require("./ObjectTableSection");
var ExtensionViewDefinition_1 = require("../definitions/ExtensionViewDefinition");
var ObjectCollectionSection = (function (_super) {
    __extends(ObjectCollectionSection, _super);
    function ObjectCollectionSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectCollectionSection.prototype.getView = function (rowNum) {
        if (!this._extensionDefinition) {
            this._extensionDefinition = new ExtensionViewDefinition_1.ExtensionViewDefinition('', this.definition.data.Extension, this.table.definition());
        }
        try {
            if (!this.extensions[rowNum]) {
                var extensionBuilder = new ExtensionBuilder_1.ExtensionBuilder();
                var extensionProps = Object.assign({ row: rowNum }, this._props);
                extensionProps.definition = this._extensionDefinition;
                extensionProps.page = this.page;
                var binding = void 0;
                if (this.observable().binding.getItem) {
                    binding = this.observable().binding.getItem(rowNum);
                }
                this.extensions[rowNum] = extensionBuilder.build(this._extensionDefinition, binding, extensionProps);
            }
            if (this.extensions[rowNum].viewIsNative()) {
                return this.extensions[rowNum].view();
            }
            else {
                if (app.ios) {
                    return this.extensions[rowNum].view().ios;
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
    return ObjectCollectionSection;
}(ObjectTableSection_1.ObjectTableSection));
exports.ObjectCollectionSection = ObjectCollectionSection;
;
