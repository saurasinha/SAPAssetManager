import { Page } from 'tns-core-modules/ui/page/page';
import { MDKFormCellModel } from '../FormCellFactory/FormCellFactory';
export declare class FormCellContainerView {
    protected page: Page;
    protected containerCallback: any;
    protected params: any;
    constructor(page: Page, containerCallback: any, params: any);
    addFormCell(model: MDKFormCellModel): void;
    createNativeView(): Object;
    disposeNativeView(): void;
    initNativeView(): void;
    updateCell(params: any, row: number, section: number): void;
    updateCells(params: any, style: any): void;
    setFocus(row: number, section: number, keyboardVisibility: string): void;
    hideLazyLoadingIndicator(row: number, section: number): void;
    setInEmbeddedFrame(embedded: boolean): void;
}
