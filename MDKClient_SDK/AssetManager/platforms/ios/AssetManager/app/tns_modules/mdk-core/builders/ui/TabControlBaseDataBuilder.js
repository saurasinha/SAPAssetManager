"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var TabControlBaseDataBuilder = (function (_super) {
    __extends(TabControlBaseDataBuilder, _super);
    function TabControlBaseDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {};
        return _this;
    }
    TabControlBaseDataBuilder.prototype.setStyles = function (styles) {
        this.data.styles = styles;
        return this;
    };
    return TabControlBaseDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.TabControlBaseDataBuilder = TabControlBaseDataBuilder;
