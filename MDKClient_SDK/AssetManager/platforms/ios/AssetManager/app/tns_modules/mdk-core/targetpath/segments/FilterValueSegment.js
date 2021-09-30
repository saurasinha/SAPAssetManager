"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var FilterValueSegment = (function (_super) {
    __extends(FilterValueSegment, _super);
    function FilterValueSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilterValueSegment.prototype.resolve = function () {
        if (!this.context.element || !this.context.element.getFilterValue) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.NO_VALUE_IN_CONTROL, this.context.element));
        }
        return new Context_1.Context(this.context.element.getFilterValue());
    };
    FilterValueSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    return FilterValueSegment;
}(ISegment_1.ISegment));
exports.FilterValueSegment = FilterValueSegment;
