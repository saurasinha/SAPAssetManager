"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toolbar_plugin_common_1 = require("./toolbar-plugin-common");
var utils_1 = require("tns-core-modules/utils/utils");
var view_1 = require("tns-core-modules/ui/core/view");
var color_1 = require("tns-core-modules/color");
var font_1 = require("tns-core-modules/ui/styling/font");
var platform_1 = require("tns-core-modules/platform");
var ToolBarItem = (function (_super) {
    __extends(ToolBarItem, _super);
    function ToolBarItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ToolBarItem;
}(toolbar_plugin_common_1.ToolBarItemBase));
exports.ToolBarItem = ToolBarItem;
var ToolBarPositionDelegate = (function (_super) {
    __extends(ToolBarPositionDelegate, _super);
    function ToolBarPositionDelegate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToolBarPositionDelegate.initWithPosition = function (position) {
        if (position === void 0) { position = 1; }
        var handler = ToolBarPositionDelegate.new();
        handler.position = position;
        return handler;
    };
    ToolBarPositionDelegate.prototype.positionForBar = function () {
        return this.position;
    };
    ToolBarPositionDelegate.ObjCProtocols = [UIToolbarDelegate];
    return ToolBarPositionDelegate;
}(NSObject));
exports.ToolBarPositionDelegate = ToolBarPositionDelegate;
var ToolBar = (function (_super) {
    __extends(ToolBar, _super);
    function ToolBar(isFullScreen) {
        var _this = _super.call(this) || this;
        _this._isFullScreen = isFullScreen;
        _this._ios = UIToolbar.alloc().initWithFrame(CGRectZero);
        _this._delegate = ToolBarPositionDelegate.initWithPosition(0);
        _this._ios.delegate = _this._delegate;
        if (utils_1.ios.MajorVersion > 10 && _this._isFullScreen) {
            _this.iosOverflowSafeArea = true;
            _this._toolbarParent = UIView.alloc().initWithFrame(CGRectZero);
            _this._toolbarParent.addSubview(_this._ios);
            _this.nativeView = _this._toolbarParent;
            _this._ios.topAnchor.constraintEqualToAnchor(_this._toolbarParent.topAnchor).active = true;
            _this._ios.leftAnchor.constraintEqualToAnchor(_this._toolbarParent.leftAnchor).active = true;
        }
        else {
            _this.nativeView = _this._ios;
        }
        return _this;
    }
    ToolBar.prototype.update = function () {
        var _this = this;
        var items = this.barItems.getVisibleItems();
        var currLength = items.length;
        var uiBarButtonArray = NSMutableArray.array();
        var barButtonItemPromises = [];
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            barButtonItemPromises.push(this.createBarButtonItem(item));
        }
        Promise.all(barButtonItemPromises).then(function (barButtonItems) {
            if (Array.isArray(barButtonItems) && barButtonItems.length > 0) {
                barButtonItems.forEach(function (item) {
                    uiBarButtonArray.addObject(item);
                });
                if (_this._ios) {
                    _this.ios.setItemsAnimated(uiBarButtonArray, true);
                    _this.updateColors(_this._ios);
                }
            }
        });
    };
    ToolBar.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils_1.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils_1.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils_1.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils_1.layout.getMeasureSpecMode(heightMeasureSpec);
        var newHeight = height;
        var navBarWidth = 0;
        var navBarHeight = 0;
        if (heightMode !== utils_1.layout.EXACTLY) {
            var toolbarSize = this._ios.intrinsicContentSize;
            var scale = platform_1.screen.mainScreen.scale;
            newHeight = toolbarSize.height * scale;
            heightMode = utils_1.layout.EXACTLY;
        }
        var heightAndState = view_1.View.resolveSizeAndState(height, newHeight, heightMode, 0);
        if (utils_1.ios.MajorVersion > 10 && this._isFullScreen) {
            var fWidth = utils_1.layout.toDeviceIndependentPixels(platform_1.screen.mainScreen.widthPixels);
            var fHeight = utils_1.layout.toDeviceIndependentPixels(newHeight);
            this._ios.frame = CGRectMake(this._ios.frame.origin.x, this._ios.frame.origin.y, fWidth, fHeight);
        }
        this.setMeasuredDimension(widthMeasureSpec, heightAndState);
    };
    ToolBar.prototype._shouldApplyStyleHandlers = function () {
        return true;
    };
    Object.defineProperty(ToolBar.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    ToolBar.prototype._onPositionChanged = function () {
        this._delegate.position = this.barPosition;
        this.ios.delegate = this._delegate;
    };
    ToolBar.prototype.createBarButtonItem = function (item) {
        var _this = this;
        var tapHandler = TapToolBarItemHandlerImpl.initWithOwner(new WeakRef(item));
        item.handler = tapHandler;
        var barButtonItem;
        if (item.systemItem !== undefined) {
            var parsedSystemItem = SystemItem.parse(item.systemItem.toString());
            if (parsedSystemItem !== undefined) {
                barButtonItem = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(parsedSystemItem, tapHandler, toolbar_plugin_common_1.ToolBarItemBase.tapEvent);
            }
        }
        var itemImagePromise;
        itemImagePromise = Promise.resolve(barButtonItem);
        if (!barButtonItem && item.icon) {
            itemImagePromise = this.getImageSourceFromIcon(item.icon, item.itemStyle).then(function (imgSource) {
                if (imgSource) {
                    if (imgSource.ios) {
                        var imageRenderingMode = 1;
                        if (utils_1.isFontIconURI(item.icon) && item.enabled !== undefined && !item.enabled) {
                            imageRenderingMode = 0;
                        }
                        var imgNew = imgSource.ios.imageWithRenderingMode(imageRenderingMode);
                        barButtonItem = UIBarButtonItem.alloc().initWithImageStyleTargetAction(imgNew, 0, tapHandler, toolbar_plugin_common_1.ToolBarItemBase.tapEvent);
                        return barButtonItem;
                    }
                }
            });
        }
        return itemImagePromise.then(function (resolvedBarButtonItem) {
            if (!resolvedBarButtonItem) {
                resolvedBarButtonItem = UIBarButtonItem.alloc().initWithTitleStyleTargetAction(item.text + '', 0, tapHandler, toolbar_plugin_common_1.ToolBarItemBase.tapEvent);
                var itemStyle = item.itemStyle ? item.itemStyle : _this.style;
                if (itemStyle) {
                    var customFont = font_1.Font.default;
                    var fontSize = itemStyle.fontSize;
                    if (!fontSize) {
                        fontSize = 18;
                    }
                    customFont = customFont.withFontSize(fontSize);
                    var fontFamily = itemStyle.fontFamily;
                    if (fontFamily) {
                        customFont = customFont.withFontFamily(fontFamily);
                    }
                    var fontWeight = itemStyle.fontWeight;
                    if (fontWeight) {
                        customFont = customFont.withFontWeight(fontWeight);
                    }
                    var attributes = NSMutableDictionary.alloc();
                    attributes[NSFontAttributeName] = customFont.getUIFont(UIFont.systemFontOfSize(18));
                    var fontColor = itemStyle.color;
                    if (fontColor) {
                        attributes[UITextAttributeTextColor] = fontColor.ios;
                    }
                    if (item.isUserInteractionEnabled !== undefined && !item.isUserInteractionEnabled) {
                        resolvedBarButtonItem.setTitleTextAttributesForState(attributes, 2);
                    }
                    if (item.enabled !== undefined && !item.enabled) {
                        attributes[UITextAttributeTextColor] = UIColor.lightGrayColor;
                        resolvedBarButtonItem.setTitleTextAttributesForState(attributes, 2);
                    }
                    else {
                        resolvedBarButtonItem.setTitleTextAttributesForState(attributes, 0);
                    }
                }
            }
            if (item.enabled !== undefined && !item.enabled) {
                resolvedBarButtonItem.enabled = false;
            }
            if (item.width !== undefined && item.width > 0) {
                resolvedBarButtonItem.width = item.width;
            }
            if (item.tag !== undefined && item.tag > 0) {
                resolvedBarButtonItem.tag = item.tag;
            }
            if (item.isUserInteractionEnabled !== undefined && !item.isUserInteractionEnabled) {
                resolvedBarButtonItem.enabled = false;
            }
            return resolvedBarButtonItem;
        });
    };
    ToolBar.prototype.updateColors = function (toolbar) {
        var color = this.color;
        if (color) {
            toolbar.tintColor = color.ios;
        }
        else {
            toolbar.tintColor = null;
        }
        if (this._barTintColor) {
            toolbar.translucent = false;
            var tintColor = new color_1.Color(this._barTintColor);
            toolbar.barTintColor = tintColor.ios;
        }
    };
    Object.defineProperty(ToolBar.prototype, "bartintcolor", {
        get: function () {
            return this._barTintColor;
        },
        set: function (value) {
            this._barTintColor = value;
        },
        enumerable: true,
        configurable: true
    });
    return ToolBar;
}(toolbar_plugin_common_1.ToolBarBase));
exports.ToolBar = ToolBar;
var SystemItem = (function (_super) {
    __extends(SystemItem, _super);
    function SystemItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SystemItem, "systemItemEnum", {
        get: function () {
            return SystemItemIOS;
        },
        enumerable: true,
        configurable: true
    });
    return SystemItem;
}(toolbar_plugin_common_1.SystemItemBase));
exports.SystemItem = SystemItem;
var ItemType = (function (_super) {
    __extends(ItemType, _super);
    function ItemType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ItemType;
}(toolbar_plugin_common_1.ItemTypeBase));
exports.ItemType = ItemType;
var TapToolBarItemHandlerImpl = (function (_super) {
    __extends(TapToolBarItemHandlerImpl, _super);
    function TapToolBarItemHandlerImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TapToolBarItemHandlerImpl.initWithOwner = function (owner) {
        var handler = TapToolBarItemHandlerImpl.new();
        handler._owner = owner;
        return handler;
    };
    TapToolBarItemHandlerImpl.prototype.tap = function (args) {
        var owner = this._owner.get();
        if (owner) {
            owner._emit(toolbar_plugin_common_1.ToolBarItemBase.tapEvent);
        }
    };
    TapToolBarItemHandlerImpl.ObjCExposedMethods = {
        "tap": { returns: interop.types.void, params: [interop.types.id] },
    };
    return TapToolBarItemHandlerImpl;
}(NSObject));
var SystemItemIOS;
(function (SystemItemIOS) {
    SystemItemIOS[SystemItemIOS["Done"] = 0] = "Done";
    SystemItemIOS[SystemItemIOS["Cancel"] = 1] = "Cancel";
    SystemItemIOS[SystemItemIOS["Edit"] = 2] = "Edit";
    SystemItemIOS[SystemItemIOS["Save"] = 3] = "Save";
    SystemItemIOS[SystemItemIOS["Add"] = 4] = "Add";
    SystemItemIOS[SystemItemIOS["FlexibleSpace"] = 5] = "FlexibleSpace";
    SystemItemIOS[SystemItemIOS["FixedSpace"] = 6] = "FixedSpace";
    SystemItemIOS[SystemItemIOS["Compose"] = 7] = "Compose";
    SystemItemIOS[SystemItemIOS["Reply"] = 8] = "Reply";
    SystemItemIOS[SystemItemIOS["Action"] = 9] = "Action";
    SystemItemIOS[SystemItemIOS["Organize"] = 10] = "Organize";
    SystemItemIOS[SystemItemIOS["Bookmarks"] = 11] = "Bookmarks";
    SystemItemIOS[SystemItemIOS["Search"] = 12] = "Search";
    SystemItemIOS[SystemItemIOS["Refresh"] = 13] = "Refresh";
    SystemItemIOS[SystemItemIOS["Stop"] = 14] = "Stop";
    SystemItemIOS[SystemItemIOS["Camera"] = 15] = "Camera";
    SystemItemIOS[SystemItemIOS["Trash"] = 16] = "Trash";
    SystemItemIOS[SystemItemIOS["Play"] = 17] = "Play";
    SystemItemIOS[SystemItemIOS["Pause"] = 18] = "Pause";
    SystemItemIOS[SystemItemIOS["Rewind"] = 19] = "Rewind";
    SystemItemIOS[SystemItemIOS["FastForward"] = 20] = "FastForward";
    SystemItemIOS[SystemItemIOS["Undo"] = 21] = "Undo";
    SystemItemIOS[SystemItemIOS["Redo"] = 22] = "Redo";
})(SystemItemIOS || (SystemItemIOS = {}));
