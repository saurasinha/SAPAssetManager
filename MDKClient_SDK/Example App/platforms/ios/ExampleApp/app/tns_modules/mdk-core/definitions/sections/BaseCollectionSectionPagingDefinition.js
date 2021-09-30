"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseCollectionSectionDefinition_1 = require("./BaseCollectionSectionDefinition");
var BaseCollectionSectionPagingDefinition = (function (_super) {
    __extends(BaseCollectionSectionPagingDefinition, _super);
    function BaseCollectionSectionPagingDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseCollectionSectionPagingDefinition.prototype.getDataPaging = function () {
        if (this.data.DataPaging) {
            return this.data.DataPaging;
        }
        else {
            return null;
        }
    };
    Object.defineProperty(BaseCollectionSectionPagingDefinition.prototype, "highlightSelectedItem", {
        get: function () {
            return this.data.HighlightSelectedItem;
        },
        enumerable: true,
        configurable: true
    });
    return BaseCollectionSectionPagingDefinition;
}(BaseCollectionSectionDefinition_1.BaseCollectionSectionDefinition));
exports.BaseCollectionSectionPagingDefinition = BaseCollectionSectionPagingDefinition;
;
