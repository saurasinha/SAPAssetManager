"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ContextToIndexable_1 = require("../../context/ContextToIndexable");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var IndexSegment = (function (_super) {
    __extends(IndexSegment, _super);
    function IndexSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IndexSegment.prototype.resolve = function () {
        var indexable = ContextToIndexable_1.ContextToIndexable(this.context);
        if (indexable.length === 0) {
            throw new Error(ErrorMessage_1.ErrorMessage.INDEXABLE_LIST_IS_EMPTY);
        }
        var contextForItemByIndex;
        var elementLength;
        var index = this.getIndex(indexable);
        var itemByIndex = indexable.getItem(index);
        if (itemByIndex) {
            contextForItemByIndex = new Context_1.Context(itemByIndex);
        }
        if (!contextForItemByIndex) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CANNOT_GET_ELEMENT_BY_INDEX, index, indexable.length));
        }
        return contextForItemByIndex;
    };
    IndexSegment.prototype.getIndex = function (indexable) {
        return parseInt(this.specifier, 10);
    };
    return IndexSegment;
}(ISegment_1.ISegment));
exports.IndexSegment = IndexSegment;
