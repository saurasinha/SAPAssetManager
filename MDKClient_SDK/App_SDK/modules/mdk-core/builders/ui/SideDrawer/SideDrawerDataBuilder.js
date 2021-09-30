"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../../BaseDataBuilder");
var SideDrawerDataBuilder = (function (_super) {
    __extends(SideDrawerDataBuilder, _super);
    function SideDrawerDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {};
        return _this;
    }
    SideDrawerDataBuilder.prototype.setName = function (name) {
        this.data.name = name;
        return this;
    };
    SideDrawerDataBuilder.prototype.setClearHistory = function (clearHistory) {
        this.data.clearHistory = clearHistory;
        return this;
    };
    SideDrawerDataBuilder.prototype.setStyles = function (styles) {
        this.data.styles = styles;
        return this;
    };
    return SideDrawerDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.SideDrawerDataBuilder = SideDrawerDataBuilder;
