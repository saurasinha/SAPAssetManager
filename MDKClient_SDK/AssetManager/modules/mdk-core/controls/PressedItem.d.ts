import { PressedItem as PressedItemBase } from 'mdk-sap';
export declare class PressedItem extends PressedItemBase {
    private _controlView;
    private _toolbarItem;
    private _tabItem;
    private _actionItem;
    static WithControlView(controlView: any): PressedItem;
    static WithToolbarItem(toolbarItem: any): PressedItem;
    static WithTabItem(tabItem: any): PressedItem;
    static WithActionItem(actionItem: any): PressedItem;
    private constructor();
    isControlView(): boolean;
    isToolbarItem(): boolean;
    isTabItem(): boolean;
    isActionItem(): boolean;
    getControlView(): any;
    getToolbarItem(): any;
    getTabItem(): any;
    getActionItem(): any;
}
