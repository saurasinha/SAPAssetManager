export declare class Popover {
    static getInstance(): Popover;
    show(data: any): Promise<string>;
    dismiss(page: any): void;
    setPopoverAnchor(modalFrame: any, page: any, pressedItem: any): void;
}
