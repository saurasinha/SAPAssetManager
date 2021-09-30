"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../../BaseDataBuilder");
var ValueResolver_1 = require("../../../utils/ValueResolver");
var SideDrawerHeaderDataBuilder = (function (_super) {
    __extends(SideDrawerHeaderDataBuilder, _super);
    function SideDrawerHeaderDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {
            action: true
        };
        _this.excludedTypes = [ValueResolver_1.ValueType.FontIcon];
        return _this;
    }
    SideDrawerHeaderDataBuilder.prototype.setIcon = function (icon) {
        this.data.icon = icon;
        return this;
    };
    SideDrawerHeaderDataBuilder.prototype.setIconIsCircular = function (iconIsCircular) {
        this.data.iconIsCircular = iconIsCircular;
        return this;
    };
    SideDrawerHeaderDataBuilder.prototype.setDisableIconText = function (disableIconText) {
        this.data.disableIconText = disableIconText;
        return this;
    };
    SideDrawerHeaderDataBuilder.prototype.setHeadline = function (headline) {
        this.data.headline = headline;
        return this;
    };
    SideDrawerHeaderDataBuilder.prototype.setSubHeadline = function (subHeadline) {
        this.data.subHeadline = subHeadline;
        return this;
    };
    SideDrawerHeaderDataBuilder.prototype.setAction = function (action) {
        this.data.action = action;
        return this;
    };
    SideDrawerHeaderDataBuilder.prototype.setAlignment = function (alignment) {
        this.data.alignment = alignment;
        return this;
    };
    return SideDrawerHeaderDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.SideDrawerHeaderDataBuilder = SideDrawerHeaderDataBuilder;
