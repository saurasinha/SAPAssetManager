"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../BaseJSONDefinition");
var GridLayoutDefinition = (function (_super) {
    __extends(GridLayoutDefinition, _super);
    function GridLayoutDefinition(path, data, parent) {
        var _this = _super.call(this, path, data) || this;
        _this.parent = parent;
        _this.parent = parent;
        return _this;
    }
    Object.defineProperty(GridLayoutDefinition.prototype, "columnWidth", {
        get: function () {
            return this.data.ColumnWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridLayoutDefinition.prototype, "columnWidthPercentage", {
        get: function () {
            return this.data.ColumnWidthPercentage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridLayoutDefinition.prototype, "spacing", {
        get: function () {
            return this.data.Spacing;
        },
        enumerable: true,
        configurable: true
    });
    return GridLayoutDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.GridLayoutDefinition = GridLayoutDefinition;
