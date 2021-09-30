"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var CommonUtil_1 = require("../ErrorHandling/CommonUtil");
var tab_strip_1 = require("tns-core-modules/ui/tab-navigation-base/tab-strip");
var Util_1 = require("../Common/Util");
var Popover = (function () {
    function Popover() {
        this._interop = PopoverBridge.new();
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
        if (!data || !data.page) {
            Promise.reject("No valid popover data to show popover");
        }
        return this.getPopoverAnchor(data.page, data.pressedItem).then(function (anchor) {
            var page = data.page;
            if (anchor) {
                if (!page.popOverData || page.popOverData !== data) {
                    page.popOverData = data;
                }
            }
            var params = {};
            Object.assign(params, data);
            params.page = data.page.ios;
            params.pressedItem = anchor;
            return new Promise(function (resolve, reject) {
                return _this._interop.showResolveReject(params, function (onPress) {
                    if (page.popOverData) {
                        page.popOverData = null;
                    }
                    var onPressValue = Util_1.Util.getPopoverOnPress(onPress);
                    resolve(onPressValue);
                }, function (code, message, error) {
                    if (page.popOverData) {
                        page.popOverData = null;
                    }
                    reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
                });
            });
        });
    };
    Popover.prototype.dismiss = function (page) {
        if (page.ios && page.ios.presentedViewController) {
            if (page.ios.presentedViewController.modalPresentationStyle === 7) {
                page.ios.presentedViewController.dismissViewControllerAnimatedCompletion(false, null);
            }
        }
    };
    Popover.prototype.setPopoverAnchor = function (modalFrame, page, pressedItem) {
        if (modalFrame.viewController) {
            modalFrame.viewController.modalPresentationStyle = 7;
            var popover_1 = modalFrame.viewController.popoverPresentationController;
            if (popover_1 !== null && pressedItem) {
                this.getPopoverAnchor(page, pressedItem).then(function (anchor) {
                    if (anchor) {
                        if (pressedItem.isActionItem() || pressedItem.isToolbarItem()) {
                            popover_1.barButtonItem = anchor;
                            popover_1.permittedArrowDirections = 15;
                        }
                        else {
                            var pressedControlView = anchor.getControlView();
                            popover_1.sourceView = pressedControlView.ios;
                            popover_1.sourceRect = pressedControlView.ios.bounds;
                            popover_1.permittedArrowDirections = 15;
                        }
                        if (!modalFrame.popOverAnchorItem || modalFrame.popOverAnchorItem !== pressedItem) {
                            modalFrame.popOverAnchorItem = pressedItem;
                        }
                    }
                });
            }
        }
    };
    Popover.prototype.getPopoverAnchor = function (page, pressedItem) {
        if (!pressedItem) {
            return Promise.resolve(null);
        }
        if (pressedItem.isActionItem() && pressedItem.getActionItem()) {
            var actionItem = pressedItem.getActionItem();
            if (actionItem.ios && actionItem.actionBar && actionItem.actionBar.ios && actionItem.actionBar.actionItems) {
                var side_1 = actionItem.ios.position;
                var actionItems = actionItem.actionBar.actionItems.getItems();
                if (side_1 && actionItems && Array.isArray(actionItems)) {
                    var sameSideActionItems = actionItems.filter(function (item) {
                        if (item.ios) {
                            return item.ios.position === side_1 && item.visibility === 'visible';
                        }
                    });
                    var pos = sameSideActionItems.indexOf(actionItem);
                    var index_1 = side_1 === 'left' ? pos : sameSideActionItems.length - pos - 1;
                    if (index_1 >= 0 && page.actionBar.ios && page.actionBar.ios.topItem) {
                        var buttonItem = void 0;
                        var navBar = page.actionBar.ios.topItem;
                        if (side_1 === 'left') {
                            if (navBar.leftBarButtonItems.count > 0 && index_1 < navBar.leftBarButtonItems.count) {
                                buttonItem = navBar.leftBarButtonItems[index_1];
                            }
                        }
                        else {
                            if (navBar.rightBarButtonItems.count > 0 && index_1 < navBar.rightBarButtonItems.count) {
                                buttonItem = navBar.rightBarButtonItems[index_1];
                            }
                        }
                        return Promise.resolve(buttonItem);
                    }
                }
            }
        }
        else if (pressedItem.isToolbarItem() && pressedItem.getToolbarItem()) {
            return page.getToolbar().then(function (toolbarControl) {
                if (toolbarControl && toolbarControl.view()) {
                    var toolbar_1 = toolbarControl.view();
                    var senderTag = pressedItem.getToolbarItem().tag;
                    if (toolbar_1.ios && toolbar_1.ios.items && senderTag) {
                        for (var i = 0; i < toolbar_1.ios.items.count; i++) {
                            if (toolbar_1.ios.items[i].tag === senderTag) {
                                return toolbar_1.ios.items[i];
                            }
                        }
                    }
                }
            });
        }
        else if (pressedItem.isTabItem() && pressedItem.getTabItem()) {
            var senderId = pressedItem.getTabItem().id;
            var tabStrip = page.getTabControl();
            if (tabStrip instanceof tab_strip_1.TabStrip) {
                for (var _i = 0, _a = tabStrip.items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.id === senderId) {
                        return Promise.resolve(item.nativeView);
                    }
                }
            }
        }
        else {
            if (pressedItem.getControlView() && pressedItem.getControlView().ios) {
                return Promise.resolve(pressedItem.getControlView().ios);
            }
        }
        return Promise.resolve(null);
    };
    Popover._instance = new Popover();
    return Popover;
}());
exports.Popover = Popover;
;
