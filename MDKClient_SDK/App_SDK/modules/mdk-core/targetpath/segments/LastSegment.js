"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IndexSegment_1 = require("./IndexSegment");
var LastSegment = (function (_super) {
    __extends(LastSegment, _super);
    function LastSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LastSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    LastSegment.prototype.getIndex = function (indexable) {
        return indexable.length - 1;
    };
    return LastSegment;
}(IndexSegment_1.IndexSegment));
exports.LastSegment = LastSegment;
