"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ContextToIndexable_1 = require("../../context/ContextToIndexable");
var CountSegment = (function (_super) {
    __extends(CountSegment, _super);
    function CountSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CountSegment.prototype.resolve = function () {
        var indexable = ContextToIndexable_1.ContextToIndexable(this.context);
        return new Context_1.Context(indexable.length);
    };
    CountSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    return CountSegment;
}(ISegment_1.ISegment));
exports.CountSegment = CountSegment;
