"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FilterDataBuilder_1 = require("./FilterDataBuilder");
var SorterDataBuilder = (function (_super) {
    __extends(SorterDataBuilder, _super);
    function SorterDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this._displayItemKey = 'SortByItems';
        _this.doNotResolveKeys = {
            SortByItems: true,
        };
        return _this;
    }
    return SorterDataBuilder;
}(FilterDataBuilder_1.FilterDataBuilder));
exports.SorterDataBuilder = SorterDataBuilder;
