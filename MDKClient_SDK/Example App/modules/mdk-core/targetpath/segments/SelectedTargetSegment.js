"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var SelectedTargetSegment = (function (_super) {
    __extends(SelectedTargetSegment, _super);
    function SelectedTargetSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectedTargetSegment.prototype.resolve = function () {
        var control = this.context.element;
        if (!control || control.selectedIndex === undefined) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_EVALUATE_SELECTED_INDEX_OF_CONTROL);
        }
        return new Context_1.Context(control.view().items.getItem(control.selectedIndex));
    };
    SelectedTargetSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    return SelectedTargetSegment;
}(ISegment_1.ISegment));
exports.SelectedTargetSegment = SelectedTargetSegment;
