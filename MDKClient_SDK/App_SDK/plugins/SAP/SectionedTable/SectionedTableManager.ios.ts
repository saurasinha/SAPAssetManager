import { messageType, write } from 'tns-core-modules/trace';
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from 'tns-core-modules/ui/page/page';
import { DataConverter } from '../Common/DataConverter';
import { ViewWrapper } from '../UI/ViewWrapper/ViewWrapper';

declare var SectionBridge: any;
declare var SectionedTableBridge: any;

class SectionCallback extends NSObject {

  // selector will be exposed so it can be called from native.
  /* tslint:disable */
  public static ObjCExposedMethods = {
    footerTapped: { params: [interop.types.void], returns: interop.types.void },
    getBoundData: { params: [NSNumber], returns: NSString },
    getView: { params: [NSNumber], returns: UIView },
    loadMoreItems: { params: [interop.types.void], returns: interop.types.void },
    onPress: { params: [NSNumber, UIView], returns: interop.types.void },
    onAccessoryButtonPress: { params: [NSNumber, UIView], returns: interop.types.void },
    onAnalyticViewPress: { params: [interop.types.void], returns: interop.types.void },
    onItemPress: { params: [NSNumber], returns: interop.types.void },
    searchUpdated: { params: [NSString], returns: interop.types.void },
    viewDidAppear: { params: [interop.types.void], returns: interop.types.void },
    setHeaderHeight: { params: [NSNumber], returns: interop.types.void },
    onSwipe: { params: [NSDictionary], returns: interop.types.void },
    updateSectionSelectedRows: { params: [NSDictionary], returns: interop.types.void },
    onSelectionChanged: { params: [NSDictionary], returns: interop.types.void },
    onSelectionModeChanged: { params: [NSDictionary], returns: interop.types.void },
  };
  /* tslint:enable */

  public static initWithCallback(callback: any): SectionCallback {
    let bridgeCallback = <SectionCallback> SectionCallback.new();
    bridgeCallback._callback = callback;
    return bridgeCallback;
  }
  private _callback: any;

  public footerTapped() {
    this._callback.footerTapped();
  }

  public getView(row: any) {
    return this._callback.getView(row);
  }

  public getBoundData(index: any): any {
    return this._callback.getBoundData(index);
  }

  public loadMoreItems() {
    this._callback.loadMoreItems();
  }

  public onPress(cell: any, view: UIView) {
    this._callback.onPress(cell, DataConverter.toViewFacade(view));
  }

  public onAccessoryButtonPress(cell: any, view: UIView) {
    this._callback.onAccessoryButtonPress(cell, DataConverter.toViewFacade(view));
  }

  public onAnalyticViewPress() {
    this._callback.onAnalyticViewPress();
  }

  public onItemPress(item: any) {
    this._callback.onItemPress(item);
  }

  public searchUpdated(searchText: any) {
    this._callback.searchUpdated(searchText);
  }

  public viewDidAppear() {
    this._callback.viewDidAppear();
  }

  public setHeaderHeight(height: any) {
    this._callback.setHeaderHeight(height);
  }

  public onSwipe(cell: any) {
    this._callback.onSwipe(DataConverter.fromNSDictToJavascriptObject(cell));
  }

  public updateSectionSelectedRows(params: any) {
    let jsparams = DataConverter.fromNSDictWithNSArrayToJavascriptObject(params);
    this._callback.updateSectionSelectedRows(jsparams);
  }

  public onSelectionChanged(params: any) {
    this._callback.onSelectionChanged(DataConverter.fromNSDictToJavascriptObject(params));
  }

  public onSelectionModeChanged(params: any) {
    this._callback.onSelectionModeChanged(DataConverter.fromNSDictToJavascriptObject(params));
  }
}

class SectionFormCellInterop extends NSObject {

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

  public static initWithCallback(callback: any): SectionFormCellInterop {
    let cellinterop = <SectionFormCellInterop> SectionFormCellInterop.new();
    cellinterop._callback = callback;
    return cellinterop;
  }
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

export class Section {
  private sectionBridge: any;
  private myCallback: SectionCallback;

  public create(params: any, callback: any) {
    this.myCallback = SectionCallback.initWithCallback(callback);
    this.sectionBridge = SectionBridge.new();
    return this.sectionBridge.createCallback(params, this.myCallback);
  }

  public createButtonSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createContactTableSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createExtensionSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createGridTableSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createKeyValueSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createObjectCollectionSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createObjectHeaderSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createAnalyticCardCollectionSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createChartContentSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createProfileHeaderSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createKPIHeaderSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createKPISection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createObjectTableSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createSimplePropertySection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createImageCollectionSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public createFormCellSection(params: any, callback: any) {
    return this.create(params, callback);
  }

  public setFormCellSectionItems(cellItems: any) {
    cellItems.forEach(cell => {
      cell.model.interop = SectionFormCellInterop.initWithCallback(cell.model.callback);
      const model: any = cell.model;
      this.sectionBridge.setFormCellSectionItemCallback(model.data, model.interop);
    });
  }

  /**
   * Calls native module to update cell data
   * 
   * @param params 
   * @param row 
   */
  public updateCell(params: any, row: number) {
    this.sectionBridge.updateCellRow(params, row);
  }

  /**
   * Calls native module to update Form Cell in FormCell Section
   * 
   * @param params {any} the array of properties of fromcell as a name-value dictionary
   */
  public updateCells(params: any) {
    this.sectionBridge.updateCells(params);
  }

  public redraw(data: any) {
    this.sectionBridge.redraw(data);
  }

  public reloadData(itemCount: number) {
    this.sectionBridge.reloadData(itemCount);
  }

  // Section List Picker form cell
  public hideLazyLoadingIndicator(row?: number) {
    this.sectionBridge.hideLazyLoadingIndicator(row);
  }

  public reloadRow(index: number) {
    this.sectionBridge.reloadRow(index);
  }

  public updateRow(index: number, data: any) {
    this.sectionBridge.updateRowData(index, data);
  }

  public setIndicatorState(params: any) {
    return this.sectionBridge.setIndicatorState({
      cell: params.pressedItem.getControlView().ios,
      row: params.row,
      state: params.state,
    });
  }

  public setSelectionMode(params: any) {
    return this.sectionBridge.setSelectionMode({
      selectionMode: params.selectionMode
    });
  }
  
  public refreshIndicators() {
    this.sectionBridge.refreshIndicators();
  }

  public redrawLayout() {
    // Intentional no-op
  }

  public updateProgressBar(visible: boolean) {
    // No-op
  }

  public destroy() {
    this.myCallback = undefined;
    this.sectionBridge = undefined;
  }

  /**
   * Calls native module to set focus to the cell
   */
  public setFocus(sectionedTable: SectionedTable, row: number, keyboardVisibility: string): void {
    this.sectionBridge.setFocus(row);
  }
};

export class SectionedTable extends View {
  private sectionedTableBridge: any;
  private _controller: any;
  private _sections: any[] = [];
  private _page;
  private _containerCallback: any;
  private _inEmbeddedFrame: boolean = false;

  constructor(page: Page, containerCallback: any) {
    super();
    this._page = page;
    this._containerCallback = containerCallback;
  }

  public createNativeView(): Object {
    try {
      const nativeSections = this._sections.filter(section => section.visible === true)
        .map(section => section.nativeSection);

      this._controller = this.sectionedTableBridge.create(nativeSections);
      this._page.ios.addChildViewController(this._controller);
      this._controller.isInEmbeddedFrame = this._inEmbeddedFrame;
      return this._controller.view;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public initNativeView(): void {
    (<any> this.nativeView).owner = this;
    super.initNativeView();
  }

  public disposeNativeView(): void {
    // Remove reference from native view to this instance.
    // BCP-1980128409: disposeNativeView was triggered twice for SectionedTable with ObjectTable on modal page,
    // hence need to add check before trigger any function.
    if (this._controller) {
      this._controller.removeFromParentViewController();
      this._controller = undefined;
    }
    this._page = undefined;
    if (this._sections) {
      this._sections.forEach((section) => {
        section.disposeNativeSection();
      });
      this._sections = undefined;
    }
    this.sectionedTableBridge = undefined;
    (<any> this.nativeView).owner = null;
    super.disposeNativeView();
  }

  public onLoaded() {
    super.onLoaded();
    this._containerCallback.onLoaded();
  }

  // BCP-1980137726
  // No need to disposeNativeView of sectionedTable in modal page when sectionedTable view is onUnloaded. 
  // disposeNativeView of sectionedTable should be handled by its control (BaseControl), managed in 
  // MDKPage's unloaded. So overrided onUnloaded function is removed.

  public create(sections: any[]) {
    this.sectionedTableBridge = SectionedTableBridge.new();
    this._sections = sections;
    return this;
  }

  public redraw() {
    const nativeSections = this._sections.filter(section => section.visible === true)
      .map(section => section.nativeSection);
    this._controller.redraw(nativeSections);
  }

  public setSearchString(searchString: string): boolean {
    return this._controller.setSearchString(searchString);
  }

  public setFocus(nativeSection: any, row: number, keyboardVisibility: string): void {
    // No-op
  }

  public setInEmbeddedFrame(embedded: boolean) {
    this._inEmbeddedFrame = embedded;
  }
};
