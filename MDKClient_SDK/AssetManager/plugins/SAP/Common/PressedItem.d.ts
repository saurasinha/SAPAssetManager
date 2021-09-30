export declare class PressedItem {
    static WithControlView(controlView: any): PressedItem;
    static WithToolbarItem(toolbarItem: any): PressedItem;
    static WithTabItem(tabItem: any): PressedItem;
    static WithActionItem(actionItem: any): PressedItem;
    isControlView(): boolean;
    isToolbarItem(): boolean;
    isTabItem(): boolean;
    isActionItem(): boolean;
    getControlView(): any;
    getToolbarItem(): any;
    getTabItem(): any;
    getActionItem(): any;
}
