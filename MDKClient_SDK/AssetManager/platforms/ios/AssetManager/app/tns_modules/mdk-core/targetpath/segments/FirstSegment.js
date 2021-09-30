"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IndexSegment_1 = require("./IndexSegment");
var FirstSegment = (function (_super) {
    __extends(FirstSegment, _super);
    function FirstSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FirstSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    FirstSegment.prototype.getIndex = function (indexable) {
        return 0;
    };
    return FirstSegment;
}(IndexSegment_1.IndexSegment));
exports.FirstSegment = FirstSegment;
