import { IPopoverData } from './IPopoverData';
export declare class Popover {
    static getInstance(): Popover;
    private static _instance;
    private _interop;
    private constructor();
    show(data: any): Promise<IPopoverData>;
    dismiss(page: any): void;
    setPopoverAnchor(modalFrame: any, page: any, pressedItem: any): void;
    private getPressedItem;
}
