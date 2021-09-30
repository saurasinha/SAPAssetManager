"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterFormCell_1 = require("./FilterFormCell");
var SorterFormCellObservable_1 = require("../../observables/SorterFormCellObservable");
var IFilterable_1 = require("../IFilterable");
var SorterFormCell = (function (_super) {
    __extends(SorterFormCell, _super);
    function SorterFormCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SorterFormCell.prototype.getValue = function () {
        return this.getValueWithFilterType(IFilterable_1.FilterType.Sorter);
    };
    SorterFormCell.prototype.setFilterCriteria = function (filterable) {
        var ob = this.observable();
        var previous = filterable.getSelectedValues();
        if (previous) {
            for (var _i = 0, previous_1 = previous; _i < previous_1.length; _i++) {
                var prevValue = previous_1[_i];
                if (prevValue.isSorter() && prevValue.filterItems) {
                    return ob.updateSelectedValues(prevValue.filterItems);
                }
            }
        }
        else {
            var sorterCriteria = filterable.getSorterCriteria(this.definition().name);
            var initialSorterCriteria = void 0;
            if (sorterCriteria !== null) {
                initialSorterCriteria = sorterCriteria.filterItems;
            }
            if (initialSorterCriteria) {
                var decodedSorterCriteria = initialSorterCriteria.map(function (sorterFromQueryOptions) {
                    var decodedSorterFromQueryOptions;
                    if (typeof sorterFromQueryOptions === 'string') {
                        decodedSorterFromQueryOptions = decodeURI(sorterFromQueryOptions);
                    }
                    return decodedSorterFromQueryOptions;
                });
                return ob.updateSelectedValues(decodedSorterCriteria);
            }
        }
        return Promise.resolve();
    };
    SorterFormCell.prototype.createObservable = function () {
        return new SorterFormCellObservable_1.SorterFormCellObservable(this, this.definition(), this.page());
    };
    return SorterFormCell;
}(FilterFormCell_1.FilterFormCell));
exports.SorterFormCell = SorterFormCell;
