import { BaseControlDefinition } from './BaseControlDefinition';
export declare class TabItemDefinition extends BaseControlDefinition {
    private _name;
    private _caption;
    private _image;
    private _pageToOpen;
    private _action;
    private _enabled;
    private _visible;
    private _resetIfPressedWhenActive;
    constructor(path: string, item: any, parent: any);
    getType(): string;
    readonly name: string;
    readonly caption: string;
    readonly image: string;
    readonly pageToOpen: string;
    readonly action: string;
    readonly enabled: any;
    readonly visible: boolean;
    readonly resetIfPressedWhenActive: boolean;
}
