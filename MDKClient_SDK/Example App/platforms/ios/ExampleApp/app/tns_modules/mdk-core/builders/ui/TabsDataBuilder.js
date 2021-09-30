"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TabControlBaseDataBuilder_1 = require("./TabControlBaseDataBuilder");
var TabsDataBuilder = (function (_super) {
    __extends(TabsDataBuilder, _super);
    function TabsDataBuilder(context) {
        var _this = _super.call(this, context) || this;
        _this.doNotResolveKeys = {};
        return _this;
    }
    TabsDataBuilder.prototype.setPosition = function (position) {
        this.data.position = position;
        return this;
    };
    TabsDataBuilder.prototype.setSelectedIndex = function (selectedIndex) {
        this.data.selectedIndex = selectedIndex;
        return this;
    };
    TabsDataBuilder.prototype.setSwipeEnabled = function (swipeEnabled) {
        this.data.swipeEnabled = swipeEnabled;
        return this;
    };
    TabsDataBuilder.prototype.setVisible = function (visible) {
        this.data.visible = visible;
        return this;
    };
    return TabsDataBuilder;
}(TabControlBaseDataBuilder_1.TabControlBaseDataBuilder));
exports.TabsDataBuilder = TabsDataBuilder;
