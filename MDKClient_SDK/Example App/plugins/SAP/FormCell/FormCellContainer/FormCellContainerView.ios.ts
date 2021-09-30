import { DataConverter } from '../../Common/DataConverter';
import { ErrorMessage } from '../../ErrorHandling/ErrorMessage';
import { View } from 'tns-core-modules/ui/core/view';
import { ViewWrapper } from '../../UI/ViewWrapper/ViewWrapper';
import { Page } from 'tns-core-modules/ui/page/page';
import { MDKFormCellModel } from '../FormCellFactory/FormCellFactory';

declare var FormCellContainerBridge: any;

export class FormCellInterop extends NSObject {

  public static initWithCallback(callback: any): FormCellInterop {
    let cellinterop = <FormCellInterop> FormCellInterop.new();
    cellinterop._callback = callback;
    return cellinterop;
  }

  // selector will be exposed so it can be called from native.
  /* tslint:disable */
  public static ObjCExposedMethods = {
    loadMoreItems: { params: [interop.types.void], returns: interop.types.void },
    searchUpdated: { params: [NSString], returns: interop.types.void },
    valueChangedWithParams: { params: [NSDictionary], returns: interop.types.void },
    getView: { params: [interop.types.void], returns: NSObject },
    onPress: { params: [NSNumber, UIView], returns: interop.types.void }
  };
  /* tslint:enable */

  private _callback: any;

  public loadMoreItems() {
    this._callback.loadMoreItems();
  }

  public searchUpdated(searchText: any) {
    this._callback.searchUpdated(searchText);
  }

  public valueChangedWithParams(data: NSDictionary<NSString, NSString>) {
    this._callback.cellValueChange(DataConverter.fromNSDictToMap(data));
  }

  set callback(callback: any) {
    this._callback = callback;
  }

  public getView() {
    return this._callback.control.getView ? this._callback.control.getView() : null;
  }

  public onPress(cell: any, view: UIView) {
    let viewWrapper = new ViewWrapper();
    viewWrapper.setView(view);

    if (this._callback.control.constructor.name === 'ListPickerFormCell') {
      // formcell listpicker is navigating, set the flag
      this._callback.control.page().isExternalNavigating = true;
      this._callback.loadMoreItems(true);
    } else if (this._callback.control.onPress) {
      this._callback.control.onPress(cell, DataConverter.toViewFacade(viewWrapper));
    }
  }
}

export class FormCellContainerView extends View {
  private controllerinterop: any;
  private _controller: any;
  private _page;
  private _containerCallback: any;
  private _params: any;
  private _formcells: MDKFormCellModel[] = [];
  private _inEmbeddedFrame: boolean = false;

  constructor(page: Page, containerCallback: any, params: any) {
    super();
    this._page = page;
    this._containerCallback = containerCallback;
    this._params = params;
    this.controllerinterop = FormCellContainerBridge.new();
    this._controller = this.controllerinterop.createWithParams(this._params);
  }

  public addFormCell(formcell: MDKFormCellModel) {
    if (!formcell.model.data || !formcell.model.callback) {
      throw new Error(ErrorMessage.FORMCELL_CONTAINER_MANAGER_ADD_FORM_CELL_FAILED);
    }

    this._formcells.push(formcell);
  }

  public createNativeView(): Object {
    this._controller.isInEmbeddedFrame = this._inEmbeddedFrame;
    this._page.ios.addChildViewController(this._controller);
    this._formcells.forEach(formcell => {
      formcell.model.interop = FormCellInterop.initWithCallback(formcell.model.callback);
      const model: any = formcell.model;
      this.controllerinterop.populateControllerWithParamsAndBridge(this._controller, model.data, model.interop);
    });
    
    return this._controller.view;
  }

  public disposeNativeView(): void {
    if (this._controller) {
      this._controller.removeFromParentViewController();
      this._controller = undefined;
    }
    this._page = undefined;
    if (this._formcells) {
      this._formcells.forEach(formcell => {
        formcell.model.interop = undefined;
      });
      this._formcells = undefined;
    }
    this.controllerinterop = undefined;
    (<any> this.nativeView).owner = null;
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

  /**
   * Calls native module to update cell data
   * 
   * @param params 
   * @param row 
   * @param section 
   */
  public updateCell(params: any, row: number, section: number) {
    this.controllerinterop.updateCellWithParamsRowSection(this._controller, params, row, section);
  }

  /**
   * Calls native module to update Form Cell Container
   * 
   * @param controller {any} reference to the FormCellContainer
   * @param params {any} the array of properties of fromcell as a name-value dictionary
   * @param style {any} NUI style class for the container
   */
  public updateCells(params: any, style: any) {
    if (!params) {
      throw new Error(ErrorMessage.FORMCELL_CONTAINER_MANAGER_UPDATE_CELLS_INVALID_PARAMS);
    }

    this.controllerinterop.updateCellsWithParamsAndStyle(this._controller, params, style);
  }

  /**
   * Calls native module to set focus to cell
   * 
   * @param row
   * @param section 
   */
  public setFocus(row: number, section: number, keyboardVisibility: string): void {
    this.controllerinterop.setFocusWithRowAndSection(this._controller, row, section);
  }

  /**
   * Calls native module to set add data loaded for the list picker
   * 
   * @param row
   * @param section 
   */
  public hideLazyLoadingIndicator(row: number, section: number) {
    this.controllerinterop.hideLazyLoadingIndicatorWithRowAndSection(this._controller, row, section);
  }

  public setInEmbeddedFrame(embedded: boolean) {
    this._inEmbeddedFrame = embedded;
  }
};
