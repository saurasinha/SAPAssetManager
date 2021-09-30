import { DataConverter } from '../../Common/DataConverter';
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';
import { messageType, write } from 'tns-core-modules/trace';
import * as app from 'tns-core-modules/application';

declare var com: any;
declare var java: any;

export class MDKFormCellModel {
  private _model: any;
  public constructor(model: any) {
    this._model = model;
  }

  get model(): any {
    return this._model;
  }

  public update(data: any): void {
    this._model.redraw(DataConverter.toJavaObject(data));
  }

  public hideLazyLoadingIndicator(): void {
    this._model.hideLazyLoadingIndicator();
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
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.AttachmentModel);
  }
  
  public createButtonFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.ButtonModel);
  }

  public createDateFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.DateTimeModel);
  }

  public createDurationFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.DurationModel);
  }

  public createExtensionFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.ExtensionModel);
  }

  public createFilterFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.FilterModel);
  }

  public createListPicker(data: any, callback: any): MDKFormCellModel {
    if (!!data.UsesObjectCells) {
      return this.createFormCell(data, callback, 
        com.sap.mdk.client.ui.fiori.formCell.models.ObjectCellListPickerModel);
    } else {
      return this.createFormCell(data, callback, 
        com.sap.mdk.client.ui.fiori.formCell.models.TextListPickerModel);
      }
  }

  public createNoteFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.NoteModel);
  }

  public createSegmentedFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.SegmentedModel);
  }

  public createSignatureCaptureFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.SignatureCaptureModel);
  }

  public createSimplePropertyFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.SimplePropertyModel);
  }

  public createSorterFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.SorterModel);
  }

  public createSwitchFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.SwitchModel);
  }

  public createTitleFormCell(data: any, callback: any): MDKFormCellModel {
    return this.createFormCell(data, callback, 
      com.sap.mdk.client.ui.fiori.formCell.models.TitleModel);
  }

  private createFormCell(data: any, callback: any, nativeClass: any): MDKFormCellModel {
    try {
      let nativeCallback = new com.sap.mdk.client.ui.fiori.formCell.models.IFormCellCallback ({
        getView: () => {
          return callback.getView();
        },
        loadMoreItems: () => {
          callback.loadMoreItems();
        },
        onPress: (row, view) => {
          callback.onPress(row, view);
        },
        searchUpdated: (searchText) => {
          callback.searchUpdated(searchText);
        },
        valueChanged: (value) => {
          let map: Map<String, any> = new Map<String, any>();
          map.set('Value', DataConverter.toJavaScriptValue(value));
          callback.cellValueChange(map);
        },
      });
      let model = new nativeClass(DataConverter.toJavaObject(data), nativeCallback);

      if (nativeClass === com.sap.mdk.client.ui.fiori.formCell.models.ObjectCellListPickerModel
        || nativeClass === com.sap.mdk.client.ui.fiori.formCell.models.TextListPickerModel) {
        let nativeListPickerCallback = new com.sap.mdk.client.ui.fiori.formCell.models.IListPickerFormCellCallback ({
          closeListPickerFragmentPage: () => {
            callback.androidCloseListPickerFragmentPage();
          },
          createListPickerFragmentPage: () => {
            callback.androidCreateListPickerFragmentPage(model);
          },
          getForegroundActivity: () => {
            return app.android.foregroundActivity;
          },
          getModalFrameTag: () => {
            return callback.androidGetModalFrameTag();
          },
          refreshForSelections: (value) => {
            let map: Map<String, any> = new Map<String, any>();
            map.set('Value', DataConverter.toJavaScriptValue(value));
            callback.androidRefreshForSelections(map);
          },
          updateActionViewExpandedStatus: (isActive) => {
            callback.androidUpdateActionViewExpandedStatus(isActive);
          },
        });
        model._listPickerCallback = nativeListPickerCallback;
      }
      if (nativeClass === com.sap.mdk.client.ui.fiori.formCell.models.SignatureCaptureModel) {
        let nativeSignatureCallback = new com.sap.mdk.client.ui.fiori.formCell.models.ISignatureCaptureFormCellCallback({
          getForegroundActivity: () => {
            return app.android.foregroundActivity;
          },
          getModalFrameTag: () => {
            return callback.androidGetModalFrameTag();
          },
          createSignatureCaptureFragmentPage: () => {
            callback.androidCreateSignatureFragmentPage(model);
          },
          closeSignatureCaptureFragmentPage: () => {
            callback.androidCloseSignatureFragmentPage(model);
          }
        });
        model._signatureCallback = nativeSignatureCallback;
      }

      return new MDKFormCellModel(model);
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
      throw error;
    }
  }
};
