export declare class MDKFormCellModel {
    private _model;
    constructor(model: any);
    get model(): any;
    update(data: any): void;
}
export declare class FormCellFactory {
    static getInstance(): FormCellFactory;
    private static _instance;
    private constructor();
    createAttachmentFormCell(data: any, callback: any): MDKFormCellModel;
    createButtonFormCell(data: any, callback: any): MDKFormCellModel;
    createDateFormCell(data: any, callback: any): MDKFormCellModel;
    createDurationFormCell(data: any, callback: any): MDKFormCellModel;
    createExtensionFormCell(data: any, callback: any): MDKFormCellModel;
    createFilterFormCell(data: any, callback: any): MDKFormCellModel;
    createListPicker(data: any, callback: any): MDKFormCellModel;
    createNoteFormCell(data: any, callback: any): MDKFormCellModel;
    createSegmentedFormCell(data: any, callback: any): MDKFormCellModel;
    createSignatureCaptureFormCell(data: any, callback: any): MDKFormCellModel;
    createSimplePropertyFormCell(data: any, callback: any): MDKFormCellModel;
    createSorterFormCell(data: any, callback: any): MDKFormCellModel;
    createSwitchFormCell(data: any, callback: any): MDKFormCellModel;
    createTitleFormCell(data: any, callback: any): MDKFormCellModel;
    private createFormCell;
}
