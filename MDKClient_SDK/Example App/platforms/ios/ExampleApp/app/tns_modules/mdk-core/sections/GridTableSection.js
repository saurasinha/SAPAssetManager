"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseTableSection_1 = require("./BaseTableSection");
var GridTableSectionObservable_1 = require("../observables/sections/GridTableSectionObservable");
var GridTableSection = (function (_super) {
    __extends(GridTableSection, _super);
    function GridTableSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridTableSection.prototype._createObservable = function () {
        return new GridTableSectionObservable_1.GridTableSectionObservable(this);
    };
    return GridTableSection;
}(BaseTableSection_1.BaseTableSection));
exports.GridTableSection = GridTableSection;
;
