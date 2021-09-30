import { ToolBarBase, ToolBarItemBase, SystemItemBase, ItemTypeBase } from './toolbar-plugin-common';
export declare class ToolBarItem extends ToolBarItemBase {
}
export declare class ToolBarPositionDelegate extends NSObject {
    static ObjCProtocols: {
        prototype: UIToolbarDelegate;
    }[];
    static initWithPosition(position?: number): ToolBarPositionDelegate;
    position: number;
    positionForBar(): number;
}
export declare class ToolBar extends ToolBarBase {
    private _ios;
    private _delegate;
    private _barTintColor;
    private _toolbarParent;
    private _isFullScreen;
    constructor(isFullScreen: boolean);
    update(): void;
    onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
    _shouldApplyStyleHandlers(): boolean;
    get ios(): UIToolbar;
    _onPositionChanged(): void;
    private createBarButtonItem;
    private updateColors;
    get bartintcolor(): string;
    set bartintcolor(value: string);
}
export declare class SystemItem extends SystemItemBase {
    static get systemItemEnum(): any;
}
export declare class ItemType extends ItemTypeBase {
}
