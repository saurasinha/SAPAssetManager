"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var ChartContentSectionDefinition = (function (_super) {
    __extends(ChartContentSectionDefinition, _super);
    function ChartContentSectionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ChartContentSectionDefinition.prototype, "ChartContent", {
        get: function () {
            return this.data.ChartContent;
        },
        enumerable: true,
        configurable: true
    });
    return ChartContentSectionDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.ChartContentSectionDefinition = ChartContentSectionDefinition;
