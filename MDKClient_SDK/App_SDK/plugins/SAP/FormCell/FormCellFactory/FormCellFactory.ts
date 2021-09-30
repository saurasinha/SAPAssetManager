export class MDKFormCellModel {
  private _model: any;

  public constructor(model: any) {
    this._model = model;
  }

  get model(): any {
    return this._model;
  }

  public update(data: any): void {
    // intentional no-op
  }

  public hideLazyLoadingIndicator(): void {
     // intentional no-op
  }
}

export class FormCellFactory {
  public static getInstance(): FormCellFactory {
    return null;
  }

  public createAttachmentFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }
  
  public createButtonFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createDateFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }
  
  public createDurationFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createExtensionFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createFilterFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createListPicker(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createNoteFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createSegmentedFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createSignatureCaptureFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }
  
  public createSimplePropertyFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createSorterFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createSwitchFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }

  public createTitleFormCell(data: any, callback: any): MDKFormCellModel {
    // intentional no-op
    return undefined;
  }
};
