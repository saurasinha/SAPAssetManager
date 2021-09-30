"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ClientDataSegment = (function (_super) {
    __extends(ClientDataSegment, _super);
    function ClientDataSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClientDataSegment.prototype.resolve = function () {
        if (!this.context.element) {
            throw new Error(ErrorMessage_1.ErrorMessage.NOT_GET_CLIENTDATA_FOR_CONTEXT);
        }
        return new Context_1.Context(this.context.clientData);
    };
    ClientDataSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    return ClientDataSegment;
}(ISegment_1.ISegment));
exports.ClientDataSegment = ClientDataSegment;
