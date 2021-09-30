"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toolbar_plugin_1 = require("toolbar-plugin");
var ToolbarItemDefinition_1 = require("../definitions/controls/ToolbarItemDefinition");
var ToolbarItem_1 = require("./ToolbarItem");
var IControlFactory_1 = require("./IControlFactory");
var Logger_1 = require("../utils/Logger");
var BaseControl_1 = require("./BaseControl");
var CssPropertyParser_1 = require("../utils/CssPropertyParser");
var ToolbarPosition;
(function (ToolbarPosition) {
    ToolbarPosition[ToolbarPosition["bottom"] = 1] = "bottom";
    ToolbarPosition[ToolbarPosition["top"] = 2] = "top";
})(ToolbarPosition = exports.ToolbarPosition || (exports.ToolbarPosition = {}));
var ToolbarContainer = (function (_super) {
    __extends(ToolbarContainer, _super);
    function ToolbarContainer(page, definition, containerContext, isFullScreen) {
        var _this = _super.call(this) || this;
        _this.containerContext = containerContext;
        _this.position = ToolbarPosition.bottom;
        _this._toolbarDefaultStyle = 'toolbar';
        _this._toolbarItemDisabledStyle = 'ToolBarItemDisabledStyle';
        _this._toolbarContainedItemStyle = 'ToolBarContainedItemStyle';
        _this._toolbarContainedItemPressedStyle = 'ToolBarContainedItemPressedStyle';
        _this._toolbarContainedItemDisabledStyle = 'ToolBarContainedItemDisabledStyle';
        _this.toolbarItems = [];
        _this.containerPage = page;
        _this.containerDef = definition;
        _this.toolbarView = new toolbar_plugin_1.ToolBar(isFullScreen);
        _this.toolbarView.id = page.id + '_ToolBar';
        _this.toolbarView.itemDisabledStyle = ToolbarItem_1.ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.TypeSelector, _this._toolbarItemDisabledStyle);
        _this.toolbarView.containedItemStyle = ToolbarItem_1.ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.TypeSelector, _this._toolbarContainedItemStyle);
        var containedItemPressedStyle;
        containedItemPressedStyle = ToolbarItem_1.ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.TypeSelector, _this._toolbarContainedItemPressedStyle);
        if (containedItemPressedStyle && containedItemPressedStyle.color) {
            _this.toolbarView.containedItemStyle.rippleColor = containedItemPressedStyle.color;
        }
        _this.toolbarView.containedItemDisabledStyle = ToolbarItem_1.ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.TypeSelector, _this._toolbarContainedItemDisabledStyle);
        _this.toolbarView.itemFontIconStyle = ToolbarItem_1.ToolbarItem.getItemStyle(CssPropertyParser_1.Selectors.TypeSelector, _this._toolbarDefaultStyle);
        _this._defaultToolBarItemStyle = _this.toolbarView.itemFontIconStyle;
        return _this;
    }
    ToolbarContainer.prototype.view = function () {
        return this.toolbarView;
    };
    ToolbarContainer.prototype.getToolBarItemDefaultStyle = function () {
        return this._defaultToolBarItemStyle;
    };
    ToolbarContainer.prototype.setStyle = function (cssClassName) {
        if (cssClassName) {
            this.view().className = cssClassName;
        }
        else {
            this.view().className = this._toolbarDefaultStyle;
        }
        this.view().update();
    };
    ToolbarContainer.prototype.getPosition = function () {
        if (this.containerDef.getPosition()) {
            switch (this.containerDef.getPosition()) {
                case 'top':
                    this.position = ToolbarPosition.top;
                    break;
                default:
                    this.position = ToolbarPosition.bottom;
                    break;
            }
        }
        return this.position;
    };
    ToolbarContainer.prototype.getToolbarItems = function () {
        return this.toolbarItems;
    };
    ToolbarContainer.prototype.setItemCaption = function (toolbarItemName, newCaption) {
        var matchingItem = this.getToolbarItems().find(function (item) {
            return item.name === toolbarItemName;
        });
        var result = Promise.resolve();
        if (matchingItem) {
            result = matchingItem.setCaption(newCaption);
        }
        else {
            Logger_1.Logger.instance.ui.warn(Logger_1.Logger.SETITEMCAPTION_TOOLBAR_ITEM_NOT_FOUND, toolbarItemName);
        }
        return result;
    };
    ToolbarContainer.prototype.addToolbarItemWithName = function (name, onPressAction, caption, image, systemItem, enabled, width, clickable, itemType) {
        if (clickable === void 0) { clickable = true; }
        if (itemType === void 0) { itemType = ''; }
        var item = {
            Caption: caption,
            Clickable: clickable,
            Enabled: enabled,
            Image: image,
            ItemType: itemType,
            OnPressAction: onPressAction,
            SystemItem: systemItem,
            Width: width,
            _Name: name,
        };
        var def = new ToolbarItemDefinition_1.ToolbarItemDefinition(undefined, item, this);
        return this.addToolbarItem(def);
    };
    ToolbarContainer.prototype.addToolbarItem = function (newItemDef) {
        var _this = this;
        return this._createToolbarItem(newItemDef).then(function (newItem) {
            if (newItem) {
                _this._addItemToToolbar(newItem);
                _this.view().update();
            }
        });
    };
    ToolbarContainer.prototype.addToolbarItems = function (newItemDefs) {
        var _this = this;
        var promises = [];
        newItemDefs.forEach(function (itemDef) {
            promises.push(_this._createToolbarItem(itemDef));
        });
        return Promise.all(promises).then(function (newItems) {
            newItems.forEach(function (newItem) {
                if (newItem) {
                    _this._addItemToToolbar(newItem);
                }
            });
            _this.view().update();
            return newItems;
        });
    };
    ToolbarContainer.prototype.removeToolbarItem = function (name) {
        for (var _i = 0, _a = this.toolbarItems; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.name === name) {
                this.toolbarView.barItems.removeItem(item.view());
                var index_1 = this.toolbarItems.indexOf(item);
                this.toolbarItems.splice(index_1, 1);
                this.view().update();
                break;
            }
        }
    };
    ToolbarContainer.prototype.enableToolbarItem = function (name, enable) {
        for (var _i = 0, _a = this.toolbarItems; _i < _a.length; _i++) {
            var item = _a[_i];
            if (item.name === name) {
                if (!item.clickable) {
                    break;
                }
                item.view().enabled = enable;
                break;
            }
        }
    };
    ToolbarContainer.prototype.redraw = function () {
        this.toolbarItems.map(function (toolbarItem) {
            toolbarItem.redraw();
        });
    };
    ToolbarContainer.prototype._addItemToToolbar = function (toolbarItem) {
        this.toolbarView.barItems.addItem(toolbarItem.view());
        this.toolbarItems.push(toolbarItem);
    };
    ToolbarContainer.prototype._createToolbarItem = function (newItemDef) {
        if (this.toolbarItems.map(function (item) {
            return item.name;
        }).indexOf(newItemDef.name) !== -1) {
            return Promise.resolve();
        }
        var newItem = IControlFactory_1.IControlFactory.Create(this.containerPage, this.containerContext, this.containerDef, newItemDef);
        newItem.parent = this;
        return newItem.createToolBarItem(newItemDef);
    };
    return ToolbarContainer;
}(BaseControl_1.BaseControl));
exports.ToolbarContainer = ToolbarContainer;
;
