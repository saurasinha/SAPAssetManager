"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionDefinition_1 = require("./BaseSectionDefinition");
var BaseSectionPagingDefinition = (function (_super) {
    __extends(BaseSectionPagingDefinition, _super);
    function BaseSectionPagingDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseSectionPagingDefinition.prototype.getDataPaging = function () {
        if (this.data.DataPaging) {
            return this.data.DataPaging;
        }
        else {
            return null;
        }
    };
    Object.defineProperty(BaseSectionPagingDefinition.prototype, "highlightSelectedItem", {
        get: function () {
            return this.data.HighlightSelectedItem;
        },
        enumerable: true,
        configurable: true
    });
    return BaseSectionPagingDefinition;
}(BaseSectionDefinition_1.BaseSectionDefinition));
exports.BaseSectionPagingDefinition = BaseSectionPagingDefinition;
;
