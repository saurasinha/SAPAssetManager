declare module 'toolbar-plugin' {
    import { EventData, View } from 'tns-core-modules/ui/core/view';
    import { Visibility } from 'tns-core-modules/ui/styling/style-properties';

    /**
     * Provides an abstraction over the ToolBar (iOS).
     */
    export class ToolBar extends View {

        /**
         * Gets the native [UIToolbar] that represents the user interface of this component.
         * Valid only when running on iOS.
         */
        public ios: any /* UIToolbar */;

        /**
         * Gets the collection of tool bar items.
         */
        public barItems: ToolBarItems;
        /* tslint:disable */
        /**
         * Gets or sets the barPosition
         * https://developer.apple.com/library/prerelease/ios/documentation/UIKit/Reference/UIBarPositioning_Protocol/index.html#//apple_ref/doc/c_ref/UIBarPosition
         * UIBarPositionAny = 0,
         * UIBarPositionBottom = 1,
         * UIBarPositionTop = 2,
         * UIBarPositionTopAttached = 3,
         */
        public barPosition: number;
        /* tslint:enable */

        /**
         * Represents the toolbar item's style
         */
        public itemDisabledStyle: any;

        /**
         * Represents the toolbar contained item's style
         */
        public containedItemStyle: any;

        /**
         * Represents the toolbar contained item's style
         */
        public containedItemDisabledStyle: any;

        /**
         * Represents the toolbar item's font icon style
         */
        itemFontIconStyle: any;

        /**
         * Gets the android specific options of the bottom bar.
         */
        public android: any; /* IAndroidBottomBarSettings */

        constructor(isFullScreen: boolean);
        
        /**
         * Updates the tool bar.
         */
        public update();
    }

    /**
     * Represents a collection of ToolBarItems.
     */
    export class ToolBarItems {
        /**
         * Adds an item to the collection.
         * @param item - the item to be added
         */
        public addItem(item: ToolBarItem): void;
        
        /**
         * Removes an item to the collection.
         * @param item - The item to be removed.
         */
        public removeItem(item: ToolBarItem): void;
        
        /**
         * Gets an array of the current toolbar items in the collection.
         */
        public getItems(): Array<ToolBarItem>;
        
        /**
         * Gets an item at a specified index.
         * @param index - The index.
         */
        public getItemAt(index: number): ToolBarItem;
    }

    export class ToolBarItem extends View {
        /**
         * String value used when hooking to tap event.
         */
        public static tapEvent: string;

        /**
         * Represents the toolbar item's style
         */
        public itemStyle: any;

        /**
         * Gets or sets the text of the toolbar item.
         */
        public text: string;
        
        /**
         * Gets or sets the icon of the toolbar item.
         */
        public icon: string;

        /**
         * Gets or sets the visibility of the toolbar item.
         */
        public visibility: Visibility;

        /**
         * Gets or sets the enabled of the toolbar item.
         */
        public enabled: boolean;

        /**
         * Gets or sets the clickable of the toolbar item.
         */
        public clickable: boolean;

        /**
         * Gets or sets the tag of the toolbar item.
         */
        public tag: number;

        /**
         * Gets or sets the width of the toolbar item.
         */
        public width: number;
        
        /**
         * Gets the system item of the toolbar item.
         */
        public systemItem: string;

        /**
         * Gets or sets the type of the toolbar item
         */
        public itemType: string;

        /**
         * Gets or sets the name from the ToolbarItemDefinition
         */
        public name: string;

        /**
         * Gets or sets the custom bottom view of the bottom item.
         */
        public actionView: View;

        /**
         * Gets or sets the custom bottom view for spacing of the bottom item.
         */
        public spacingActionView: View;

        /**
         * Gets the action bar that contains the action item.
         */
        public toolBar: ToolBar;

        /**
         * Gets the Android specific options of the bottom item.
         */
        public android: any; /* IAndroidBottomItemSettings */
        
        /**
         * A basic method signature to hook an event listener (shortcut alias to the addEventListener method).
         * @param eventNames - String corresponding to events (e.g. "propertyChange").
         *                     Optionally could be used more events separated by `,`
         *                     (e.g. "propertyChange", "change"). 
         * @param callback - Callback function which will be executed when event is raised.
         * @param thisArg - An optional parameter which will be used as `this` context for callback execution.
         */
        public on(eventNames: string, callback: (data: EventData) => void);

        /**
         * Raised when a tap event occurs.
         */
        public on(event: 'tap', callback: (args: EventData) => void);
    }

    /**
     * Represents the navigation (a.k.a. "back") button.
     */
    export class NavigationButton extends ToolBarItem {

    }

    /** @internal */
    export function _setNavBarColor(navBar: any /* UINavigationBar */, color: any /* UIColor */);
    /** @internal */
    export function _setNavBarBackgroundColor(navBar: any /* UINavigationBar */, color: any /* UIColor */);

    /**
     * Provides an abstraction over the customised platform specific SystemItem enum
     */
    export class SystemItem {
        /**
         * Check validity of a key towards platform specific system item enum.
         */
        public static isValid(key: string);

        /**
         * Parse given key towards platform specific system item enum.
         */
        public static parse(key: string, style?: string, isRTL ?: boolean);

        /**
         * Returns platform specific system item enum
         */
        private static systemItemEnum: any;
    }

     /**
      * Provides an abstraction over the customised platform specific ItemType enum
      */
    export class ItemType {
        /**
         * Check validity of a key towards platform specific item type enum.
         */
        public static isValid(key: string);

        /**
         * Parse given key towards platform specific item type enum.
         */
        public static parse(key: string);

        /**
         * Returns platform specific item type enum
         */
        private static itemTypeEnum: any;
    }
}
