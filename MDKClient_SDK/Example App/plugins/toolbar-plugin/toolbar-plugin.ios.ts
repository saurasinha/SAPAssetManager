import { ToolBarBase, ToolBarItemBase, SystemItemBase, ItemTypeBase } from './toolbar-plugin-common';
import { ToolBarItem as IToolbarItem } from 'toolbar-plugin';
import { layout, ios, isFontIconURI } from 'tns-core-modules/utils/utils';
import { isNumber } from 'tns-core-modules/utils/types';
import { View } from 'tns-core-modules/ui/core/view';
import { Color } from 'tns-core-modules/color';
import { Font } from 'tns-core-modules/ui/styling/font';
import { screen } from 'tns-core-modules/platform';
import { ImageSource } from 'tns-core-modules/image-source';
import { ToolbarLabel } from './toolbar-label';

export class ToolBarItem extends ToolBarItemBase {
    
}
export class ToolBarPositionDelegate extends NSObject {
    /* tslint:disable */
    public static ObjCProtocols = [UIToolbarDelegate];
    /* tslint:enable */

    public static initWithPosition(position: number = UIBarPosition.Bottom): ToolBarPositionDelegate {
        let handler = <ToolBarPositionDelegate> ToolBarPositionDelegate.new();
        handler.position = position;
        return handler;
    }

    public position: number;

    public positionForBar(): number {
        return this.position;
    }
}

export class ToolBar extends ToolBarBase {

    private _ios: UIToolbar;
    private _delegate: ToolBarPositionDelegate; /* ToolBarPositioningDelegate */
    // custom css property for setting a non-translucent background color
    private _barTintColor: string;
    private _toolbarParent: UIView;
    private _isFullScreen: boolean;

    constructor(isFullScreen: boolean) {
        super();

        this._isFullScreen = isFullScreen;
        this._ios = UIToolbar.alloc().initWithFrame(CGRectZero);
        this._delegate = ToolBarPositionDelegate.initWithPosition(UIBarPosition.Any);
        this._ios.delegate = this._delegate;
        /**
         * BCP: 1980386017
         * Add an additional UIView to expand to cover the bottom of the screen
         * (around home indicator for iphone X and above only), 
         * while keeping the UIToolbar to be in the original position and size (within the safearea).
         */
        /**
         * BCP-1980450717 
         * Add an additional parameter isFullScreen to ensure that previous BCP fix
         * is not applied to partial modal and popover
         */
        if (ios.MajorVersion > 10 && this._isFullScreen) {
            this.iosOverflowSafeArea = true;
            this._toolbarParent = UIView.alloc().initWithFrame(CGRectZero);
            this._toolbarParent.addSubview(this._ios);
            this.nativeView = this._toolbarParent;

            this._ios.topAnchor.constraintEqualToAnchor(this._toolbarParent.topAnchor).active = true;
            this._ios.leftAnchor.constraintEqualToAnchor(this._toolbarParent.leftAnchor).active = true;
        } else {
            this.nativeView = this._ios;
        }   
    }

    public update() {
        let items = this.barItems.getVisibleItems();
        let currLength = items.length;

        let uiBarButtonArray = NSMutableArray.array<UIBarButtonItem>();
        let barButtonItemPromises = [];
        for (let item of items) {
            barButtonItemPromises.push(this.createBarButtonItem(item));
        }
        Promise.all(barButtonItemPromises).then((barButtonItems) => {
            if (Array.isArray(barButtonItems) && barButtonItems.length > 0) {
                barButtonItems.forEach(item => {
                    uiBarButtonArray.addObject(item);
                }); 
                if (this._ios) {
                    this.ios.setItemsAnimated(uiBarButtonArray, true);
                    // update colors explicitly - they may have to be cleared form a previous page
                    this.updateColors(this._ios);
                }
            }
        });
    }

    public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number) {

        let width = layout.getMeasureSpecSize(widthMeasureSpec);
        let widthMode = layout.getMeasureSpecMode(widthMeasureSpec);

        let height = layout.getMeasureSpecSize(heightMeasureSpec);
        let heightMode = layout.getMeasureSpecMode(heightMeasureSpec);
        let newHeight = height;

        let navBarWidth = 0;
        let navBarHeight = 0;

        if (heightMode !== layout.EXACTLY) {
            // Use ios.getter for backwards compat with iOS versions < 10
            let toolbarSize = this._ios.intrinsicContentSize;
            let scale = screen.mainScreen.scale;
            newHeight = toolbarSize.height * scale;
            heightMode = layout.EXACTLY;
        }

        let heightAndState = View.resolveSizeAndState(height, newHeight, heightMode, 0);

        // BCP: 1980386017
        // initilize the position and size of the UITtoolbar frame
        if (ios.MajorVersion > 10 && this._isFullScreen) {
            let fWidth = layout.toDeviceIndependentPixels(screen.mainScreen.widthPixels);
            let fHeight = layout.toDeviceIndependentPixels(newHeight);
            this._ios.frame = CGRectMake(this._ios.frame.origin.x, this._ios.frame.origin.y, fWidth, fHeight);
        }

        this.setMeasuredDimension(widthMeasureSpec, heightAndState);
    }

    public _shouldApplyStyleHandlers() {
        return true;
    }
    
    get ios(): UIToolbar {
        return this._ios;
    }

    public _onPositionChanged() {
        this._delegate.position = this.barPosition;
        this.ios.delegate = this._delegate;
    }

    private createBarButtonItem(item: IToolbarItem): Promise<UIBarButtonItem> {
        let tapHandler = TapToolBarItemHandlerImpl.initWithOwner(new WeakRef(item));
        // associate handler with menuItem or it will get collected by JSC.
        (<any> item).handler = tapHandler;

        let barButtonItem: UIBarButtonItem;

        if (item.systemItem !== undefined) {
            let parsedSystemItem = SystemItem.parse(item.systemItem.toString());
            if (parsedSystemItem !== undefined) {
                barButtonItem = UIBarButtonItem.alloc().initWithBarButtonSystemItemTargetAction(
                    parsedSystemItem, tapHandler, ToolBarItemBase.tapEvent);
            }
        }
        let itemImagePromise: Promise<any>;
        itemImagePromise = Promise.resolve(barButtonItem);
        if (!barButtonItem && item.icon) {
            itemImagePromise = this.getImageSourceFromIcon(item.icon, item.itemStyle).then((imgSource) => {
                if (imgSource) {
                    if (imgSource.ios) {
                        let imageRenderingMode = UIImageRenderingMode.AlwaysOriginal;
                        if (isFontIconURI(item.icon) && item.enabled !== undefined && !item.enabled) {
                            // to allow automatic overlay mask
                            imageRenderingMode = UIImageRenderingMode.Automatic;
                        }
                        let imgNew = imgSource.ios.imageWithRenderingMode(imageRenderingMode);
                        barButtonItem = UIBarButtonItem.alloc().initWithImageStyleTargetAction(
                        imgNew, UIBarButtonItemStyle.Plain, tapHandler, ToolBarItemBase.tapEvent);
                        return barButtonItem;
                    } 
                } 
            });
        }

        /*
        In case of wrong URL or unsupported image type, the contents of item.text would be displayed in the toolar 
        which is derived from the "_Name" attribute of the toolbar item.
        */

        return itemImagePromise.then((resolvedBarButtonItem) => {
            if (!resolvedBarButtonItem) {
                resolvedBarButtonItem = UIBarButtonItem.alloc().initWithTitleStyleTargetAction(
                    item.text + '', UIBarButtonItemStyle.Plain, tapHandler, ToolBarItemBase.tapEvent);
                
                // if the item itself has style, use that instead of the global one
                let itemStyle = item.itemStyle ? item.itemStyle : this.style;

                if (itemStyle) {
                    let customFont = Font.default;
                    
                    let fontSize = itemStyle.fontSize;
                    if (!fontSize) {
                        fontSize = 18;
                    }
                    customFont = customFont.withFontSize(fontSize);
                    
                    let fontFamily = itemStyle.fontFamily;
                    if (fontFamily) {
                        customFont = customFont.withFontFamily(fontFamily);
                    }

                    let fontWeight = itemStyle.fontWeight;
                    if (fontWeight) {
                        customFont = customFont.withFontWeight(fontWeight);
                    }

                    let attributes = NSMutableDictionary.alloc<string, any>();
                    attributes[NSFontAttributeName] = customFont.getUIFont(UIFont.systemFontOfSize(18));

                    let fontColor = itemStyle.color;
                    if (fontColor) {
                        attributes[UITextAttributeTextColor] = fontColor.ios;
                    }

                    if (item.isUserInteractionEnabled !== undefined && !item.isUserInteractionEnabled) {
                        resolvedBarButtonItem.setTitleTextAttributesForState(attributes, UIControlState.Disabled);
                    }
                    
                    if (item.enabled !== undefined && !item.enabled) {
                        attributes[UITextAttributeTextColor] = UIColor.lightGrayColor;
                        resolvedBarButtonItem.setTitleTextAttributesForState(attributes, UIControlState.Disabled);
                    } else {
                        resolvedBarButtonItem.setTitleTextAttributesForState(attributes, UIControlState.Normal);
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
    }

    private updateColors(toolbar: UIToolbar) {
        let color = this.color;
        if (color) {
            toolbar.tintColor = color.ios;
        } else {
            toolbar.tintColor = null;
        } 

        // bartintcolor is applyed as a non-translucent color
        if (this._barTintColor) {
            toolbar.translucent = false;
            let tintColor = new Color(this._barTintColor);
            toolbar.barTintColor = tintColor.ios;
        }
    }

    public get bartintcolor(): string{
        return this._barTintColor;
    }
      
    public set bartintcolor(value: string) {
        this._barTintColor = value;
    }
}

export class SystemItem extends SystemItemBase {
    static get systemItemEnum(): any {
        return SystemItemIOS;
    }
}

export class ItemType extends ItemTypeBase {
}

class TapToolBarItemHandlerImpl extends NSObject {
    /* tslint:disable */
    public static ObjCExposedMethods = {
        "tap": { returns: interop.types.void, params: [interop.types.id] },
    };
    /* tslint:enable */
    public static initWithOwner(owner: WeakRef<IToolbarItem>): TapToolBarItemHandlerImpl {
        let handler = <TapToolBarItemHandlerImpl> TapToolBarItemHandlerImpl.new();
        handler._owner = owner;
        return handler;
    }

    private _owner: WeakRef<IToolbarItem>;

    public tap(args) {
        let owner: any = this._owner.get();
        if (owner) {
            owner._emit(ToolBarItemBase.tapEvent);
        }
    }
}

/**
 * Represents iOS specific options of the action item.
 */
interface IOSToolBarItemSettings {
    /* tslint:disable */
    /**
     * Gets or sets a number representing the iOS system item to be displayed.
     * Use this property instead of ActionItem.icon if you want to diplsay a built-in iOS system icon.
     * Note: Property not applicable to NavigationButton
     * The value should be a number from the UIBarButtonSystemItem enumeration
     * (https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIBarButtonItem_Class/#//apple_ref/c/tdef/UIBarButtonSystemItem)
     *  0: Done
     *  1: Cancel
     *  2: Edit
     *  3: Save
     *  4: Add
     *  5: FlexibleSpace
     *  6: FixedSpace
     *  7: Compose
     *  8: Reply
     *  9: Action
     * 10: Organize
     * 11: Bookmarks
     * 12: Search
     * 13: Refresh
     * 14: Stop
     * 15: Camera
     * 16: Trash
     * 17: Play
     * 18: Pause
     * 19: Rewind
     * 20: FastForward
     * 21: Undo
     * 22: Redo
     * 23: PageCurl
     */
    intValue: number;
    /* tslint:enable */
}

/**
 * Defines system-supplied images for bar button items only for iOS platform.
 */
enum SystemItemIOS {
    Done = 0,
    Cancel = 1, 
    Edit = 2,
    Save = 3,
    Add = 4,
    FlexibleSpace = 5,
    FixedSpace = 6,
    Compose = 7,
    Reply = 8,
    Action = 9,
    Organize = 10,
    Bookmarks = 11,
    Search = 12,
    Refresh = 13, 
    Stop = 14,
    Camera = 15,
    Trash = 16,
    Play = 17, 
    Pause = 18,
    Rewind = 19,
    FastForward = 20,
    Undo = 21,
    Redo = 22,
    /* include Android's code */
    /* no need to include Android drawable code anymore
    ic_menu_share = 9,
    ic_menu_add = 4,
    ic_menu_star = 11,
    ic_menu_camera = 15,
    ic_menu_close_clear_cancel = 1,
    ic_menu_save = 3,
    ic_menu_edit = 2,
    ic_media_ff = 20,
    ic_media_pause = 18,
    ic_media_play = 17,
    ic_popup_sync = 13,
    ic_menu_reply = 8,
    ic_media_rew = 19,
    ic_menu_search = 12,
    ic_menu_delete = 16,
    ic_menu_archive = 10,
    ic_menu_revert = 21,
    ic_menu_redo = 22,
    ic_menu_done = 0,
    ic_menu_compose = 7,
    ic_menu_refresh = 13,
    ic_media_stop = 14,
    */
}
