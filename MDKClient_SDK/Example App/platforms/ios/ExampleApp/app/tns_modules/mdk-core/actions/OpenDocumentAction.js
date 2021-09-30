"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var OpenDocumentActionDefinition_1 = require("../definitions/actions/OpenDocumentActionDefinition");
var mdk_sap_1 = require("mdk-sap");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var OpenDocumentAction = (function (_super) {
    __extends(OpenDocumentAction, _super);
    function OpenDocumentAction(definition) {
        var _this = this;
        if (!(definition instanceof OpenDocumentActionDefinition_1.OpenDocumentActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_OPENDOCUMENTACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    OpenDocumentAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        return this._resolveValue(definition.getPath()).then(function (documentPath) {
            var pressedItem = _this.context().clientAPIProps.pressedItem;
            return mdk_sap_1.OpenDocumentBridge.getInstance().openWithPath(pressedItem, documentPath).then(function (data) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        });
    };
    return OpenDocumentAction;
}(BaseAction_1.BaseAction));
exports.OpenDocumentAction = OpenDocumentAction;
;
