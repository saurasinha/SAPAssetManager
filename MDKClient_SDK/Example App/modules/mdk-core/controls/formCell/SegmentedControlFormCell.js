"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCell_1 = require("./BaseFormCell");
var SegmentedFormCellObservable_1 = require("../../observables/SegmentedFormCellObservable");
var SegmentedControlFormCell = (function (_super) {
    __extends(SegmentedControlFormCell, _super);
    function SegmentedControlFormCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SegmentedControlFormCell.prototype.getValue = function () {
        return this.observable().getValue();
    };
    SegmentedControlFormCell.prototype.getCollection = function () {
        return this.observable().getCollection();
    };
    SegmentedControlFormCell.prototype.createObservable = function () {
        return new SegmentedFormCellObservable_1.SegmentedFormCellObservable(this, this.definition(), this.page());
    };
    return SegmentedControlFormCell;
}(BaseFormCell_1.BaseFormCell));
exports.SegmentedControlFormCell = SegmentedControlFormCell;
