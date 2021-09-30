"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSection_1 = require("./BaseSection");
var ChartContentSectionObservable_1 = require("../observables/sections/ChartContentSectionObservable");
var ChartContentSection = (function (_super) {
    __extends(ChartContentSection, _super);
    function ChartContentSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChartContentSection.prototype._createObservable = function () {
        return new ChartContentSectionObservable_1.ChartContentSectionObservable(this);
    };
    return ChartContentSection;
}(BaseSection_1.BaseSection));
exports.ChartContentSection = ChartContentSection;
