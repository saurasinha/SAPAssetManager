import { View } from 'tns-core-modules/ui/core/view';
import { Page } from 'tns-core-modules/ui/page/page';
import { MDKFormCellModel } from '../FormCellFactory/FormCellFactory';
export declare class FormCellInterop extends NSObject {
    static initWithCallback(callback: any): FormCellInterop;
    static ObjCExposedMethods: {
        loadMoreItems: {
            params: interop.Type<void>[];
            returns: interop.Type<void>;
        };
        searchUpdated: {
            params: (typeof NSString)[];
            returns: interop.Type<void>;
        };
        valueChangedWithParams: {
            params: (typeof NSDictionary)[];
            returns: interop.Type<void>;
        };
        getView: {
            params: interop.Type<void>[];
            returns: typeof NSObject;
        };
        onPress: {
            params: (typeof UIView | typeof NSNumber)[];
            returns: interop.Type<void>;
        };
    };
    private _callback;
    loadMoreItems(): void;
    searchUpdated(searchText: any): void;
    valueChangedWithParams(data: NSDictionary<NSString, NSString>): void;
    set callback(callback: any);
    getView(): any;
    onPress(cell: any, view: UIView): void;
}
export declare class FormCellContainerView extends View {
    private controllerinterop;
    private _controller;
    private _page;
    private _containerCallback;
    private _params;
    private _formcells;
    private _inEmbeddedFrame;
    constructor(page: Page, containerCallback: any, params: any);
    addFormCell(formcell: MDKFormCellModel): void;
    createNativeView(): Object;
    disposeNativeView(): void;
    initNativeView(): void;
    onLoaded(): void;
    updateCell(params: any, row: number, section: number): void;
    updateCells(params: any, style: any): void;
    setFocus(row: number, section: number, keyboardVisibility: string): void;
    hideLazyLoadingIndicator(row: number, section: number): void;
    setInEmbeddedFrame(embedded: boolean): void;
}
