"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellDataBuilder_1 = require("./FormCellDataBuilder");
var BaseControlDefinition_1 = require("src/definitions/controls/BaseControlDefinition");
var SignatureCaptureDataBuilder = (function (_super) {
    __extends(SignatureCaptureDataBuilder, _super);
    function SignatureCaptureDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellSignatureCapture;
        return _this;
    }
    return SignatureCaptureDataBuilder;
}(FormCellDataBuilder_1.FormCellDataBuilder));
exports.SignatureCaptureDataBuilder = SignatureCaptureDataBuilder;
