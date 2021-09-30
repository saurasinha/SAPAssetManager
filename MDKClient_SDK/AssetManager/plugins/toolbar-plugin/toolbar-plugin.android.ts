import { ToolBarItem as IToolbarItem } from 'toolbar-plugin';
import { ToolBarItemBase, ToolBarBase, isVisible, View, ViewBase, layout,
    colorProperty, Color, SystemItemBase, ItemTypeBase } from './toolbar-plugin-common';
import { RESOURCE_PREFIX } from 'tns-core-modules/utils/utils';
import { Image } from 'tns-core-modules/ui/image';
import { ToolbarLabel } from './toolbar-label';
import { StackLayout } from 'tns-core-modules/ui/layouts/stack-layout';
import { device as Device } from 'tns-core-modules/platform';
import * as application from 'tns-core-modules/application';
import { ImageSource } from 'tns-core-modules/image-source';
import { Font } from 'tns-core-modules/ui/styling/font';

export * from './toolbar-plugin-common';

declare var android;
declare var androidx;

const R_ID_HOME = 0x0102002c;
const ACTION_ITEM_ID_OFFSET = 10000;
const DEFAULT_ELEVATION = 4;

let appCompatTextView;
let bottomItemIdGenerator = ACTION_ITEM_ID_OFFSET;
function generateItemId(): number {
    bottomItemIdGenerator++;
    return bottomItemIdGenerator;
}

interface IMenuItemClickListener {
    new(owner: ToolBar): androidx.appcompat.widget.Toolbar.OnMenuItemClickListener;
}

let appResources: android.content.res.Resources;
let impMenuItemClickListener: IMenuItemClickListener;

function initializeMenuItemClickListener(): void {
    if (impMenuItemClickListener) {
        return;
    }

    appCompatTextView = androidx.appcompat.widget.AppCompatTextView;

    @Interfaces([androidx.appcompat.widget.Toolbar.OnMenuItemClickListener])
    class MenuItemClickListenerImpl extends java.lang.Object
        implements androidx.appcompat.widget.Toolbar.OnMenuItemClickListener {
        constructor(public owner: ToolBar) {
            super();
            return global.__native(this);
        }

        public onMenuItemClick(item: android.view.MenuItem): boolean {
            let itemId = item.getItemId();
            return this.owner._onAndroidItemSelected(itemId);
        }
    }

    impMenuItemClickListener = MenuItemClickListenerImpl;
    appResources = application.android.context.getResources();
}

export class ToolBarItem extends ToolBarItemBase {
    private _androidPosition: IAndroidBottomItemSettings = {
        position: 'actionBar',
        systemIcon: undefined,
    };

    private _itemId;
    constructor() {
        super();
        this._itemId = generateItemId();
    }

    public get android(): IAndroidBottomItemSettings {
        return this._androidPosition;
    }
    public set android(value: IAndroidBottomItemSettings) {
        throw new Error('BottomItem.android is read-only');
    }

    public _getItemId() {
        return this._itemId;
    }
}

export class AndroidBottomBarSettings implements IAndroidBottomBarSettings {
    private _toolBar: ToolBar;
    private _icon: string;
    private _iconVisibility: 'auto' | 'never' | 'always' = 'auto';

    constructor(toolBar: ToolBar) {
        this._toolBar = toolBar;
    }

    public get icon(): string {
        return this._icon;
    }
    public set icon(value: string) {
        if (value !== this._icon) {
            this._icon = value;
            this._toolBar._onIconPropertyChanged();
        }
    }

    public get iconVisibility(): 'auto' | 'never' | 'always' {
        return this._iconVisibility;
    }
    public set iconVisibility(value: 'auto' | 'never' | 'always') {
        if (value !== this._iconVisibility) {
            this._iconVisibility = value;
            this._toolBar._onIconPropertyChanged();
        }
    }
}

export class NavigationButton extends ToolBarItem {
    //
}

export class ToolBar extends ToolBarBase {
    private static _setOnClickListener(item: ToolBarItem): void {

        item.actionView.android.setOnClickListener(new android.view.View.OnClickListener({
            onClick(v: android.view.View) {
                let _owner: WeakRef<IToolbarItem>;
                _owner = new WeakRef(item);
                let owner: any = _owner.get();
                if (owner) {
                    owner._emit(ToolBarItemBase.tapEvent);
                }
            },
        }));
    }

    public nativeViewProtected: androidx.appcompat.widget.Toolbar;

    private _android: AndroidBottomBarSettings;
    private _itemMargin: number = 8;
    private _itemTopBottomMargin: number = 12;

    // default contained item style
    private _containedItemMargin: number = 16; // PENDING: need to check if it is tablet and phone dependent.
    private _containedItemBackgroundColor: string = '#0A6ED1';
    private _containedItemColor: string = '#ffffff';
    private _containedItemBorderRadius: number = 4;

    constructor() {
        super();
        this._android = new AndroidBottomBarSettings(this);
    }

    get android(): AndroidBottomBarSettings {
        return this._android;
    }

    public createNativeView() {
        return new androidx.appcompat.widget.Toolbar(this._context);
    }

    public initNativeView(): void {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;
        initializeMenuItemClickListener();
        const menuItemClickListener = new impMenuItemClickListener(this);
        nativeView.setOnMenuItemClickListener(menuItemClickListener);
        (<any> nativeView).menuItemClickListener = menuItemClickListener;
    }

    public disposeNativeView() {
        (<any> this.nativeViewProtected).menuItemClickListener.owner = null;
        super.disposeNativeView();
    }

    public onLoaded() {
        super.onLoaded();
        this.height = getToolBarHeight();
    }

    /**
     *
     * This function is called from MDKPage onLoaded().
     *
     */
    public update() {
        if (!this.nativeViewProtected) {
            return;
        }

        const page = this.page;
        if (!page.frame) { // || !page.frame._getNavBarVisible(page)) {
            this.nativeViewProtected.setVisibility(android.view.View.GONE);

            // If bottom bar is hidden - no need to fill it with items.
            return;
        }

        this.nativeViewProtected.setVisibility(android.view.View.VISIBLE);

        // apply style to toolbar
        // Set padding in px
        const paddingInPx = layout.round(layout.toDevicePixels(getToolBarPadding()));
        this.nativeViewProtected.setPadding(paddingInPx, 0, paddingInPx, 0);

        // Add menu items
        this._addToolBarItems();

        // Set home icon
        this._updateIcon();
    }

    public _onAndroidItemSelected(itemId: number): boolean {
        // Find item with the right ID;
        let menuItem: ToolBarItem = undefined;
        let items = this.barItems.getItems();
        for (let i of items) {
            if ((<ToolBarItem> i)._getItemId() === itemId) {
                menuItem = <ToolBarItem> i;
                break;
            }
        }

        if (menuItem) {
            this._tap(menuItem);
            return true;
        }

        return false;
    }

    public _updateIcon() {
        let visibility = getVisibility(this.android.iconVisibility);
        if (visibility) {
            let icon = this.android.icon;
            if (icon !== undefined) {
                let drawableOrId = getDrawableOrResourceId(icon, appResources);
                if (drawableOrId) {
                    this.nativeViewProtected.setLogo(drawableOrId);
                }
            } else {
                let defaultIcon = application.android.nativeApp.getApplicationInfo().icon;
                this.nativeViewProtected.setLogo(defaultIcon);
            }
        } else {
            this.nativeViewProtected.setLogo(null);
        }
    }

    public _addToolBarItems() {
        let menu = this.nativeViewProtected.getMenu();
        menu.clear();
        let menuItem = undefined;
        let menuItemId = undefined;
        let items = this.barItems.getVisibleItems();

        // Prepare ripple effect for toolbar item
        let activity = application.android.foregroundActivity;
        let typedValue = undefined;
        let selectedItemDrawable = undefined;
        const attr = java.lang.Class.forName('androidx.appcompat.R$attr');
        const field = attr.getField('selectableItemBackgroundBorderless') as java.lang.reflect.Field;
        if (field && activity && android.os.Build.VERSION.SDK_INT >= 23) {
            const attrs = Array.create('int', 1);
            attrs[0] = field.getInt(null);
            typedValue = activity.obtainStyledAttributes(attrs);
        }

        let currentItemIndex = -1;
        let stackLayout: StackLayout = undefined;
        let fontSizeInfo = undefined;
        let fontSizeValue = undefined;
        let fontSizeUnit = undefined;
        let labelFont = undefined;
        let showAsAction = undefined;
        let image: Image = undefined;
        let label: ToolbarLabel = undefined;
        let layoutBackground = undefined;
        let layoutOpacity = undefined;
        let layoutBorderRadius = undefined;
        let rippleColor = undefined;
        let spacingMenuItem = undefined;
        let spacingStackLayout: StackLayout = undefined;
        // Find index of last item which will be rendered in toolbar.
        let rightMostItemIndex = items.length - 1;
        currentItemIndex = items.length - 1;
        while (currentItemIndex >= 0) {
            let item = <ToolBarItem> items[currentItemIndex];
            if (this._isItemBeingRendered(item)) {
                rightMostItemIndex = currentItemIndex;
                break;
            } else {
                currentItemIndex = currentItemIndex - 1;
            }
        }

        currentItemIndex = -1;
        let itemPromises = [];
        for (let i of items) {
            currentItemIndex = currentItemIndex + 1;
            let item = <ToolBarItem> i;
            itemPromises.push(this.getImageOrLabel(item, currentItemIndex, rightMostItemIndex));
        }

        currentItemIndex = -1;
        Promise.all(itemPromises).then((toolbarItems) => {
            if (Array.isArray(toolbarItems) && toolbarItems.length > 0) {
                toolbarItems.forEach(toolbarItem => {
                    menuItem = undefined;
                    spacingMenuItem = undefined;
                    currentItemIndex = currentItemIndex + 1;

                    if (!toolbarItem) {
                        return;
                    }

                    let item = <ToolBarItem> toolbarItem.item;
                    menuItemId = item._getItemId();
        
                    // create action view
                    stackLayout = new StackLayout();
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

                        let itemStyle = item.itemStyle ? item.itemStyle : this.style;
                        let containedItemStyle = this.containedItemStyle ? this.containedItemStyle : undefined;
                        if (item.enabled === false) {
                            label.isEnabled = false;
                            // use disabled styles
                            itemStyle = this.itemDisabledStyle ? this.itemDisabledStyle : itemStyle;
                            containedItemStyle = this.containedItemDisabledStyle ?
                                this.containedItemDisabledStyle : containedItemStyle;
                        }
    
                        // set styling if provided
                        if (itemStyle) {
                            labelFont = label.style.fontInternal ? label.style.fontInternal : Font.default;
                            // Set fontSize
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
                                        } else {
                                            labelFont = labelFont.withFontSize(fontSizeValue);
                                        }
                                    }
                                }
                            }
                            // Set fontFamily
                            if (itemStyle.fontFamily) {
                                labelFont = labelFont.withFontFamily(itemStyle.fontFamily);
                            }
                            // Set fontWeight
                            if (itemStyle.fontWeight) {
                                labelFont = labelFont.withFontWeight(itemStyle.fontWeight);
                            }
                            label.style.fontInternal = labelFont;
                        }

                        // Set plugin default contained item style
                        if (item.itemType === ItemTypeAndroid.Button) {
                            layoutBorderRadius = this._containedItemBorderRadius;
                            layoutBackground = this._containedItemBackgroundColor;
                            label.style.marginLeft = this._containedItemMargin;
                            label.style.marginRight = this._containedItemMargin;
                            label.style.color = new Color(this._containedItemColor);
    
                            // Set custom contained style if any, only if type is contained
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
                        } else {
                            // Set text item font color
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
    
                        // apply item border radius to layout if any
                        if (layoutBorderRadius) {
                            stackLayout.borderRadius = layoutBorderRadius;
                        }
                        stackLayout.addChild(label);
                    }

                    if (stackLayout.getChildrenCount() >= 1 || item.width) {
                        // add to actionView
                        item.setActionView(stackLayout);
                        menuItem = menu.add(android.view.Menu.NONE, menuItemId,
                            android.view.Menu.NONE, item.text + '');
                    }

                    if (item.actionView && item.actionView.android && menuItem) {
                        // With custom bottom view, the menuitem cannot be displayed in a popup menu. 
                        item.android.position = 'actionBar';
                        menuItem.setActionView(item.actionView.android);
                        ToolBar._setOnClickListener(item);
                        if (item.enabled === false) {
                            menuItem.getActionView().setEnabled(false);
                        } else {
                            // item enabled scope
                            // Add ripple effect to item
                            if (item.clickable && typedValue !== undefined) {
                                selectedItemDrawable = typedValue.getDrawable(0);
                                if (!layoutBackground) {
                                    // set ripple to background for normal item
                                    let rippleDrawable = <android.graphics.drawable.RippleDrawable>
                                        selectedItemDrawable;
                                    if (rippleColor) {
                                        rippleDrawable.setColor(android.content.res.ColorStateList.valueOf(
                                            rippleColor));
                                    }
                                    item.actionView.android.setBackground(rippleDrawable);
                                } else {
                                    // set ripple to foreground for button item
                                    // KNOWN issue: unable to use setBackground for ripple drawable 
                                    // as it would clash with background color for button item type.
                                    // Tried setColorFilter, setBackgroundTintList all not working
                                    // Defer it to later for the fix.
                                    item.actionView.android.setForeground(selectedItemDrawable);
                                }
                            }
                        }
                        // apply item background color if any
                        // can only apply after the background of ripple effect is set
                        if (layoutBackground) {
                            item.actionView.backgroundColor = layoutBackground;
                        }
                        if (layoutOpacity) {
                            item.actionView.opacity = layoutOpacity;
                        }
                        showAsAction = getShowAsAction(item);
                        menuItem.setShowAsAction(showAsAction);
                    }

                    // Add new menuItem action view with label + width as spacing between items
                    // as the menu item actionView does not have spacing by default
                    // not applicable to last toolbar item
                    if (menuItem && currentItemIndex < rightMostItemIndex) {
                        spacingStackLayout = new StackLayout();
                        spacingStackLayout.width = this._itemMargin;
                        item.setSpacingActionView(spacingStackLayout);
                        item.spacingActionView.opacity = 0;
                        spacingMenuItem = menu.add(android.view.Menu.NONE, menuItemId + 10000,
                            android.view.Menu.NONE, '');
                        spacingMenuItem.setActionView(item.spacingActionView.android);
                        spacingMenuItem.setShowAsAction(showAsAction);
                    }
                });

            }
        });
    }

    public _onIconPropertyChanged() {
        if (this.nativeViewProtected) {
            this._updateIcon();
        }
    }

    public _addViewToNativeVisualTree(child: View, atIndex: number = Number.MAX_VALUE): boolean {
        super._addViewToNativeVisualTree(child);

        if (this.nativeViewProtected && child.nativeViewProtected) {
            if (atIndex >= this.nativeViewProtected.getChildCount()) {
                this.nativeViewProtected.addView(child.nativeViewProtected);
            } else {
                this.nativeViewProtected.addView(child.nativeViewProtected, atIndex);
            }
            return true;
        }

        return false;
    }

    public _removeViewFromNativeVisualTree(child: View): void {
        super._removeViewFromNativeVisualTree(child);

        if (this.nativeViewProtected && child.nativeViewProtected) {
            this.nativeViewProtected.removeView(child.nativeViewProtected);
        }
    }

    protected _isEmpty(): boolean {
        if ((this.android && this.android.icon) ||
            this.barItems.getItems().length > 0) {
            return false;
        }

        return true;
    }

    // This function checks whether a toolbar item will be rendered or not. 'FlexibleSpace' and 'FixedSpace' item
    // will be rendered in android only when they have a width property or a fallback image or caption.
    // BCP - 1980279955.
    private _isItemBeingRendered(item): boolean {
        if (item.systemItem) {
            let parsedSystemItem = SystemItem.parse(item.systemItem.toString(), SystemItem.systemItemColor);
            if (parsedSystemItem !== undefined ? parsedSystemItem === '' : false) {
                if (item.width > 0 || item.icon !== null || item.text !== item.name) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    private _tap(item: ToolBarItem): void {
        let _owner: WeakRef<IToolbarItem>;
        _owner = new WeakRef(item);
        let owner: any = _owner.get();
        if (owner) {
            owner._emit(ToolBarItemBase.tapEvent);
        }
    }

    private [colorProperty.getDefault](): number {
        const nativeView = this.nativeViewProtected;
        if (!defaultTitleTextColor) {
            let tv: android.widget.TextView = getAppCompatTextView(nativeView);
            if (!tv) {
                const title = nativeView.getTitle();
                // setTitle will create AppCompatTextView internally;
                nativeView.setTitle('');
                tv = getAppCompatTextView(nativeView);
                if (title) {
                    // restore title.
                    nativeView.setTitle(title);
                }
            }

            // Fallback to hardcoded falue if we don't find TextView instance...
            // using new TextView().getTextColors().getDefaultColor() returns different value: -1979711488 
            defaultTitleTextColor = tv ? tv.getTextColors().getDefaultColor() : -570425344;
        }

        return defaultTitleTextColor;
    }
    private [colorProperty.setNative](value: number | Color) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.setTitleTextColor(color);
    }

    private getImageOrLabel(item: ToolBarItem, currentItemIndex: number, rightMostItemIndex: number): Promise<any> {
        let imagePromise: Promise<any>;
        // make sure the text is always available if system icon or icon is invalid
        let labelText = item.text.toUpperCase();
        imagePromise = Promise.resolve(item);
        let image: Image = undefined;
        let label: ToolbarLabel = undefined;
        if (item.systemItem || item.android.systemIcon || item.icon) {
            let systemIcon: string = undefined;
            if (item.systemItem || item.android.systemIcon) {
                let parsedSystemItem: any = undefined;
                if (item.systemItem) {
                    parsedSystemItem = SystemItem.parse(item.systemItem.toString(), SystemItem.systemItemColor);
                }
                systemIcon = parsedSystemItem !== undefined ? parsedSystemItem :
                    item.android.systemIcon ? item.android.systemIcon :
                        undefined;
                if (systemIcon !== undefined) {
                    if (systemIcon.indexOf('res://') > -1) {
                        // Supported local resources
                        image = new Image();
                        image.src = systemIcon.toString();
                    } else if (systemIcon.indexOf('_') > -1) {
                        // Try to look in the system resources.
                        let systemResourceId = getSystemResourceId(systemIcon.toString());
                        if (systemResourceId) {
                            image = new Image();
                            image.src = getSystemResourceImageSource(systemResourceId);
                        } else {
                            systemIcon = undefined;
                        }
                    } else {
                        // if system icon returned does not contain '_', show the systemIcon text as label
                        if (item.text === item.name) { // no caption is set
                            labelText = systemIcon;
                        }
                    }
                }
            }

            if ((systemIcon === undefined || systemIcon === '') && item.icon) {
                let itemStyle = item.itemStyle;
                if (item.enabled === false && this.itemDisabledStyle && this.itemDisabledStyle.color) {
                    itemStyle = this.itemDisabledStyle;
                    if (itemStyle.color instanceof Color) {
                        // the alpha number is from 0.5 opacity (0.5 * 255 = 127.5)
                        let itemDisabledStyleColor = new Color(127.5, itemStyle.color.r, itemStyle.color.g, itemStyle.color.b);
                        itemStyle.color = itemDisabledStyleColor;
                    }
                }
                imagePromise = this.getImageSourceFromIcon(item.icon, itemStyle).then((imgSource) => {
                    if (imgSource) {
                        image = new Image();
                        image.src = imgSource;
                    } else {
                        image = undefined;
                    }
                });
            }
        }
        return imagePromise.then(() => {
            if (image !== undefined) {
                image.stretch = 'aspectFit';
                image.style.marginTop = this._itemTopBottomMargin;
                image.style.marginBottom = this._itemTopBottomMargin;
                image.style.marginLeft = this._itemMargin;
                if (currentItemIndex < rightMostItemIndex) {
                    image.style.marginRight = this._itemMargin;
                }
                image.horizontalAlignment = 'center';
                image.verticalAlignment = 'middle';
                // if toolbar item will use image, label is not needed anymore
                labelText = undefined;
                return {item, image};
            }
            // add label as child of StackLayout if labelText is set.
            if (labelText !== undefined && labelText !== '') {
                label = new ToolbarLabel();
                label.text = labelText;
                label.horizontalAlignment = 'center';
                label.verticalAlignment = 'stretch';
                label.style.marginTop = this._itemMargin;
                label.style.marginBottom = this._itemMargin;
                label.style.marginLeft = this._itemMargin;
                // As per GD 0.7sp, Android accepts only in em for letterSpacing,
                // so it is equals to 0.044em
                label.style.letterSpacing = 0.044;
                label.style.lineHeight = 15.7;
                // Skip right padding for last item in toolbar
                if (currentItemIndex < rightMostItemIndex) {
                    label.style.marginRight = this._itemMargin;
                }
                return {item, label};
            }
            return null;
        });
    }
}

function getAppCompatTextView(toolbar: androidx.appcompat.widget.Toolbar): typeof appCompatTextView {
    for (let i = 0, count = toolbar.getChildCount(); i < count; i++) {
        const child = toolbar.getChildAt(i);
        if (child instanceof appCompatTextView) {
            return child;
        }
    }

    return null;
}

// ToolBar.prototype.recycleNativeView = 'auto';

let defaultTitleTextColor: number;

function getDrawableOrResourceId(icon: string, resources: any): any {
    if (typeof icon !== 'string') {
        return undefined;
    }

    if (icon.indexOf(RESOURCE_PREFIX) === 0) {
        let resourceId: number = resources.getIdentifier(
            icon.substr(RESOURCE_PREFIX.length), 'drawable', application.android.packageName);
        if (resourceId > 0) {
            return resourceId;
        }
    } else {
        let is;
        let drawable;

        if (icon.lastIndexOf('data:image/png', 0) === 0 || icon.lastIndexOf('data:image/jpeg', 0) === 0) {
            const base64Data = icon.split(',')[1];
            if (base64Data !== undefined) {
                // decode base64 string to image
                let imageBytes = android.util.Base64.decode(base64Data, android.util.Base64.DEFAULT);
                let imageBitmap = android.graphics.BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
                drawable = new android.graphics.drawable.BitmapDrawable(
                    application.android.context.getResources(), imageBitmap);
            }
        }

        return drawable;
    }

    return undefined;
}

function getShowAsAction(menuItem: ToolBarItem): number {
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

function getVisibility(visibility: string): boolean {
    switch (visibility) {
        case 'always':
            return true;

        case 'auto':
        case 'never':
        default:
            return false;
    }
}

function getSystemResourceId(systemIcon: string): number {
    return android.content.res.Resources.getSystem().getIdentifier(systemIcon, 'drawable', 'android');
}

function getSystemResourceImageSource(systemResourceId: number): ImageSource {
    let imgSource = new ImageSource();
    let bitmapDrawable = <android.graphics.drawable.BitmapDrawable> android.content.res.Resources.
        getSystem().getDrawable(systemResourceId);
    if (bitmapDrawable && bitmapDrawable.getBitmap) {
        imgSource.android = bitmapDrawable.getBitmap();
    }
    return imgSource;
}

function getToolBarPadding() {
    // Return padding in dp
    return Device.deviceType === 'Tablet' ? 24 : 16;
}

function getToolBarHeight() {
    // Return padding in dp
    return Device.deviceType === 'Tablet' ? 52 : 48;
}

export class SystemItem extends SystemItemBase {
    public static parse(key: string, style?: string, isRTL?: boolean): any {
        if (key.indexOf('_') > 0) {
            // enable user to use android system icon directly
            return key.toLowerCase();
        } else {
            // user is using supported local resources, need to parse
            if (this.isValid(key)) {
                let value = '';
                let systemItemValue = this.systemItemEnum[key];
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
    }

    static get systemItemColor(): string {
        return application.systemAppearance() === 'light' ? 'black' : 'white';
    }

    static get systemItemEnum(): any {
        return SystemItemAndroid;
    }

    static get systemItemRTL(): any {
        return systemItemRTLAndroid;
    }
}

export class ItemType extends ItemTypeBase {
    static get itemTypeEnum(): any {
        return ItemTypeAndroid;
    }
}

/**
 * Represents Android specific options of the bottom item.
 */
export interface IAndroidBottomItemSettings {
    /**
     * Gets or sets the position of the bottom item in the bottom bar.
     *  1. actionBar - item is shown in the bottom bar.
     *  2. actionBarIfRoom - item is shown in the bottom bar 
     *      if there is room for it. Otherwise it is put in the popup menu.
     *  3. popup - item is shown in the popup menu.
     * Note: Property not applicable to NavigationButton
     */
    position: 'actionBar' | 'actionBarIfRoom' | 'popup';

    /**
     * Gets or sets the name of the system drawable resource to be displayed.
     * Use this property instead of BottomItem.icon if you want to diplsay a built-in Android system icon.
     * The value should be a string such as 'ic_menu_search' 
     * if you want to display the built-in Android Menu Search icon for example.
     * For a full list of Android drawable names, please visit http://androiddrawables.com
     */
    systemIcon: string;
}

/**
 * Represents Android specific options of the bottom bar.
 */
export interface IAndroidBottomBarSettings {

    /**
     * Gets or sets the bottom bar icon.
     */
    icon: string;

    /**
     * Gets or sets the visibility of the bottom bar icon.
     * The icon is visible by default in pre-lollipop (API level < 20) 
     * versions of android and is hidden in lollipop (API level >= 20)
     * The possible values are:
     *  1. auto - the default behavior. This is the default value.
     *  2. always - the icon is aways shown.
     *  3. never - the icon is aways hidden.
     */
    iconVisibility: string;
}

enum SystemItemAndroid {
    Action = 'outline_launch',
    Add = 'outline_add',
    Bookmarks = 'outline_bookmark',
    Camera = 'outline_camera_alt',
    Cancel = 'outline_close',
    Compose = 'outline_note_add',
    Done = 'outline_done',
    Edit = 'outline_edit',
    FastForward = 'outline_fast_forward',
    Pause = 'outline_pause',
    Play = 'outline_play_arrow',
    Refresh = 'outline_refresh',
    Reply = 'outline_reply',
    Rewind = 'outline_fast_rewind',
    Save = 'outline_save',
    Search = 'outline_search',
    Stop = 'outline_stop',
    Trash = 'outline_delete',
    Organize = 'outline_folder',
    Undo = 'outline_undo',
    Redo = 'outline_redo',
    FlexibleSpace = '',
    FixedSpace = '',
}

let systemItemRTLAndroid = [
    'Action',
    'Undo',
    'Redo',
    'Reply',
];

enum ItemTypeAndroid {
    Normal = 'normal',
    Button = 'button',
}
