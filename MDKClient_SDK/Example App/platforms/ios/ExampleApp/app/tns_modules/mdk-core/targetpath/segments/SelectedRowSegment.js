"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var SelectedRowSegment = (function (_super) {
    __extends(SelectedRowSegment, _super);
    function SelectedRowSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectedRowSegment.prototype.resolve = function () {
        var list = this.context.element;
        if (list.selectedIndex !== undefined) {
            return new Context_1.Context(list.selectedIndex);
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.FIND_ROW_IN_NON_LIST_CONTROL_NOT_ALLOWED);
        }
    };
    SelectedRowSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    return SelectedRowSegment;
}(ISegment_1.ISegment));
exports.SelectedRowSegment = SelectedRowSegment;
