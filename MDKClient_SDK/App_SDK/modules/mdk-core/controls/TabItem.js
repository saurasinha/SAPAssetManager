"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var BaseControl_1 = require("./BaseControl");
var EventHandler_1 = require("../EventHandler");
var PressedItem_1 = require("./PressedItem");
var tab_strip_item_1 = require("tns-core-modules/ui/tab-navigation-base/tab-strip-item");
var TabItemDataBuilder_1 = require("../builders/ui/TabItemDataBuilder");
var ImageHelper_1 = require("../utils/ImageHelper");
var PropertyTypeChecker_1 = require("../utils/PropertyTypeChecker");
var enums_1 = require("tns-core-modules/ui/enums");
var TabItemObservable_1 = require("../observables/TabItemObservable");
var I18nFormatter_1 = require("../utils/I18nFormatter");
var BottomNavigationContainer_1 = require("./BottomNavigationContainer");
var Logger_1 = require("../utils/Logger");
var ModalFrame_1 = require("../pages/ModalFrame");
var ExecuteSource_1 = require("../common/ExecuteSource");
var TabsContainer_1 = require("./TabsContainer");
var TabItem = (function (_super) {
    __extends(TabItem, _super);
    function TabItem() {
        var _this = _super.call(this) || this;
        _this._imageHeight = 24;
        _this._imageWidth = 24;
        _this._imageFontIconClassName = 'sap-icons';
        return _this;
    }
    Object.defineProperty(TabItem.prototype, "isBindable", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    TabItem.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
    };
    TabItem.prototype.view = function () {
        return this.tabItemView;
    };
    Object.defineProperty(TabItem.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItem.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItem.prototype, "enabled", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItem.prototype, "caption", {
        get: function () {
            return this.tabItemView.title ? this.tabItemView.title : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabItem.prototype, "visibility", {
        get: function () {
            return enums_1.Visibility.visible;
        },
        enumerable: true,
        configurable: true
    });
    TabItem.prototype.createTabItem = function (itemDef, itemIndex) {
        var _this = this;
        var builder = new TabItemDataBuilder_1.TabItemDataBuilder(this.context);
        builder.setName(itemDef.name)
            .setCaption(itemDef.caption)
            .setImage(itemDef.image)
            .setAction(itemDef.action)
            .setEnabled(itemDef.enabled)
            .setVisible(itemDef.visible)
            .setResetIfPressedWhenActive(itemDef.resetIfPressedWhenActive);
        var tabStripItem = new tab_strip_item_1.TabStripItem();
        var tabItemVisibility;
        return builder.build().then(function (data) {
            _this._name = data.name;
            _this._index = itemIndex;
            tabStripItem = new tab_strip_item_1.TabStripItem();
            tabStripItem.id = data.name;
            var imageWaitPromise = Promise.resolve(undefined);
            if (data.image && data.image !== '') {
                if (PropertyTypeChecker_1.PropertyTypeChecker.isResourcePath(data.image)) {
                    tabStripItem.iconSource = data.image;
                }
                else if (data.image.indexOf('font://') === 0) {
                    var fontCode = data.image.replace('font://&#', '0').replace(';', '');
                    if (fontCode !== '') {
                        var fontCodeNum = I18nFormatter_1.I18nFormatter.validateNumber(fontCode);
                        if (fontCodeNum) {
                            tabStripItem.iconClass = _this._imageFontIconClassName;
                            tabStripItem.iconSource = "font://" + String.fromCharCode(fontCodeNum);
                        }
                        else {
                            Logger_1.Logger.instance.ui.warn(Logger_1.Logger.INVALID_FONTICON_UNICODE, fontCode);
                        }
                    }
                }
                else if (!app.ios && !app.android) {
                    tabStripItem.iconSource = data.image;
                }
                else {
                    if (_this.parent instanceof BottomNavigationContainer_1.BottomNavigationContainer) {
                        imageWaitPromise = ImageHelper_1.ImageHelper.processIcon(data.image, _this._imageWidth, _this._imageHeight);
                    }
                    else {
                        ImageHelper_1.ImageHelper.processIcon(data.image, _this._imageWidth, _this._imageHeight).then(function (resolvedItemIcon) {
                            if (resolvedItemIcon) {
                                if (PropertyTypeChecker_1.PropertyTypeChecker.isResourcePath(resolvedItemIcon)
                                    || PropertyTypeChecker_1.PropertyTypeChecker.isFilePath(resolvedItemIcon)) {
                                    tabStripItem.iconSource = resolvedItemIcon;
                                }
                            }
                        });
                    }
                }
            }
            return imageWaitPromise.then(function (resolvedItemIcon) {
                if (resolvedItemIcon) {
                    if (PropertyTypeChecker_1.PropertyTypeChecker.isResourcePath(resolvedItemIcon)
                        || PropertyTypeChecker_1.PropertyTypeChecker.isFilePath(resolvedItemIcon)) {
                        tabStripItem.iconSource = resolvedItemIcon;
                    }
                }
                if (data.caption && data.caption !== '') {
                    tabStripItem.title = data.caption;
                }
                tabStripItem.isEnabled = !!data.enabled;
                tabItemVisibility = data.visible ? enums_1.Visibility.visible : enums_1.Visibility.collapse;
                tabStripItem.visibility = tabItemVisibility;
                tabStripItem.on(tab_strip_item_1.TabStripItem.tapEvent, function (dataArgs) {
                    if (_this.page().isNavigating) {
                        return;
                    }
                    else {
                        _this.page().dismissPopover();
                        if (data.resetIfPressedWhenActive) {
                            if (_this.parent instanceof BottomNavigationContainer_1.BottomNavigationContainer || _this.parent instanceof TabsContainer_1.TabsContainer) {
                                var selectedTabItemName = _this.parent.getSelectedTabItemName();
                                if (selectedTabItemName === _this._name) {
                                    _this.parent.resetSelectedTabContentItem();
                                }
                            }
                        }
                        if (data.action != null) {
                            var oEventHandler = new EventHandler_1.EventHandler();
                            var clientAPIProps = _this.page().context.clientAPIProps;
                            clientAPIProps.pressedItem = PressedItem_1.PressedItem.WithTabItem(tabStripItem);
                            var executeSource = new ExecuteSource_1.ExecuteSource(_this.page().frame.id);
                            executeSource.sourceType = ExecuteSource_1.ExecuteSourceType.ParentPage;
                            if (ModalFrame_1.ModalFrame.isModal(tabStripItem.page.frame)) {
                                executeSource.sourceType = ExecuteSource_1.ExecuteSourceType.ModalPage;
                            }
                            oEventHandler.setEventSource(executeSource);
                            _this.context.clientAPIProps.eventSource = executeSource;
                            oEventHandler.executeActionOrRule(data.action, _this.context);
                        }
                    }
                });
                _this.tabItemView = tabStripItem;
                return _this;
            });
        });
    };
    TabItem.prototype.createObservable = function () {
        return new TabItemObservable_1.TabItemObservable(this, this.definition(), this.page());
    };
    return TabItem;
}(BaseControl_1.BaseControl));
exports.TabItem = TabItem;
;
