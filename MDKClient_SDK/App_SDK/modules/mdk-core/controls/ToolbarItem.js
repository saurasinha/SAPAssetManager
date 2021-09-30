"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControl_1 = require("./BaseControl");
var ToolbarItemObservable_1 = require("../observables/ToolbarItemObservable");
var CssPropertyParser_1 = require("../utils/CssPropertyParser");
var toolbar_plugin_1 = require("toolbar-plugin");
var EventHandler_1 = require("../EventHandler");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var PressedItem_1 = require("./PressedItem");
var ValueResolver_1 = require("../utils/ValueResolver");
var font_1 = require("tns-core-modules/ui/styling/font");
var Logger_1 = require("../utils/Logger");
var I18nFormatter_1 = require("../utils/I18nFormatter");
var ToolbarItemDataBuilder_1 = require("../builders/ui/ToolbarItemDataBuilder");
var TabFrame_1 = require("../pages/TabFrame");
var ModalFrame_1 = require("../pages/ModalFrame");
var ExecuteSource_1 = require("../common/ExecuteSource");
var ToolbarContainer_1 = require("./ToolbarContainer");
var ToolbarItem = (function (_super) {
    __extends(ToolbarItem, _super);
    function ToolbarItem() {
        var _this = _super.call(this) || this;
        _this._clickable = true;
        _this._toolbarLabelStyle = 'ToolBarLabelStyle';
        _this._toolbarItemStyle = 'ToolBarItemStyle';
        _this._toolbarItemPressedStyle = 'ToolBarItemPressedStyle';
        _this._itemLabelStyle = ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.TypeSelector, _this._toolbarLabelStyle);
        _this._itemStyle = ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.TypeSelector, _this._toolbarItemStyle);
        _this._itemPressedStyle = ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.TypeSelector, _this._toolbarItemPressedStyle);
        if (_this._itemPressedStyle && _this._itemPressedStyle.color) {
            _this._itemStyle.rippleColor = _this._itemPressedStyle.color;
        }
        return _this;
    }
    ToolbarItem.getItemStyle = function (selector, cssClassName) {
        var colorProperty = 'color';
        var fontFamilyProperty = 'font-family';
        var fontSizeProperty = 'font-size';
        var fontWeightProperty = 'font-weight';
        var opacityProperty = 'opacity';
        var backgroundColorProperty = 'background-color';
        var borderRadiusProperty = 'border-radius';
        var marginLeftProperty = 'margin-left';
        var marginRightProperty = 'margin-right';
        var style = {};
        style.rippleColor = undefined;
        var labelColor = CssPropertyParser_1.CssPropertyParser.getPropertyFromSelector(selector, cssClassName, colorProperty);
        if (labelColor) {
            style.color = (typeof labelColor === 'string') ? CssPropertyParser_1.CssPropertyParser.createColor(labelColor) : labelColor;
        }
        var labelFontSize = CssPropertyParser_1.CssPropertyParser
            .getPropertyFromSelector(selector, cssClassName, fontSizeProperty);
        if (labelFontSize) {
            style.fontSize = labelFontSize;
        }
        var labelFontFamily = CssPropertyParser_1.CssPropertyParser
            .getPropertyFromSelector(selector, cssClassName, fontFamilyProperty);
        if (labelFontFamily) {
            style.fontFamily = CssPropertyParser_1.CssPropertyParser.createFontFamily(labelFontFamily);
        }
        var labelFontWeight = CssPropertyParser_1.CssPropertyParser
            .getPropertyFromSelector(selector, cssClassName, fontWeightProperty);
        if (labelFontWeight) {
            style.fontWeight = font_1.FontWeight.parse(labelFontWeight);
        }
        var labelBackgroundColor = CssPropertyParser_1.CssPropertyParser.getPropertyFromSelector(selector, cssClassName, backgroundColorProperty);
        if (labelBackgroundColor) {
            style.backgroundColor = (typeof labelBackgroundColor === 'string') ?
                CssPropertyParser_1.CssPropertyParser.createColor(labelBackgroundColor) : labelBackgroundColor;
        }
        var labelBorderRadius = CssPropertyParser_1.CssPropertyParser
            .getPropertyFromSelector(selector, cssClassName, borderRadiusProperty);
        if (labelBorderRadius) {
            labelBorderRadius = labelBorderRadius.replace('dp', '').replace('dip', '');
            if (I18nFormatter_1.I18nFormatter.validateNumber(labelBorderRadius)) {
                style.borderRadius = labelBorderRadius;
            }
        }
        var labelMarginLeft = CssPropertyParser_1.CssPropertyParser
            .getPropertyFromSelector(selector, cssClassName, marginLeftProperty);
        if (labelMarginLeft) {
            style.marginLeft = labelMarginLeft;
        }
        var labelMarginRight = CssPropertyParser_1.CssPropertyParser
            .getPropertyFromSelector(selector, cssClassName, marginRightProperty);
        if (labelMarginRight) {
            style.marginRight = labelMarginRight;
        }
        var labelOpacity = CssPropertyParser_1.CssPropertyParser
            .getPropertyFromSelector(selector, cssClassName, opacityProperty);
        if (labelOpacity) {
            if (I18nFormatter_1.I18nFormatter.validateNumber(labelOpacity) && labelOpacity >= 0 && labelOpacity <= 1) {
                style.opacity = labelOpacity;
            }
        }
        return style;
    };
    Object.defineProperty(ToolbarItem.prototype, "isBindable", {
        get: function () {
            return false;
        },
        enumerable: true,
        configurable: true
    });
    ToolbarItem.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
    };
    ToolbarItem.prototype.view = function () {
        return this.toolbarItemView;
    };
    Object.defineProperty(ToolbarItem.prototype, "clickable", {
        get: function () {
            return this._clickable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItem.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItem.prototype, "enabled", {
        get: function () {
            return this.toolbarItemView.enabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItem.prototype, "caption", {
        get: function () {
            return this.toolbarItemView.text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItem.prototype, "visibility", {
        get: function () {
            return this.toolbarItemView.visibility;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItem.prototype, "width", {
        get: function () {
            return this.toolbarItemView.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItem.prototype, "systemItem", {
        get: function () {
            return this.toolbarItemView.systemItem;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarItem.prototype, "itemType", {
        get: function () {
            return this.toolbarItemView.itemType;
        },
        enumerable: true,
        configurable: true
    });
    ToolbarItem.prototype.setCaption = function (caption) {
        var _this = this;
        return ValueResolver_1.ValueResolver.resolveValue(caption, this.context).then(function (sCaption) {
            _this.toolbarItemView.text = (sCaption != null && sCaption.length > 0) ? sCaption : _this.toolbarItemView.text;
        });
    };
    ToolbarItem.prototype.setEnabled = function (enabled) {
        var _this = this;
        return ValueResolver_1.ValueResolver.resolveValue(enabled, this.context).then(function (enabledItem) {
            _this.toolbarItemView.enabled = !!enabledItem;
        });
    };
    ToolbarItem.prototype.setStyle = function (cssClassName) {
        var defaultClassName;
        if (!this._clickable) {
            defaultClassName = this._toolbarLabelStyle;
            this.view().itemStyle = this._itemLabelStyle;
        }
        else {
            defaultClassName = this._toolbarItemStyle;
            this.view().itemStyle = this._itemStyle;
        }
        this.view().itemStyle.cssClassName = defaultClassName;
        if (cssClassName) {
            Object.assign(this.view().itemStyle, ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.ClassSelector, cssClassName));
            this.view().itemStyle.cssClassName = cssClassName;
        }
        this.view().toolBar.update();
    };
    ToolbarItem.prototype.setImage = function (img) {
        if (img != null && img.length > 0) {
            var defProvider = IDefinitionProvider_1.IDefinitionProvider.instance();
            try {
                var imgData = defProvider.getDefinition(img);
                this.view().icon = imgData;
            }
            catch (e) {
                this.view().icon = img;
            }
        }
    };
    ToolbarItem.prototype.setVisibility = function (visibility) {
        if (!this.toolbarItemView) {
            return;
        }
        if (visibility != null && visibility.length > 0) {
            if (visibility === 'visible' || visibility === 'hidden' || visibility === 'collapse') {
                this.toolbarItemView.visibility = visibility;
            }
            else {
                Logger_1.Logger.instance.ui.log("Invalid value for visibility: " + visibility);
            }
        }
    };
    ToolbarItem.prototype.setWidth = function (width) {
        this.toolbarItemView.width = width;
    };
    ToolbarItem.prototype.setSystemItem = function (systemItem) {
        if (systemItem !== undefined && systemItem !== '') {
            this.toolbarItemView.systemItem = systemItem;
        }
    };
    ToolbarItem.prototype.setItemType = function (itemType) {
        if (itemType) {
            if (toolbar_plugin_1.ItemType.isValid(itemType)) {
                this.toolbarItemView.itemType = toolbar_plugin_1.ItemType.parse(itemType);
            }
        }
    };
    ToolbarItem.prototype.createToolBarItem = function (def) {
        var _this = this;
        var builder = new ToolbarItemDataBuilder_1.ToolbarItemDataBuilder(this.context);
        builder.setName(def.name)
            .setCaption(def.caption)
            .setImage(def.image)
            .setSystemItem(def.systemItem)
            .setAction(def.action)
            .setEnabled(def.enabled)
            .setVisible(def.visible)
            .setWidth(def.width)
            .setClickable(def.clickable)
            .setItemType(def.itemType);
        return builder.build().then(function (data) {
            _this._name = data.name;
            var visibility = 'visible';
            var item = _this.toolbarItemView;
            var createIt = !item;
            if (createIt) {
                item = new toolbar_plugin_1.ToolBarItem();
            }
            if (!data.clickable) {
                _this._clickable = false;
                item.itemStyle = _this._itemLabelStyle;
                item.isUserInteractionEnabled = false;
                item.clickable = false;
            }
            else {
                item.clickable = true;
                if (_this.parent instanceof ToolbarContainer_1.ToolbarContainer) {
                    Object.assign(_this._itemStyle, _this.parent.getToolBarItemDefaultStyle());
                }
                item.itemStyle = _this._itemStyle;
                if (data.systemItem) {
                    item.systemItem = data.systemItem;
                }
                if (data.action != null) {
                    var page_1 = _this.page();
                    if (createIt) {
                        item.on(toolbar_plugin_1.ToolBarItem.tapEvent, function (dataArgs) {
                            if (_this.page().isNavigating) {
                                return;
                            }
                            else {
                                _this.page().dismissPopover();
                                var oEventHandler = new EventHandler_1.EventHandler();
                                var clientAPIProps = page_1.context.clientAPIProps;
                                clientAPIProps.pressedItem = PressedItem_1.PressedItem.WithToolbarItem(item);
                                var executeSource = new ExecuteSource_1.ExecuteSource(_this.page().frame.id);
                                executeSource.sourceType = ExecuteSource_1.ExecuteSourceType.ParentPage;
                                if (TabFrame_1.TabFrame.isTab(item.page.frame)) {
                                    executeSource.sourceType = ExecuteSource_1.ExecuteSourceType.TabPage;
                                    if (TabFrame_1.TabFrame.isChildTabs(item.page.frame)) {
                                        executeSource.sourceType = ExecuteSource_1.ExecuteSourceType.TabPageParent;
                                    }
                                    else {
                                        var parentFrame = TabFrame_1.TabFrame.getParentTopmostFrame(item.page.frame);
                                        if (parentFrame && TabFrame_1.TabFrame.isTab(parentFrame)) {
                                            executeSource.sourceType = ExecuteSource_1.ExecuteSourceType.TabPageChild;
                                        }
                                    }
                                }
                                else if (ModalFrame_1.ModalFrame.isModal(item.page.frame)) {
                                    executeSource.sourceType = ExecuteSource_1.ExecuteSourceType.ModalPage;
                                }
                                oEventHandler.setEventSource(executeSource);
                                _this.context.clientAPIProps.eventSource = executeSource;
                                oEventHandler.executeActionOrRule(data.action, _this.context);
                            }
                        });
                    }
                }
            }
            if (item.itemStyle) {
                Object.assign(item.itemStyle, ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.IdSelector, def.name));
            }
            else {
                item.itemStyle = ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.IdSelector, def.name);
            }
            if (!item.itemStyle.rippleColor && _this._itemPressedStyle && _this._itemPressedStyle.color) {
                _this._itemStyle.rippleColor = _this._itemPressedStyle.color;
            }
            if (data.itemType) {
                if (toolbar_plugin_1.ItemType.isValid(data.itemType)) {
                    item.itemType = toolbar_plugin_1.ItemType.parse(data.itemType);
                }
            }
            if (data.image != null && data.image.length > 0) {
                item.icon = data.image;
            }
            if (data.caption != null && data.caption.length > 0) {
                item.text = data.caption;
            }
            else {
                item.text = _this.name;
            }
            item.name = _this.name;
            if (data.width > 0) {
                item.width = data.width;
            }
            item.enabled = !!data.enabled;
            if (createIt) {
                ToolbarItem.counter += 1;
                item.tag = ToolbarItem.counter;
            }
            _this.toolbarItemView = item;
            if (!data.visible) {
                visibility = 'collapse';
            }
            _this.setVisibility(visibility);
            return _this;
        });
    };
    ToolbarItem.prototype.redraw = function () {
        return this.createToolBarItem(this.definition());
    };
    ToolbarItem.prototype.createObservable = function () {
        return new ToolbarItemObservable_1.ToolbarItemObservable(this, this.definition(), this.page());
    };
    ToolbarItem.counter = 0;
    return ToolbarItem;
}(BaseControl_1.BaseControl));
exports.ToolbarItem = ToolbarItem;
;
