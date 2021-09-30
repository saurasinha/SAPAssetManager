"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ActionResultsSegment = (function (_super) {
    __extends(ActionResultsSegment, _super);
    function ActionResultsSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionResultsSegment.prototype.resolve = function () {
        var target = this.context.clientData.actionResults;
        if (!target || !target[this.specifier]) {
            throw new Error(ErrorMessage_1.ErrorMessage.NOT_GET_ACTION_RESULT_FOR_CONTEXT);
        }
        return new Context_1.Context(target[this.specifier]);
    };
    ActionResultsSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    return ActionResultsSegment;
}(ISegment_1.ISegment));
exports.ActionResultsSegment = ActionResultsSegment;
