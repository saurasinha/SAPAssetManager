import { BaseControlDefinition } from './BaseControlDefinition';
import { TabItemDefinition } from './TabItemDefinition';
export declare class TabsDefinition extends BaseControlDefinition {
    private _items;
    private _styles;
    private _position;
    private _selectedIndex;
    private _swipeEnabled;
    private _visible;
    constructor(path: any, data: any, parent: any);
    getItemsCount(): number;
    getItems(): TabItemDefinition[];
    readonly styles: any;
    readonly position: string;
    readonly selectedIndex: number;
    readonly swipeEnabled: boolean;
    readonly visible: boolean;
}
