import { View } from 'tns-core-modules/ui/core/view';
import { MDKFormCellModel } from '../FormCellFactory/FormCellFactory';
import { Page } from 'tns-core-modules/ui/page/page';
export declare class FormCellContainerView extends View {
    nativeView: any;
    private _formCellContainerBridge;
    private _containerCallback;
    private _containerParams;
    constructor(page: Page, containerCallback: any, params: any);
    addFormCell(formCellDefinition: MDKFormCellModel): void;
    createNativeView(): Object;
    disposeNativeView(): void;
    initNativeView(): void;
    onLoaded(): void;
    updateCell(data: any, row: number, section: number): void;
    updateCells(data: any, style: any): void;
    setFocus(row: number, section: number, keyboardVisibility: string): void;
    hideLazyLoadingIndicator(row: number, section: number): void;
    setInEmbeddedFrame(embedded: boolean): void;
}
