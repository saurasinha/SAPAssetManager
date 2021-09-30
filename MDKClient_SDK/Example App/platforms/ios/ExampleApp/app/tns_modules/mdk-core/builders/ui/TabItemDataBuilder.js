"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var ValueResolver_1 = require("../../utils/ValueResolver");
var TabItemDataBuilder = (function (_super) {
    __extends(TabItemDataBuilder, _super);
    function TabItemDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {
            action: true,
        };
        _this.excludedTypes = [ValueResolver_1.ValueType.FontIcon];
        return _this;
    }
    TabItemDataBuilder.prototype.setName = function (name) {
        this.data.name = name;
        return this;
    };
    TabItemDataBuilder.prototype.setCaption = function (caption) {
        this.data.caption = caption;
        return this;
    };
    TabItemDataBuilder.prototype.setImage = function (image) {
        this.data.image = image;
        return this;
    };
    TabItemDataBuilder.prototype.setAction = function (action) {
        this.data.action = action;
        return this;
    };
    TabItemDataBuilder.prototype.setEnabled = function (enabled) {
        this.data.enabled = enabled;
        return this;
    };
    TabItemDataBuilder.prototype.setVisible = function (visible) {
        this.data.visible = visible;
        return this;
    };
    TabItemDataBuilder.prototype.setResetIfPressedWhenActive = function (resetIfPressedWhenActive) {
        this.data.resetIfPressedWhenActive = resetIfPressedWhenActive;
        return this;
    };
    return TabItemDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.TabItemDataBuilder = TabItemDataBuilder;
