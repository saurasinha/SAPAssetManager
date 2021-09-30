"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var toolbar_plugin_common_1 = require("./toolbar-plugin-common");
var utils_1 = require("tns-core-modules/utils/utils");
var image_1 = require("tns-core-modules/ui/image");
var toolbar_label_1 = require("./toolbar-label");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
var platform_1 = require("tns-core-modules/platform");
var application = require("tns-core-modules/application");
var image_source_1 = require("tns-core-modules/image-source");
var font_1 = require("tns-core-modules/ui/styling/font");
__export(require("./toolbar-plugin-common"));
var R_ID_HOME = 0x0102002c;
var ACTION_ITEM_ID_OFFSET = 10000;
var DEFAULT_ELEVATION = 4;
var appCompatTextView;
var bottomItemIdGenerator = ACTION_ITEM_ID_OFFSET;
function generateItemId() {
    bottomItemIdGenerator++;
    return bottomItemIdGenerator;
}
var appResources;
var impMenuItemClickListener;
function initializeMenuItemClickListener() {
    if (impMenuItemClickListener) {
        return;
    }
    appCompatTextView = androidx.appcompat.widget.AppCompatTextView;
    var MenuItemClickListenerImpl = (function (_super) {
        __extends(MenuItemClickListenerImpl, _super);
        function MenuItemClickListenerImpl(owner) {
            var _this = _super.call(this) || this;
            _this.owner = owner;
            return global.__native(_this);
        }
        MenuItemClickListenerImpl.prototype.onMenuItemClick = function (item) {
            var itemId = item.getItemId();
            return this.owner._onAndroidItemSelected(itemId);
        };
        MenuItemClickListenerImpl = __decorate([
            Interfaces([androidx.appcompat.widget.Toolbar.OnMenuItemClickListener]),
            __metadata("design:paramtypes", [ToolBar])
        ], MenuItemClickListenerImpl);
        return MenuItemClickListenerImpl;
    }(java.lang.Object));
    impMenuItemClickListener = MenuItemClickListenerImpl;
    appResources = application.android.context.getResources();
}
var ToolBarItem = (function (_super) {
    __extends(ToolBarItem, _super);
    function ToolBarItem() {
        var _this = _super.call(this) || this;
        _this._androidPosition = {
            position: 'actionBar',
            systemIcon: undefined,
        };
        _this._itemId = generateItemId();
        return _this;
    }
    Object.defineProperty(ToolBarItem.prototype, "android", {
        get: function () {
            return this._androidPosition;
        },
        set: function (value) {
            throw new Error('BottomItem.android is read-only');
        },
        enumerable: true,
        configurable: true
    });
    ToolBarItem.prototype._getItemId = function () {
        return this._itemId;
    };
    return ToolBarItem;
}(toolbar_plugin_common_1.ToolBarItemBase));
exports.ToolBarItem = ToolBarItem;
var AndroidBottomBarSettings = (function () {
    function AndroidBottomBarSettings(toolBar) {
        this._iconVisibility = 'auto';
        this._toolBar = toolBar;
    }
    Object.defineProperty(AndroidBottomBarSettings.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (value) {
            if (value !== this._icon) {
                this._icon = value;
                this._toolBar._onIconPropertyChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AndroidBottomBarSettings.prototype, "iconVisibility", {
        get: function () {
            return this._iconVisibility;
        },
        set: function (value) {
            if (value !== this._iconVisibility) {
                this._iconVisibility = value;
                this._toolBar._onIconPropertyChanged();
            }
        },
        enumerable: true,
        configurable: true
    });
    return AndroidBottomBarSettings;
}());
exports.AndroidBottomBarSettings = AndroidBottomBarSettings;
var NavigationButton = (function (_super) {
    __extends(NavigationButton, _super);
    function NavigationButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NavigationButton;
}(ToolBarItem));
exports.NavigationButton = NavigationButton;
var ToolBar = (function (_super) {
    __extends(ToolBar, _super);
    function ToolBar() {
        var _this = _super.call(this) || this;
        _this._itemMargin = 8;
        _this._itemTopBottomMargin = 12;
        _this._containedItemMargin = 16;
        _this._containedItemBackgroundColor = '#0A6ED1';
        _this._containedItemColor = '#ffffff';
        _this._containedItemBorderRadius = 4;
        _this._android = new AndroidBottomBarSettings(_this);
        return _this;
    }
    ToolBar._setOnClickListener = function (item) {
        item.actionView.android.setOnClickListener(new android.view.View.OnClickListener({
            onClick: function (v) {
                var _owner;
                _owner = new WeakRef(item);
                var owner = _owner.get();
                if (owner) {
                    owner._emit(toolbar_plugin_common_1.ToolBarItemBase.tapEvent);
                }
            },
        }));
    };
    Object.defineProperty(ToolBar.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    ToolBar.prototype.createNativeView = function () {
        return new androidx.appcompat.widget.Toolbar(this._context);
    };
    ToolBar.prototype.initNativeView = function () {
        _super.prototype.initNativeView.call(this);
        var nativeView = this.nativeViewProtected;
        initializeMenuItemClickListener();
        var menuItemClickListener = new impMenuItemClickListener(this);
        nativeView.setOnMenuItemClickListener(menuItemClickListener);
        nativeView.menuItemClickListener = menuItemClickListener;
    };
    ToolBar.prototype.disposeNativeView = function () {
        this.nativeViewProtected.menuItemClickListener.owner = null;
        _super.prototype.disposeNativeView.call(this);
    };
    ToolBar.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.height = getToolBarHeight();
    };
    ToolBar.prototype.update = function () {
        if (!this.nativeViewProtected) {
            return;
        }
        var page = this.page;
        if (!page.frame) {
            this.nativeViewProtected.setVisibility(android.view.View.GONE);
            return;
        }
        this.nativeViewProtected.setVisibility(android.view.View.VISIBLE);
        var paddingInPx = toolbar_plugin_common_1.layout.round(toolbar_plugin_common_1.layout.toDevicePixels(getToolBarPadding()));
        this.nativeViewProtected.setPadding(paddingInPx, 0, paddingInPx, 0);
        this._addToolBarItems();
        this._updateIcon();
    };
    ToolBar.prototype._onAndroidItemSelected = function (itemId) {
        var menuItem = undefined;
        var items = this.barItems.getItems();
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var i = items_1[_i];
            if (i._getItemId() === itemId) {
                menuItem = i;
                break;
            }
        }
        if (menuItem) {
            this._tap(menuItem);
            return true;
        }
        return false;
    };
    ToolBar.prototype._updateIcon = function () {
        var visibility = getVisibility(this.android.iconVisibility);
        if (visibility) {
            var icon = this.android.icon;
            if (icon !== undefined) {
                var drawableOrId = getDrawableOrResourceId(icon, appResources);
                if (drawableOrId) {
                    this.nativeViewProtected.setLogo(drawableOrId);
                }
            }
            else {
                var defaultIcon = application.android.nativeApp.getApplicationInfo().icon;
                this.nativeViewProtected.setLogo(defaultIcon);
            }
        }
        else {
            this.nativeViewProtected.setLogo(null);
        }
    };
    ToolBar.prototype._addToolBarItems = function () {
        var _this = this;
        var menu = this.nativeViewProtected.getMenu();
        menu.clear();
        var menuItem = undefined;
        var menuItemId = undefined;
        var items = this.barItems.getVisibleItems();
        var activity = application.android.foregroundActivity;
        var typedValue = undefined;
        var selectedItemDrawable = undefined;
        var attr = java.lang.Class.forName('androidx.appcompat.R$attr');
        var field = attr.getField('selectableItemBackgroundBorderless');
        if (field && activity && android.os.Build.VERSION.SDK_INT >= 23) {
            var attrs = Array.create('int', 1);
            attrs[0] = field.getInt(null);
            typedValue = activity.obtainStyledAttributes(attrs);
        }
        var currentItemIndex = -1;
        var stackLayout = undefined;
        var fontSizeInfo = undefined;
        var fontSizeValue = undefined;
        var fontSizeUnit = undefined;
        var labelFont = undefined;
        var showAsAction = undefined;
        var image = undefined;
        var label = undefined;
        var layoutBackground = undefined;
        var layoutOpacity = undefined;
        var layoutBorderRadius = undefined;
        var rippleColor = undefined;
        var spacingMenuItem = undefined;
        var spacingStackLayout = undefined;
        var rightMostItemIndex = items.length - 1;
        currentItemIndex = items.length - 1;
        while (currentItemIndex >= 0) {
            var item = items[currentItemIndex];
            if (this._isItemBeingRendered(item)) {
                rightMostItemIndex = currentItemIndex;
                break;
            }
            else {
                currentItemIndex = currentItemIndex - 1;
            }
        }
        currentItemIndex = -1;
        var itemPromises = [];
        for (var _i = 0, items_2 = items; _i < items_2.length; _i++) {
            var i = items_2[_i];
            currentItemIndex = currentItemIndex + 1;
            var item = i;
            itemPromises.push(this.getImageOrLabel(item, currentItemIndex, rightMostItemIndex));
        }
        currentItemIndex = -1;
        Promise.all(itemPromises).then(function (toolbarItems) {
            if (Array.isArray(toolbarItems) && toolbarItems.length > 0) {
                toolbarItems.forEach(function (toolbarItem) {
                    menuItem = undefined;
                    spacingMenuItem = undefined;
                    currentItemIndex = currentItemIndex + 1;
                    if (!toolbarItem) {
                        return;
                    }
                    var item = toolbarItem.item;
                    menuItemId = item._getItemId();
                    stackLayout = new stack_layout_1.StackLayout();
                    if (item.width) {
                        stackLayout.width = item.width;
                        stackLayout.horizontalAlignment = 'center';
                        stackLayout.verticalAlignment = 'middle';
                    }
                    if (toolbarItem.image) {
                        image = toolbarItem.image;
                        if (item.enabled === false) {
                            image.isEnabled = false;
                        }
                        stackLayout.addChild(image);
                    }
                    if (toolbarItem.label) {
                        label = toolbarItem.label;
                        layoutBackground = undefined;
                        layoutOpacity = undefined;
                        layoutBorderRadius = undefined;
                        rippleColor = undefined;
                        var itemStyle = item.itemStyle ? item.itemStyle : _this.style;
                        var containedItemStyle = _this.containedItemStyle ? _this.containedItemStyle : undefined;
                        if (item.enabled === false) {
                            label.isEnabled = false;
                            itemStyle = _this.itemDisabledStyle ? _this.itemDisabledStyle : itemStyle;
                            containedItemStyle = _this.containedItemDisabledStyle ?
                                _this.containedItemDisabledStyle : containedItemStyle;
                        }
                        if (itemStyle) {
                            labelFont = label.style.fontInternal ? label.style.fontInternal : font_1.Font.default;
                            if (itemStyle.fontSize) {
                                fontSizeInfo = itemStyle.fontSize.split(/([0-9]+)/).filter(Boolean);
                                if (fontSizeInfo) {
                                    if (fontSizeInfo.length >= 1) {
                                        label.fontSizeUnit = undefined;
                                        fontSizeValue = fontSizeInfo[0];
                                        if (fontSizeInfo.length >= 2) {
                                            fontSizeUnit = fontSizeInfo[1];
                                        }
                                        if (fontSizeUnit === 'sp') {
                                            label.fontSizeUnit = fontSizeUnit;
                                            label.fontSize = fontSizeValue;
                                        }
                                        else {
                                            labelFont = labelFont.withFontSize(fontSizeValue);
                                        }
                                    }
                                }
                            }
                            if (itemStyle.fontFamily) {
                                labelFont = labelFont.withFontFamily(itemStyle.fontFamily);
                            }
                            if (itemStyle.fontWeight) {
                                labelFont = labelFont.withFontWeight(itemStyle.fontWeight);
                            }
                            label.style.fontInternal = labelFont;
                        }
                        if (item.itemType === ItemTypeAndroid.Button) {
                            layoutBorderRadius = _this._containedItemBorderRadius;
                            layoutBackground = _this._containedItemBackgroundColor;
                            label.style.marginLeft = _this._containedItemMargin;
                            label.style.marginRight = _this._containedItemMargin;
                            label.style.color = new toolbar_plugin_common_1.Color(_this._containedItemColor);
                            if (containedItemStyle) {
                                if (containedItemStyle.borderRadius) {
                                    layoutBorderRadius = containedItemStyle.borderRadius;
                                }
                                if (containedItemStyle.backgroundColor) {
                                    layoutBackground = containedItemStyle.backgroundColor;
                                }
                                if (containedItemStyle.marginLeft) {
                                    label.style.marginLeft = containedItemStyle.marginLeft;
                                }
                                if (containedItemStyle.marginRight) {
                                    label.style.marginRight = containedItemStyle.marginRight;
                                }
                                if (containedItemStyle.color) {
                                    label.style.color = containedItemStyle.color.android;
                                }
                                if (containedItemStyle.opacity) {
                                    label.style.opacity = containedItemStyle.opacity;
                                    layoutOpacity = containedItemStyle.opacity;
                                }
                                if (containedItemStyle.rippleColor) {
                                    rippleColor = containedItemStyle.rippleColor.android;
                                }
                            }
                        }
                        else {
                            if (itemStyle) {
                                if (itemStyle.color) {
                                    label.style.color = itemStyle.color.android;
                                }
                                if (itemStyle.opacity) {
                                    label.style.opacity = itemStyle.opacity;
                                }
                                if (itemStyle.rippleColor) {
                                    rippleColor = itemStyle.rippleColor.android;
                                }
                            }
                        }
                        if (layoutBorderRadius) {
                            stackLayout.borderRadius = layoutBorderRadius;
                        }
                        stackLayout.addChild(label);
                    }
                    if (stackLayout.getChildrenCount() >= 1 || item.width) {
                        item.setActionView(stackLayout);
                        menuItem = menu.add(android.view.Menu.NONE, menuItemId, android.view.Menu.NONE, item.text + '');
                    }
                    if (item.actionView && item.actionView.android && menuItem) {
                        item.android.position = 'actionBar';
                        menuItem.setActionView(item.actionView.android);
                        ToolBar._setOnClickListener(item);
                        if (item.enabled === false) {
                            menuItem.getActionView().setEnabled(false);
                        }
                        else {
                            if (item.clickable && typedValue !== undefined) {
                                selectedItemDrawable = typedValue.getDrawable(0);
                                if (!layoutBackground) {
                                    var rippleDrawable = selectedItemDrawable;
                                    if (rippleColor) {
                                        rippleDrawable.setColor(android.content.res.ColorStateList.valueOf(rippleColor));
                                    }
                                    item.actionView.android.setBackground(rippleDrawable);
                                }
                                else {
                                    item.actionView.android.setForeground(selectedItemDrawable);
                                }
                            }
                        }
                        if (layoutBackground) {
                            item.actionView.backgroundColor = layoutBackground;
                        }
                        if (layoutOpacity) {
                            item.actionView.opacity = layoutOpacity;
                        }
                        showAsAction = getShowAsAction(item);
                        menuItem.setShowAsAction(showAsAction);
                    }
                    if (menuItem && currentItemIndex < rightMostItemIndex) {
                        spacingStackLayout = new stack_layout_1.StackLayout();
                        spacingStackLayout.width = _this._itemMargin;
                        item.setSpacingActionView(spacingStackLayout);
                        item.spacingActionView.opacity = 0;
                        spacingMenuItem = menu.add(android.view.Menu.NONE, menuItemId + 10000, android.view.Menu.NONE, '');
                        spacingMenuItem.setActionView(item.spacingActionView.android);
                        spacingMenuItem.setShowAsAction(showAsAction);
                    }
                });
            }
        });
    };
    ToolBar.prototype._onIconPropertyChanged = function () {
        if (this.nativeViewProtected) {
            this._updateIcon();
        }
    };
    ToolBar.prototype._addViewToNativeVisualTree = function (child, atIndex) {
        if (atIndex === void 0) { atIndex = Number.MAX_VALUE; }
        _super.prototype._addViewToNativeVisualTree.call(this, child);
        if (this.nativeViewProtected && child.nativeViewProtected) {
            if (atIndex >= this.nativeViewProtected.getChildCount()) {
                this.nativeViewProtected.addView(child.nativeViewProtected);
            }
            else {
                this.nativeViewProtected.addView(child.nativeViewProtected, atIndex);
            }
            return true;
        }
        return false;
    };
    ToolBar.prototype._removeViewFromNativeVisualTree = function (child) {
        _super.prototype._removeViewFromNativeVisualTree.call(this, child);
        if (this.nativeViewProtected && child.nativeViewProtected) {
            this.nativeViewProtected.removeView(child.nativeViewProtected);
        }
    };
    ToolBar.prototype._isEmpty = function () {
        if ((this.android && this.android.icon) ||
            this.barItems.getItems().length > 0) {
            return false;
        }
        return true;
    };
    ToolBar.prototype._isItemBeingRendered = function (item) {
        if (item.systemItem) {
            var parsedSystemItem = SystemItem.parse(item.systemItem.toString(), SystemItem.systemItemColor);
            if (parsedSystemItem !== undefined ? parsedSystemItem === '' : false) {
                if (item.width > 0 || item.icon !== null || item.text !== item.name) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };
    ToolBar.prototype._tap = function (item) {
        var _owner;
        _owner = new WeakRef(item);
        var owner = _owner.get();
        if (owner) {
            owner._emit(toolbar_plugin_common_1.ToolBarItemBase.tapEvent);
        }
    };
    ToolBar.prototype[toolbar_plugin_common_1.colorProperty.getDefault] = function () {
        var nativeView = this.nativeViewProtected;
        if (!defaultTitleTextColor) {
            var tv = getAppCompatTextView(nativeView);
            if (!tv) {
                var title = nativeView.getTitle();
                nativeView.setTitle('');
                tv = getAppCompatTextView(nativeView);
                if (title) {
                    nativeView.setTitle(title);
                }
            }
            defaultTitleTextColor = tv ? tv.getTextColors().getDefaultColor() : -570425344;
        }
        return defaultTitleTextColor;
    };
    ToolBar.prototype[toolbar_plugin_common_1.colorProperty.setNative] = function (value) {
        var color = value instanceof toolbar_plugin_common_1.Color ? value.android : value;
        this.nativeViewProtected.setTitleTextColor(color);
    };
    ToolBar.prototype.getImageOrLabel = function (item, currentItemIndex, rightMostItemIndex) {
        var _this = this;
        var imagePromise;
        var labelText = item.text.toUpperCase();
        imagePromise = Promise.resolve(item);
        var image = undefined;
        var label = undefined;
        if (item.systemItem || item.android.systemIcon || item.icon) {
            var systemIcon = undefined;
            if (item.systemItem || item.android.systemIcon) {
                var parsedSystemItem = undefined;
                if (item.systemItem) {
                    parsedSystemItem = SystemItem.parse(item.systemItem.toString(), SystemItem.systemItemColor);
                }
                systemIcon = parsedSystemItem !== undefined ? parsedSystemItem :
                    item.android.systemIcon ? item.android.systemIcon :
                        undefined;
                if (systemIcon !== undefined) {
                    if (systemIcon.indexOf('res://') > -1) {
                        image = new image_1.Image();
                        image.src = systemIcon.toString();
                    }
                    else if (systemIcon.indexOf('_') > -1) {
                        var systemResourceId = getSystemResourceId(systemIcon.toString());
                        if (systemResourceId) {
                            image = new image_1.Image();
                            image.src = getSystemResourceImageSource(systemResourceId);
                        }
                        else {
                            systemIcon = undefined;
                        }
                    }
                    else {
                        if (item.text === item.name) {
                            labelText = systemIcon;
                        }
                    }
                }
            }
            if ((systemIcon === undefined || systemIcon === '') && item.icon) {
                var itemStyle = item.itemStyle;
                if (item.enabled === false && this.itemDisabledStyle && this.itemDisabledStyle.color) {
                    itemStyle = this.itemDisabledStyle;
                    if (itemStyle.color instanceof toolbar_plugin_common_1.Color) {
                        var itemDisabledStyleColor = new toolbar_plugin_common_1.Color(127.5, itemStyle.color.r, itemStyle.color.g, itemStyle.color.b);
                        itemStyle.color = itemDisabledStyleColor;
                    }
                }
                imagePromise = this.getImageSourceFromIcon(item.icon, itemStyle).then(function (imgSource) {
                    if (imgSource) {
                        image = new image_1.Image();
                        image.src = imgSource;
                    }
                    else {
                        image = undefined;
                    }
                });
            }
        }
        return imagePromise.then(function () {
            if (image !== undefined) {
                image.stretch = 'aspectFit';
                image.style.marginTop = _this._itemTopBottomMargin;
                image.style.marginBottom = _this._itemTopBottomMargin;
                image.style.marginLeft = _this._itemMargin;
                if (currentItemIndex < rightMostItemIndex) {
                    image.style.marginRight = _this._itemMargin;
                }
                image.horizontalAlignment = 'center';
                image.verticalAlignment = 'middle';
                labelText = undefined;
                return { item: item, image: image };
            }
            if (labelText !== undefined && labelText !== '') {
                label = new toolbar_label_1.ToolbarLabel();
                label.text = labelText;
                label.horizontalAlignment = 'center';
                label.verticalAlignment = 'stretch';
                label.style.marginTop = _this._itemMargin;
                label.style.marginBottom = _this._itemMargin;
                label.style.marginLeft = _this._itemMargin;
                label.style.letterSpacing = 0.044;
                label.style.lineHeight = 15.7;
                if (currentItemIndex < rightMostItemIndex) {
                    label.style.marginRight = _this._itemMargin;
                }
                return { item: item, label: label };
            }
            return null;
        });
    };
    return ToolBar;
}(toolbar_plugin_common_1.ToolBarBase));
exports.ToolBar = ToolBar;
function getAppCompatTextView(toolbar) {
    for (var i = 0, count = toolbar.getChildCount(); i < count; i++) {
        var child = toolbar.getChildAt(i);
        if (child instanceof appCompatTextView) {
            return child;
        }
    }
    return null;
}
var defaultTitleTextColor;
function getDrawableOrResourceId(icon, resources) {
    if (typeof icon !== 'string') {
        return undefined;
    }
    if (icon.indexOf(utils_1.RESOURCE_PREFIX) === 0) {
        var resourceId = resources.getIdentifier(icon.substr(utils_1.RESOURCE_PREFIX.length), 'drawable', application.android.packageName);
        if (resourceId > 0) {
            return resourceId;
        }
    }
    else {
        var is = void 0;
        var drawable = void 0;
        if (icon.lastIndexOf('data:image/png', 0) === 0 || icon.lastIndexOf('data:image/jpeg', 0) === 0) {
            var base64Data = icon.split(',')[1];
            if (base64Data !== undefined) {
                var imageBytes = android.util.Base64.decode(base64Data, android.util.Base64.DEFAULT);
                var imageBitmap = android.graphics.BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
                drawable = new android.graphics.drawable.BitmapDrawable(application.android.context.getResources(), imageBitmap);
            }
        }
        return drawable;
    }
    return undefined;
}
function getShowAsAction(menuItem) {
    switch (menuItem.android.position) {
        case 'actionBarIfRoom':
            return android.view.MenuItem.SHOW_AS_ACTION_IF_ROOM;
        case 'popup':
            return android.view.MenuItem.SHOW_AS_ACTION_NEVER;
        case 'actionBar':
        default:
            return android.view.MenuItem.SHOW_AS_ACTION_ALWAYS;
    }
}
function getVisibility(visibility) {
    switch (visibility) {
        case 'always':
            return true;
        case 'auto':
        case 'never':
        default:
            return false;
    }
}
function getSystemResourceId(systemIcon) {
    return android.content.res.Resources.getSystem().getIdentifier(systemIcon, 'drawable', 'android');
}
function getSystemResourceImageSource(systemResourceId) {
    var imgSource = new image_source_1.ImageSource();
    var bitmapDrawable = android.content.res.Resources.
        getSystem().getDrawable(systemResourceId);
    if (bitmapDrawable && bitmapDrawable.getBitmap) {
        imgSource.android = bitmapDrawable.getBitmap();
    }
    return imgSource;
}
function getToolBarPadding() {
    return platform_1.device.deviceType === 'Tablet' ? 24 : 16;
}
function getToolBarHeight() {
    return platform_1.device.deviceType === 'Tablet' ? 52 : 48;
}
var SystemItem = (function (_super) {
    __extends(SystemItem, _super);
    function SystemItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SystemItem.parse = function (key, style, isRTL) {
        if (key.indexOf('_') > 0) {
            return key.toLowerCase();
        }
        else {
            if (this.isValid(key)) {
                var value = '';
                var systemItemValue = this.systemItemEnum[key];
                value = systemItemValue !== '' ? 'res://' + systemItemValue.toString() : '';
                if (value !== '') {
                    value = isRTL && this.systemItemRTL.includes(key) ? value + '_rtl' : value;
                    value = style ? value + '_' + style : value + '_' + SystemItem.systemItemColor;
                    value = value + '_24';
                }
                return value;
            }
        }
        return undefined;
    };
    Object.defineProperty(SystemItem, "systemItemColor", {
        get: function () {
            return application.systemAppearance() === 'light' ? 'black' : 'white';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemItem, "systemItemEnum", {
        get: function () {
            return SystemItemAndroid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SystemItem, "systemItemRTL", {
        get: function () {
            return systemItemRTLAndroid;
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
    Object.defineProperty(ItemType, "itemTypeEnum", {
        get: function () {
            return ItemTypeAndroid;
        },
        enumerable: true,
        configurable: true
    });
    return ItemType;
}(toolbar_plugin_common_1.ItemTypeBase));
exports.ItemType = ItemType;
var SystemItemAndroid;
(function (SystemItemAndroid) {
    SystemItemAndroid["Action"] = "outline_launch";
    SystemItemAndroid["Add"] = "outline_add";
    SystemItemAndroid["Bookmarks"] = "outline_bookmark";
    SystemItemAndroid["Camera"] = "outline_camera_alt";
    SystemItemAndroid["Cancel"] = "outline_close";
    SystemItemAndroid["Compose"] = "outline_note_add";
    SystemItemAndroid["Done"] = "outline_done";
    SystemItemAndroid["Edit"] = "outline_edit";
    SystemItemAndroid["FastForward"] = "outline_fast_forward";
    SystemItemAndroid["Pause"] = "outline_pause";
    SystemItemAndroid["Play"] = "outline_play_arrow";
    SystemItemAndroid["Refresh"] = "outline_refresh";
    SystemItemAndroid["Reply"] = "outline_reply";
    SystemItemAndroid["Rewind"] = "outline_fast_rewind";
    SystemItemAndroid["Save"] = "outline_save";
    SystemItemAndroid["Search"] = "outline_search";
    SystemItemAndroid["Stop"] = "outline_stop";
    SystemItemAndroid["Trash"] = "outline_delete";
    SystemItemAndroid["Organize"] = "outline_folder";
    SystemItemAndroid["Undo"] = "outline_undo";
    SystemItemAndroid["Redo"] = "outline_redo";
    SystemItemAndroid["FlexibleSpace"] = "";
    SystemItemAndroid["FixedSpace"] = "";
})(SystemItemAndroid || (SystemItemAndroid = {}));
var systemItemRTLAndroid = [
    'Action',
    'Undo',
    'Redo',
    'Reply',
];
var ItemTypeAndroid;
(function (ItemTypeAndroid) {
    ItemTypeAndroid["Normal"] = "normal";
    ItemTypeAndroid["Button"] = "button";
})(ItemTypeAndroid || (ItemTypeAndroid = {}));
