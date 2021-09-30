"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../../BaseDataBuilder");
var SideDrawerSectionDataBuilder = (function (_super) {
    __extends(SideDrawerSectionDataBuilder, _super);
    function SideDrawerSectionDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {};
        return _this;
    }
    SideDrawerSectionDataBuilder.prototype.setName = function (name) {
        this.data.name = name;
        return this;
    };
    SideDrawerSectionDataBuilder.prototype.setCaption = function (caption) {
        this.data.caption = caption;
        return this;
    };
    SideDrawerSectionDataBuilder.prototype.setVisible = function (visible) {
        this.data.visible = visible;
        return this;
    };
    SideDrawerSectionDataBuilder.prototype.setPreserveImageSpacing = function (preserveImageSpacing) {
        this.data.preserveImageSpacing = preserveImageSpacing;
        return this;
    };
    SideDrawerSectionDataBuilder.prototype.setSeparatorEnabled = function (separatorEnabled) {
        this.data.separatorEnabled = separatorEnabled;
        return this;
    };
    SideDrawerSectionDataBuilder.prototype.setStyles = function (styles) {
        this.data.styles = styles;
        return this;
    };
    return SideDrawerSectionDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.SideDrawerSectionDataBuilder = SideDrawerSectionDataBuilder;
