"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterFormCellObservable_1 = require("./FilterFormCellObservable");
var SorterFormCellObservable = (function (_super) {
    __extends(SorterFormCellObservable, _super);
    function SorterFormCellObservable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._DISPLAYED_ITEMS_KEY = 'SortByItems';
        return _this;
    }
    return SorterFormCellObservable;
}(FilterFormCellObservable_1.FilterFormCellObservable));
exports.SorterFormCellObservable = SorterFormCellObservable;
