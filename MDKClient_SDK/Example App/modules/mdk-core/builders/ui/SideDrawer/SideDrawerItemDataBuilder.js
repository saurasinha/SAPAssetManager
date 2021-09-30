"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../../BaseDataBuilder");
var ValueResolver_1 = require("../../../utils/ValueResolver");
var SideDrawerItemDataBuilder = (function (_super) {
    __extends(SideDrawerItemDataBuilder, _super);
    function SideDrawerItemDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {
            action: true
        };
        _this.excludedTypes = [ValueResolver_1.ValueType.FontIcon];
        return _this;
    }
    SideDrawerItemDataBuilder.prototype.setName = function (name) {
        this.data.name = name;
        return this;
    };
    SideDrawerItemDataBuilder.prototype.setImage = function (image) {
        this.data.image = image;
        return this;
    };
    SideDrawerItemDataBuilder.prototype.setTitle = function (title) {
        this.data.title = title;
        return this;
    };
    SideDrawerItemDataBuilder.prototype.setAction = function (action) {
        this.data.action = action;
        return this;
    };
    SideDrawerItemDataBuilder.prototype.setVisible = function (visible) {
        this.data.visible = visible;
        return this;
    };
    SideDrawerItemDataBuilder.prototype.setPageToOpen = function (pageToOpen) {
        this.data.pageToOpen = pageToOpen;
        return this;
    };
    SideDrawerItemDataBuilder.prototype.setResetIfPressedWhenActive = function (resetIfPressedWhenActive) {
        this.data.resetIfPressedWhenActive = resetIfPressedWhenActive;
        return this;
    };
    SideDrawerItemDataBuilder.prototype.setTextAlignment = function (textAlignment) {
        this.data.textAlignment = textAlignment;
        return this;
    };
    SideDrawerItemDataBuilder.prototype.setStyles = function (styles) {
        this.data.styles = styles;
        return this;
    };
    return SideDrawerItemDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.SideDrawerItemDataBuilder = SideDrawerItemDataBuilder;
