"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdk_sap_1 = require("mdk-sap");
var PressedItem = (function (_super) {
    __extends(PressedItem, _super);
    function PressedItem(_controlView, _toolbarItem, _tabItem, _actionItem) {
        var _this = _super.call(this) || this;
        _this._controlView = _controlView;
        _this._toolbarItem = _toolbarItem;
        _this._tabItem = _tabItem;
        _this._actionItem = _actionItem;
        return _this;
    }
    PressedItem.WithControlView = function (controlView) {
        return new PressedItem(controlView, null, null, null);
    };
    PressedItem.WithToolbarItem = function (toolbarItem) {
        return new PressedItem(null, toolbarItem, null, null);
    };
    PressedItem.WithTabItem = function (tabItem) {
        return new PressedItem(null, null, tabItem, null);
    };
    PressedItem.WithActionItem = function (actionItem) {
        return new PressedItem(null, null, null, actionItem);
    };
    PressedItem.prototype.isControlView = function () {
        return !!this._controlView;
    };
    PressedItem.prototype.isToolbarItem = function () {
        return !!this._toolbarItem;
    };
    PressedItem.prototype.isTabItem = function () {
        return !!this._tabItem;
    };
    PressedItem.prototype.isActionItem = function () {
        return !!this._actionItem;
    };
    PressedItem.prototype.getControlView = function () {
        return this._controlView;
    };
    PressedItem.prototype.getToolbarItem = function () {
        return this._toolbarItem;
    };
    PressedItem.prototype.getTabItem = function () {
        return this._tabItem;
    };
    PressedItem.prototype.getActionItem = function () {
        return this._actionItem;
    };
    return PressedItem;
}(mdk_sap_1.PressedItem));
exports.PressedItem = PressedItem;
