"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var ToastDataBuilder = (function (_super) {
    __extends(ToastDataBuilder, _super);
    function ToastDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {
            background: true,
        };
        return _this;
    }
    ToastDataBuilder.prototype.setAnimated = function (animated) {
        this.data.animated = animated;
        return this;
    };
    ToastDataBuilder.prototype.setBackground = function (background) {
        this.data.background = background;
        return this;
    };
    ToastDataBuilder.prototype.setDuration = function (duration) {
        this.data.duration = duration;
        return this;
    };
    ToastDataBuilder.prototype.setIcon = function (icon) {
        this.data.icon = icon;
        return this;
    };
    ToastDataBuilder.prototype.setIsIconHidden = function (isIconHidden) {
        this.data.isIconHidden = isIconHidden;
        return this;
    };
    ToastDataBuilder.prototype.setMaxNumberOfLines = function (maxNumberOfLines) {
        this.data.maxNumberOfLines = maxNumberOfLines;
        return this;
    };
    ToastDataBuilder.prototype.setMessage = function (message) {
        this.data.message = message;
        return this;
    };
    ToastDataBuilder.prototype.setBottomOffset = function (offset) {
        this.data.bottomOffset = offset;
        return this;
    };
    return ToastDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.ToastDataBuilder = ToastDataBuilder;
