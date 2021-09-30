import { DataConverter } from '../../Common/DataConverter';
import { Util } from '../../Common/Util';
import { View } from 'tns-core-modules/ui/core/view';
import { MDKFormCellModel } from '../FormCellFactory/FormCellFactory';
import { messageType, write } from 'tns-core-modules/trace';
import { Page } from 'tns-core-modules/ui/page/page';

declare var com: any;
declare var org: any;

export class FormCellContainerView extends View {
  public nativeView: any;
  private _formCellContainerBridge = new com.sap.mdk.client.ui.fiori.formCell.FormCellContainer();
  private _containerCallback: any;
  private _containerParams: org.json.JSONObject;

  constructor(page: Page, containerCallback: any, params: any) {
    super();

    if (!params.numberOfRowsInSection || !params.numberOfSections || !params.sectionNames) {
      throw new Error('FormCellContainerManager.android.createWithParams() invalid parameters');
    }

    this._containerCallback = containerCallback;
	
    this._containerParams = new org.json.JSONObject();
    this._containerParams.put('numberOfSections', params.numberOfSections);
    this._containerParams.put('numberOfRowsInSection', DataConverter.toJavaArray(params.numberOfRowsInSection));
    this._containerParams.put('sectionNames', DataConverter.toJavaArray(params.sectionNames));

    write(`Container params in createWithParams: ${this._containerParams}`, 'mdk.trace.ui', messageType.log);
  }

  public addFormCell(formCellDefinition: MDKFormCellModel) {
    if (formCellDefinition != null) {
      this._formCellContainerBridge.addFormCell(formCellDefinition.model);
    }
  }

  // This is part of {N} view lifecycle calls, therefore, its invoked by {N}
  // when the view needs to be created.
  public createNativeView(): Object {
    try {
      let parent = (this.parent.android as android.view.ViewGroup);
      write(`Container params in createNativeView: ${this._containerParams}`, 'mdk.trace.ui', messageType.log);
      return this._formCellContainerBridge.create(this._containerParams, this._context, parent);
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public disposeNativeView(): void {
    this._formCellContainerBridge = null;
    // Remove reference from native view to this instance.
    if (this.nativeView) {
      (<any> this.nativeView).owner = null;
    }

    // If you want to recycle nativeView and have modified the nativeView 
    // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
    // you have to reset it to its initial state here.
    super.disposeNativeView();
  }

  public initNativeView(): void {
    (<any> this.nativeView).owner = this;
    super.initNativeView();
  }

  public onLoaded() {
    super.onLoaded();
    this._containerCallback.onLoaded();
  }

  public updateCell(data: any, row: number, section: number) {
    // Intentional no-op
  }

  /**
   * Calls native module to update Form Cell Container
   * 
   * @param control {any} reference to the FormCellContainer
   * @param data {any} the array of properties of formcell as a name-value dictionary
   * @param style {any} NUI style class for the container
   */
  public updateCells(data: any, style: any) {
    // Redraw the whole thing until we get smarter about it
    this._formCellContainerBridge.redraw(this.nativeView, style);
  }

  public setFocus(row: number, section: number, keyboardVisibility: string): void {
    this._formCellContainerBridge.setFocus(row, section, Util.toSoftKeyboardType(keyboardVisibility));
  }

  public hideLazyLoadingIndicator(row: number, section: number) {
    // TODO
  }

  public setInEmbeddedFrame(embedded: boolean) {
    // No-op
  }
};
