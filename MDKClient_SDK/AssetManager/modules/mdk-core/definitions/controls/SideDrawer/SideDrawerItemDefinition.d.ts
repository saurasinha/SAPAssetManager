import { BaseJSONDefinition } from "../../BaseJSONDefinition";
export declare class SideDrawerItemDefinition extends BaseJSONDefinition {
    private _title;
    private _image;
    private _action;
    private _pageToOpen;
    private _resetIfPressedWhenActive;
    private _visible;
    private _styles;
    private _textAlignment;
    constructor(path: any, data: any);
    title: string;
    readonly image: string;
    readonly action: string;
    readonly pageToOpen: string;
    readonly resetIfPressedWhenActive: any;
    visible: any;
    readonly styles: any;
    readonly textAlignment: any;
}
