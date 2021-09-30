"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellDataBuilder_1 = require("./FormCellDataBuilder");
var SearchDataBuilder = (function (_super) {
    __extends(SearchDataBuilder, _super);
    function SearchDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this.data.Search = {};
        return _this;
    }
    SearchDataBuilder.prototype.setBarcodeScanEnabled = function (isBarcodeScanEnabled) {
        this.builtData.Search = this.builtData.Search || {};
        this.builtData.Search.BarcodeScanner = isBarcodeScanEnabled;
        return this;
    };
    SearchDataBuilder.prototype.setSearchEnabled = function (isSearchEnabled) {
        this.builtData.Search = this.builtData.Search || {};
        this.builtData.Search.Enabled = isSearchEnabled;
        return this;
    };
    return SearchDataBuilder;
}(FormCellDataBuilder_1.FormCellDataBuilder));
exports.SearchDataBuilder = SearchDataBuilder;
