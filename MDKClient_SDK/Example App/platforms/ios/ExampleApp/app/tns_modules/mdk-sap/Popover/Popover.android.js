"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var DataConverter_1 = require("../Common/DataConverter");
var app = require("tns-core-modules/application");
var Util_1 = require("../Common/Util");
var Popover = (function () {
    function Popover() {
        this._interop = com.sap.mdk.client.ui.popover.Popover.getInstance();
        if (Popover._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.POPOVER_INSTANTIATION_FAILED);
        }
        Popover._instance = this;
    }
    Popover.getInstance = function () {
        return Popover._instance;
    };
    Popover.prototype.show = function (data) {
        var _this = this;
        var context = app.android.foregroundActivity;
        var pressedItem = this.getPressedItem(data.pressedItem);
        return new Promise(function (resolve, reject) {
            var nativeCallback = new com.sap.mdk.client.ui.popover.IPopoverCallback({
                onPress: function (item) {
                    var onPressValue = Util_1.Util.getPopoverOnPress(item);
                    resolve(onPressValue);
                },
            });
            return _this._interop.showPopover(DataConverter_1.DataConverter.toJavaObject(data), pressedItem, nativeCallback, context);
        });
    };
    Popover.prototype.dismiss = function (page) {
    };
    Popover.prototype.setPopoverAnchor = function (modalFrame, page, pressedItem) {
    };
    Popover.prototype.getPressedItem = function (pressedItem) {
        if (!pressedItem) {
            return null;
        }
        if (pressedItem.isActionItem()) {
            var actionItem = pressedItem.getActionItem();
            var nativeBar = actionItem.actionBar.nativeViewProtected;
            var index_1 = nativeBar.getMenu().findItemIndex(actionItem._getItemId());
            var navBarChild = void 0;
            for (var i = 0; i < nativeBar.getChildCount(); i++) {
                navBarChild = nativeBar.getChildAt(i);
                if (navBarChild instanceof androidx.appcompat.widget.ActionMenuView) {
                    break;
                }
                else {
                    navBarChild = null;
                }
            }
            if (navBarChild && index_1 > -1) {
                var navBarChildMenuItem = navBarChild.getChildAt(index_1);
                return navBarChildMenuItem;
            }
        }
        else if (pressedItem.isToolbarItem()) {
            return pressedItem.getToolbarItem().actionView.android;
        }
        else if (pressedItem.isTabItem()) {
            return pressedItem.getTabItem().nativeView;
        }
        else {
            return pressedItem.getControlView().android;
        }
    };
    Popover._instance = new Popover();
    return Popover;
}());
exports.Popover = Popover;
;
