"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var GridRowItemBuilder = (function (_super) {
    __extends(GridRowItemBuilder, _super);
    function GridRowItemBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridRowItemBuilder.prototype.setImage = function (image) {
        this.data.image = image;
        return this;
    };
    GridRowItemBuilder.prototype.setImageSizeAffectsRowHeight = function (imageSizeAffectsRowHeight) {
        this.data.imageSizeAffectsRowHeight = imageSizeAffectsRowHeight;
        return this;
    };
    GridRowItemBuilder.prototype.setLineBreakMode = function (lineBreakMode) {
        this.data.lineBreakMode = lineBreakMode;
        return this;
    };
    GridRowItemBuilder.prototype.setNumberOfLines = function (numberOfLines) {
        this.data.numberOfLines = numberOfLines;
        return this;
    };
    GridRowItemBuilder.prototype.setStyle = function (style) {
        this.data.style = style;
        return this;
    };
    GridRowItemBuilder.prototype.setText = function (text) {
        this.data.text = text;
        return this;
    };
    GridRowItemBuilder.prototype.setTextAlignment = function (textAlignment) {
        this.data.textAlignment = textAlignment;
        return this;
    };
    GridRowItemBuilder.prototype.setBindTo = function (bindTo) {
        this.data.bindTo = bindTo;
        return this;
    };
    return GridRowItemBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.GridRowItemBuilder = GridRowItemBuilder;
var GridRowBuilder = (function (_super) {
    __extends(GridRowBuilder, _super);
    function GridRowBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(GridRowBuilder.prototype, "newItem", {
        get: function () {
            if (!this.data.items) {
                this.data.items = [];
            }
            this.data.items.push(new GridRowItemBuilder(this._context));
            return this.data.items[this.data.items.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    GridRowBuilder.prototype.setAccessoryType = function (accessoryType) {
        this.data.accessoryType = accessoryType;
        return this;
    };
    GridRowBuilder.prototype.setDisableSelectionStyle = function (disable) {
        this.data.disableSelectionStyle = disable;
        return this;
    };
    GridRowBuilder.prototype.setColumnWidth = function (columnWidth) {
        this.data.columnWidth = columnWidth;
        return this;
    };
    GridRowBuilder.prototype.setColumnWidthPercentage = function (columnWidthPercentage) {
        this.data.columnWidthPercentage = columnWidthPercentage;
        return this;
    };
    GridRowBuilder.prototype.setSpacing = function (spacing) {
        this.data.spacing = spacing;
        return this;
    };
    return GridRowBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.GridRowBuilder = GridRowBuilder;
