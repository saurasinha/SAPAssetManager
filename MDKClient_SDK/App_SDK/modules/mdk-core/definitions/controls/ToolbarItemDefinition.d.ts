import { BaseControlDefinition } from './BaseControlDefinition';
export declare class ToolbarItemDefinition extends BaseControlDefinition {
    private _name;
    private _systemItem;
    private _caption;
    private _image;
    private _action;
    private _enabled;
    private _visible;
    private _tag;
    private _width;
    private _clickable;
    private _itemType;
    constructor(path: string, item: any, parent: any);
    getType(): string;
    readonly name: string;
    readonly systemItem: string;
    readonly caption: string;
    readonly image: string;
    readonly action: string;
    readonly enabled: any;
    readonly visible: boolean;
    readonly width: number;
    readonly clickable: boolean;
    readonly itemType: string;
}
