"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSection_1 = require("./BaseSection");
var AnalyticCardCollectionSectionObservable_1 = require("../observables/sections/AnalyticCardCollectionSectionObservable");
var AnalyticCardCollectionSection = (function (_super) {
    __extends(AnalyticCardCollectionSection, _super);
    function AnalyticCardCollectionSection() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnalyticCardCollectionSection.prototype.getBoundData = function (row) {
        return this.observable().getBoundData(row);
    };
    AnalyticCardCollectionSection.prototype.loadMoreItems = function () {
        return this.observable().loadMoreItems();
    };
    AnalyticCardCollectionSection.prototype.onPress = function (analyticCard) {
        return this.observable().onPress(analyticCard);
    };
    AnalyticCardCollectionSection.prototype._createObservable = function () {
        return new AnalyticCardCollectionSectionObservable_1.AnalyticCardCollectionSectionObservable(this);
    };
    return AnalyticCardCollectionSection;
}(BaseSection_1.BaseSection));
exports.AnalyticCardCollectionSection = AnalyticCardCollectionSection;
