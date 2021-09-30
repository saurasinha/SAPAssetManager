import { BaseJSONDefinition } from "../../BaseJSONDefinition";
export declare class SideDrawerSectionDefinition extends BaseJSONDefinition {
    private _caption;
    private _visible;
    private _items;
    private _preserveImageSpacing;
    private _styles;
    private _separatorEnabled;
    constructor(path: any, data: any);
    readonly caption: string;
    readonly items: any;
    visible: any;
    readonly preserveImageSpacing: any;
    readonly styles: any;
    readonly separatorEnabled: any;
    private _loadItems;
}
