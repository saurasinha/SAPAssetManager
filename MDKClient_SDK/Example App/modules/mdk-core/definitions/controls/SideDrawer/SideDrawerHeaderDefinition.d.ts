import { BaseJSONDefinition } from "../../BaseJSONDefinition";
export declare class SideDrawerHeaderDefinition extends BaseJSONDefinition {
    private _icon;
    private _headline;
    private _subHeadline;
    private _action;
    private _iconIsCircular;
    private _disableIconText;
    private _target;
    private _alignment;
    constructor(path: any, data: any);
    readonly icon: string;
    readonly headline: string;
    readonly subHeadline: string;
    readonly action: string;
    readonly iconIsCircular: any;
    readonly disableIconText: any;
    readonly target: any;
    readonly alignment: string;
}
