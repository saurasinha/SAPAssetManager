"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var PopoverItemDataBuilder = (function (_super) {
    __extends(PopoverItemDataBuilder, _super);
    function PopoverItemDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {
            onPress: true,
        };
        return _this;
    }
    PopoverItemDataBuilder.prototype.setEnabled = function (enabled) {
        this.data.enabled = enabled;
        return this;
    };
    PopoverItemDataBuilder.prototype.setIcon = function (icon) {
        this.data.icon = icon;
        return this;
    };
    PopoverItemDataBuilder.prototype.setOnPress = function (onPress) {
        if (onPress && onPress.constructor === Object) {
            this.data.onPress = JSON.stringify(onPress);
        }
        else {
            this.data.onPress = onPress;
        }
        return this;
    };
    PopoverItemDataBuilder.prototype.setTitle = function (title) {
        this.data.title = title;
        return this;
    };
    PopoverItemDataBuilder.prototype.setVisible = function (visible) {
        this.data.visible = visible;
        return this;
    };
    return PopoverItemDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.PopoverItemDataBuilder = PopoverItemDataBuilder;
var PopoverDataBuilder = (function (_super) {
    __extends(PopoverDataBuilder, _super);
    function PopoverDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {
            page: true,
            pressedItem: true,
        };
        return _this;
    }
    PopoverDataBuilder.prototype.setMessage = function (message) {
        this.data.message = message;
        return this;
    };
    PopoverDataBuilder.prototype.setPage = function (page) {
        this.data.page = page;
        return this;
    };
    PopoverDataBuilder.prototype.setPressedItem = function (pressedItem) {
        this.data.pressedItem = pressedItem;
        return this;
    };
    PopoverDataBuilder.prototype.setTitle = function (title) {
        this.data.title = title;
        return this;
    };
    Object.defineProperty(PopoverDataBuilder.prototype, "newItem", {
        get: function () {
            if (!this.data.items) {
                this.data.items = [];
            }
            this.data.items.push(new PopoverItemDataBuilder(this._context));
            return this.data.items[this.data.items.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    return PopoverDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.PopoverDataBuilder = PopoverDataBuilder;
