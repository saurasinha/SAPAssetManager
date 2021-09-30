"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseSectionPagingDefinition_1 = require("./BaseSectionPagingDefinition");
var GridRowDefinition_1 = require("./GridRowDefinition");
var GridTableSectionDefinition = (function (_super) {
    __extends(GridTableSectionDefinition, _super);
    function GridTableSectionDefinition(path, data, parent) {
        var _this = _super.call(this, path, data, parent) || this;
        _this.row = undefined;
        _this.headerRow = undefined;
        if (_this.data.Row) {
            _this.row = new GridRowDefinition_1.GridRowDefinition(path, _this.data.Row, _this);
        }
        if (_this.data.Header && _this.data.Header.Grid) {
            _this.headerRow = new GridRowDefinition_1.GridRowDefinition(path, _this.data.Header.Grid, _this);
            if (!_this.headerRow.layout) {
                _this.headerRow.layout = _this.row.layout;
            }
        }
        return _this;
    }
    return GridTableSectionDefinition;
}(BaseSectionPagingDefinition_1.BaseSectionPagingDefinition));
exports.GridTableSectionDefinition = GridTableSectionDefinition;
;
