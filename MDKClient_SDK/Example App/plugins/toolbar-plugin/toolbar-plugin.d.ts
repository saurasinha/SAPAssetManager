declare module 'toolbar-plugin' {
    import { EventData, View } from 'tns-core-modules/ui/core/view';
    import { Visibility } from 'tns-core-modules/ui/styling/style-properties';
    class ToolBar extends View {
        ios: any;
        barItems: ToolBarItems;
        barPosition: number;
        itemDisabledStyle: any;
        containedItemStyle: any;
        containedItemDisabledStyle: any;
        itemFontIconStyle: any;
        android: any;
        constructor(isFullScreen: boolean);
        update(): any;
    }
    class ToolBarItems {
        addItem(item: ToolBarItem): void;
        removeItem(item: ToolBarItem): void;
        getItems(): Array<ToolBarItem>;
        getItemAt(index: number): ToolBarItem;
    }
    class ToolBarItem extends View {
        static tapEvent: string;
        itemStyle: any;
        text: string;
        icon: string;
        visibility: Visibility;
        enabled: boolean;
        clickable: boolean;
        tag: number;
        width: number;
        systemItem: string;
        itemType: string;
        name: string;
        actionView: View;
        spacingActionView: View;
        toolBar: ToolBar;
        android: any;
        on(eventNames: string, callback: (data: EventData) => void): any;
        on(event: 'tap', callback: (args: EventData) => void): any;
    }
    class NavigationButton extends ToolBarItem {
    }
    function _setNavBarColor(navBar: any, color: any): any;
    function _setNavBarBackgroundColor(navBar: any, color: any): any;
    class SystemItem {
        static isValid(key: string): any;
        static parse(key: string, style?: string, isRTL?: boolean): any;
        private static systemItemEnum;
    }
    class ItemType {
        static isValid(key: string): any;
        static parse(key: string): any;
        private static itemTypeEnum;
    }
}
