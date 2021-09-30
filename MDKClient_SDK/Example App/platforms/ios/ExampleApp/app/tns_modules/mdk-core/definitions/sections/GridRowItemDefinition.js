"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../BaseJSONDefinition");
var GridRowItemDefinition = (function (_super) {
    __extends(GridRowItemDefinition, _super);
    function GridRowItemDefinition(path, data, parent) {
        var _this = _super.call(this, path, data) || this;
        _this.parent = parent;
        return _this;
    }
    Object.defineProperty(GridRowItemDefinition.prototype, "image", {
        get: function () {
            return this.data.Image;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowItemDefinition.prototype, "imageSizeAffectsRowHeight", {
        get: function () {
            return this.data.ImageSizeAffectsRowHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowItemDefinition.prototype, "lineBreakMode", {
        get: function () {
            return this.data.LineBreakMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowItemDefinition.prototype, "numberOfLines", {
        get: function () {
            return this.data.NumberOfLines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowItemDefinition.prototype, "style", {
        get: function () {
            return this.data.Style;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowItemDefinition.prototype, "text", {
        get: function () {
            return this.data.Text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowItemDefinition.prototype, "textAlignment", {
        get: function () {
            return this.data.TextAlignment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowItemDefinition.prototype, "bindTo", {
        get: function () {
            return this.data.BindTo;
        },
        enumerable: true,
        configurable: true
    });
    return GridRowItemDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.GridRowItemDefinition = GridRowItemDefinition;
