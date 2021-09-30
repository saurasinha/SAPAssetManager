"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionSectionDefinition_1 = require("./BaseCollectionSectionDefinition");
var AnalyticCardCollectionSectionDefinition = (function (_super) {
    __extends(AnalyticCardCollectionSectionDefinition, _super);
    function AnalyticCardCollectionSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "AnalyticCards", {
        get: function () {
            return this.data.AnalyticCards || [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "AnalyticCard", {
        get: function () {
            return this.data.AnalyticCard;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "onPress", {
        get: function () {
            return this.data.AnalyticCard.OnPress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "dataSeries", {
        get: function () {
            return this.data.ChartCard.DataSeries;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "seriesTitles", {
        get: function () {
            return this.data.ChartCard.SeriesTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "title", {
        get: function () {
            return this.data.ChartCard.Title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "subTitle", {
        get: function () {
            return this.data.ChartCard.Subtitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "trendTitle", {
        get: function () {
            return this.data.ChartCard.TrendTitle;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "statusText", {
        get: function () {
            return this.data.ChartCard.StatusText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "leadingUnit", {
        get: function () {
            return this.data.ChartCard.LeadingUnit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "trailingUnit", {
        get: function () {
            return this.data.ChartCard.TrailingUnit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AnalyticCardCollectionSectionDefinition.prototype, "metric", {
        get: function () {
            return this.data.ChartCard.Metric;
        },
        enumerable: true,
        configurable: true
    });
    return AnalyticCardCollectionSectionDefinition;
}(BaseCollectionSectionDefinition_1.BaseCollectionSectionDefinition));
exports.AnalyticCardCollectionSectionDefinition = AnalyticCardCollectionSectionDefinition;
