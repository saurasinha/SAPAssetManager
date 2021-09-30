"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var SelectedValueSegment = (function (_super) {
    __extends(SelectedValueSegment, _super);
    function SelectedValueSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectedValueSegment.prototype.resolve = function () {
        if (!this.context.element || !this.context.element.getValue) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.NO_VALUE_IN_CONTROL, this.context.element));
        }
        var controlElement = this.context.element.getValue();
        if (controlElement instanceof Array) {
            if (controlElement.length > 0) {
                if (controlElement[0].hasOwnProperty('ReturnValue')) {
                    return new Context_1.Context(controlElement[0].ReturnValue);
                }
            }
        }
        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.NO_VALUE_IN_SELECTED_ELEMENT, this.context.element));
    };
    SelectedValueSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    return SelectedValueSegment;
}(ISegment_1.ISegment));
exports.SelectedValueSegment = SelectedValueSegment;
