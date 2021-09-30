import { ToolBar } from 'toolbar-plugin';
import { ToolbarItemDefinition } from '../definitions/controls/ToolbarItemDefinition';
import { ToolbarItem } from './ToolbarItem';
import { Page } from 'tns-core-modules/ui/page';
import { ToolbarDefinition } from '../definitions/ToolbarDefinition';
import { Context } from '../context/Context';
import { BaseControl } from './BaseControl';
export declare enum ToolbarPosition {
    bottom = 1,
    top = 2
}
export declare class ToolbarContainer extends BaseControl {
    private containerContext;
    private position;
    private toolbarView;
    private containerPage;
    private containerDef;
    private _toolbarDefaultStyle;
    private _toolbarItemDisabledStyle;
    private _toolbarContainedItemStyle;
    private _toolbarContainedItemPressedStyle;
    private _toolbarContainedItemDisabledStyle;
    private toolbarItems;
    private _defaultToolBarItemStyle;
    constructor(page: Page, definition: ToolbarDefinition, containerContext: Context, isFullScreen: boolean);
    view(): ToolBar;
    getToolBarItemDefaultStyle(): any;
    setStyle(cssClassName?: string): void;
    getPosition(): ToolbarPosition;
    getToolbarItems(): Array<ToolbarItem>;
    setItemCaption(toolbarItemName: string, newCaption: string): Promise<any>;
    addToolbarItemWithName(name: string, onPressAction?: string, caption?: string, image?: string, systemItem?: string, enabled?: boolean, width?: number, clickable?: boolean, itemType?: string): Promise<any>;
    addToolbarItem(newItemDef: ToolbarItemDefinition): Promise<any>;
    addToolbarItems(newItemDefs: any): Promise<any>;
    removeToolbarItem(name: string): void;
    enableToolbarItem(name: string, enable: boolean): void;
    redraw(): void;
    private _addItemToToolbar;
    private _createToolbarItem;
}
