"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var ValueResolver_1 = require("../../utils/ValueResolver");
var ToolbarItemDataBuilder = (function (_super) {
    __extends(ToolbarItemDataBuilder, _super);
    function ToolbarItemDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {
            action: true,
        };
        _this.excludedTypes = [ValueResolver_1.ValueType.FontIcon];
        return _this;
    }
    ToolbarItemDataBuilder.prototype.setName = function (name) {
        this.data.name = name;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setSystemItem = function (systemItem) {
        this.data.systemItem = systemItem;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setCaption = function (caption) {
        this.data.caption = caption;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setImage = function (image) {
        this.data.image = image;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setAction = function (action) {
        this.data.action = action;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setEnabled = function (enabled) {
        this.data.enabled = enabled;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setVisible = function (visible) {
        this.data.visible = visible;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setClickable = function (clickable) {
        this.data.clickable = clickable;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setOnPress = function (onPress) {
        this.data.onPress = onPress;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setWidth = function (width) {
        this.data.width = width;
        return this;
    };
    ToolbarItemDataBuilder.prototype.setItemType = function (itemType) {
        this.data.itemType = itemType;
        return this;
    };
    return ToolbarItemDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.ToolbarItemDataBuilder = ToolbarItemDataBuilder;
