import { ToolBar as ToolBarDefinition, ToolBarItems as ToolBarItemsDefinition, ToolBarItem as ToolBarItemDefinition, SystemItem as SystemItemDefinition, ItemType as ItemTypeDefinition } from 'toolbar-plugin';
import { Visibility } from 'tns-core-modules/ui/styling/style-properties';
import { View, ViewBase } from 'tns-core-modules/ui/core/view';
import { ImageSource } from 'tns-core-modules/image-source';
export * from 'tns-core-modules/ui/core/view';
export declare class ToolBarBase extends View implements ToolBarDefinition {
    ios: any;
    barPosition: number;
    private _toolbarItems;
    private _itemDisabledStyle;
    private _containedItemStyle;
    private _containedItemDisabledStyle;
    private _itemFontIconStyle;
    private _iconFontSize;
    get barItems(): ToolBarItems;
    set barItems(value: ToolBarItems);
    get itemDisabledStyle(): any;
    set itemDisabledStyle(style: any);
    get containedItemStyle(): any;
    set containedItemStyle(style: any);
    get containedItemDisabledStyle(): any;
    set containedItemDisabledStyle(style: any);
    get itemFontIconStyle(): any;
    set itemFontIconStyle(style: any);
    get _childrenCount(): number;
    get android(): any;
    constructor();
    update(): void;
    _onPositionChanged(): void;
    eachChild(callback: (child: ViewBase) => boolean): void;
    protected _isEmpty(): boolean;
    protected getImageSourceFromIcon(icon: string, style?: any): Promise<ImageSource>;
    private resizeAndSaveImageSourceToFile;
    private resizeImage;
    private returnFileName;
}
export declare class ToolBarItems implements ToolBarItemsDefinition {
    private _items;
    private _toolBar;
    constructor(toolBar: ToolBarDefinition);
    addItem(item: ToolBarItemDefinition): void;
    removeItem(item: ToolBarItemDefinition): void;
    getItems(): Array<ToolBarItemDefinition>;
    getVisibleItems(): Array<ToolBarItemDefinition>;
    getItemAt(index: number): ToolBarItemDefinition;
    setItems(items: Array<ToolBarItemDefinition>): void;
}
export declare class ToolBarItemBase extends View implements ToolBarItemDefinition {
    static tapEvent: string;
    android: any;
    _toolBar: ToolBarDefinition;
    text: string;
    itemStyle: any;
    icon: string;
    visibility: Visibility;
    enabled: boolean;
    clickable: boolean;
    tag: number;
    width: number;
    systemItem: string;
    itemType: string;
    name: string;
    private _actionView;
    private _spacingActionView;
    get actionView(): View;
    set actionView(value: View);
    get spacingActionView(): View;
    set spacingActionView(value: View);
    get toolBar(): ToolBarDefinition;
    set toolBar(value: ToolBarDefinition);
    onLoaded(): void;
    _addChildFromBuilder(name: string, value: any): void;
    eachChild(callback: (child: ViewBase) => boolean): void;
    setActionView(value: View): void;
    setSpacingActionView(value: View): void;
}
export declare function isVisible(item: ToolBarItemDefinition): boolean;
export declare class SystemItemBase implements SystemItemDefinition {
    static isValid(key: string): Boolean;
    static parse(key: string, style?: string): any;
    static get systemItemEnum(): any;
}
export declare class ItemTypeBase implements ItemTypeDefinition {
    static isValid(key: string): Boolean;
    static parse(key: string): any;
    static get itemTypeEnum(): any;
}
