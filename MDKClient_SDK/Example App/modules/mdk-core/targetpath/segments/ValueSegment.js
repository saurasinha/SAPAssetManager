"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ValueSegment = (function (_super) {
    __extends(ValueSegment, _super);
    function ValueSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ValueSegment.prototype.resolve = function () {
        if (!this.context.element || !this.context.element.getValue) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.NO_VALUE_IN_CONTROL, this.context.element));
        }
        return new Context_1.Context(this.context.element.getValue());
    };
    ValueSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    return ValueSegment;
}(ISegment_1.ISegment));
exports.ValueSegment = ValueSegment;
