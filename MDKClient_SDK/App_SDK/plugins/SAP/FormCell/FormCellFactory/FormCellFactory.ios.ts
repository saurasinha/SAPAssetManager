
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';

export class MDKFormCellModel {

  private _model: any;

  public constructor(model: any) {
    this._model = model;
  }

  get model(): any {
    return this._model;
  }

  public update(data: any): void {
    this._model.data = data;
  }
}

export class FormCellFactory {
  public static getInstance(): FormCellFactory {
    return FormCellFactory._instance;
  }

  private static _instance: FormCellFactory = new FormCellFactory();

  private constructor() {
    if (FormCellFactory._instance) {
      throw new Error(ErrorMessage.FORM_CELL_FACTORY_INSTANTIATION_FAILED);
    }
    FormCellFactory._instance = this;
  }

  public createAttachmentFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }
  
  public createButtonFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createDateFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createDurationFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createExtensionFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createFilterFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createListPicker(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createNoteFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createSegmentedFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createSignatureCaptureFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createSimplePropertyFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createSorterFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createSwitchFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  public createTitleFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback);
  }

  private createFormCell(data: any, callback: any): MDKFormCellModel {
    return new MDKFormCellModel({data, callback});
  }
};
