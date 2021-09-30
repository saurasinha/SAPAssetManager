import { ToolBarItemBase, ToolBarBase, View, SystemItemBase, ItemTypeBase } from './toolbar-plugin-common';
export * from './toolbar-plugin-common';
export declare class ToolBarItem extends ToolBarItemBase {
    private _androidPosition;
    private _itemId;
    constructor();
    get android(): IAndroidBottomItemSettings;
    set android(value: IAndroidBottomItemSettings);
    _getItemId(): any;
}
export declare class AndroidBottomBarSettings implements IAndroidBottomBarSettings {
    private _toolBar;
    private _icon;
    private _iconVisibility;
    constructor(toolBar: ToolBar);
    get icon(): string;
    set icon(value: string);
    get iconVisibility(): 'auto' | 'never' | 'always';
    set iconVisibility(value: 'auto' | 'never' | 'always');
}
export declare class NavigationButton extends ToolBarItem {
}
export declare class ToolBar extends ToolBarBase {
    private static _setOnClickListener;
    nativeViewProtected: androidx.appcompat.widget.Toolbar;
    private _android;
    private _itemMargin;
    private _itemTopBottomMargin;
    private _containedItemMargin;
    private _containedItemBackgroundColor;
    private _containedItemColor;
    private _containedItemBorderRadius;
    constructor();
    get android(): AndroidBottomBarSettings;
    createNativeView(): any;
    initNativeView(): void;
    disposeNativeView(): void;
    onLoaded(): void;
    update(): void;
    _onAndroidItemSelected(itemId: number): boolean;
    _updateIcon(): void;
    _addToolBarItems(): void;
    _onIconPropertyChanged(): void;
    _addViewToNativeVisualTree(child: View, atIndex?: number): boolean;
    _removeViewFromNativeVisualTree(child: View): void;
    protected _isEmpty(): boolean;
    private _isItemBeingRendered;
    private _tap;
    private getImageOrLabel;
}
export declare class SystemItem extends SystemItemBase {
    static parse(key: string, style?: string, isRTL?: boolean): any;
    static get systemItemColor(): string;
    static get systemItemEnum(): any;
    static get systemItemRTL(): any;
}
export declare class ItemType extends ItemTypeBase {
    static get itemTypeEnum(): any;
}
export interface IAndroidBottomItemSettings {
    position: 'actionBar' | 'actionBarIfRoom' | 'popup';
    systemIcon: string;
}
export interface IAndroidBottomBarSettings {
    icon: string;
    iconVisibility: string;
}
