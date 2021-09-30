import { messageType, write } from 'tns-core-modules/trace';
import { View } from 'tns-core-modules/ui/core/view';
import { Page } from 'tns-core-modules/ui/page/page';
import { DataConverter } from '../Common/DataConverter';
import { Util } from '../Common/Util';

declare var com: any;
declare var android: any;
declare var org: any;
declare var java: any;

export class Section {
  private _sectionBridge: any;
  public bridge(): any {
    return this._sectionBridge;
  }

  public createCallback(callback: any) {
    return new com.sap.mdk.client.ui.fiori.sections.ISectionCallback({
      footerPressed: () => {
        callback.footerTapped();
      },
      getBoundData: (row) => {
        return DataConverter.toJavaObject(callback.getBoundData(row));
      },
      getView: (row) => {
        if (row < 0) {
          return callback.getView();
        } else {
          return callback.getView(row);
        }
      },
      isDataBounded: (row) => {
        return callback.isDataBounded(row);
      },
      loadMoreItems: () => {
        callback.loadMoreItems();
      },
      onAccessoryPress: (row, view) => {
        callback.onAccessoryButtonPress(row, DataConverter.toViewFacade(view));
      },
      onPress: (row, view) => {
        callback.onPress(row, DataConverter.toViewFacade(view));
      },
      onAnalyticViewPress: () => {
        callback.onAnalyticViewPress();
      },
      onItemPress: (item) => {
        callback.onItemPress(item);
      },
      searchUpdated: (searchText) => {
        callback.searchUpdated(searchText);
      },
      updateActionBarElevation: (on) => {
        callback.updateActionBarElevation(on);
      },
      onSwipe: (cell) => {
        callback.onSwipe(DataConverter.toJavaScriptObject(cell));
      },
      getLeftKey: (row) => {
        // left key same as leading item
        let leftKeys = callback.getLeftKey(row);
        var stringArr = Array.create(java.lang.String, leftKeys.length);
        for(let i = 0; i < leftKeys.length; i++) {
          stringArr[i] = leftKeys[i];
        }
        return stringArr;
      },
      getRightKey: (row) => {
        // right key same as trailing item
        let rightKeys = callback.getRightKey(row);
        var stringArr = Array.create(java.lang.String, rightKeys.length);
        for(let i = 0; i < rightKeys.length; i++) {
          stringArr[i] = rightKeys[i];
        }
        return stringArr;
      },
      onSelectionChanged: (param: any) => {
        callback.onSelectionChanged(DataConverter.javaJsonObjectToJavascriptObject(param));
      },
      updateSectionSelectedRows: (params: any) => {
        callback.updateSectionSelectedRows(DataConverter.javaJsonObjectToJavascriptObject(params));
      },
      onSelectionModeChanged: (params: any) => {
        callback.onSelectionModeChanged(DataConverter.javaJsonObjectToJavascriptObject(params));
      }
    });
  }

  public create(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.BaseModel();
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createButtonSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ButtonSectionModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createContactTableSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ContactTableModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createExtensionSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ExtensionSectionModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createGridTableSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.GridTableModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createKeyValueSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.KeyValueModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createObjectCollectionSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ObjectCollectionModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createAnalyticCardCollectionSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.AnalyticCardCollectionModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createChartContentSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ChartContentSectionModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createObjectHeaderSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ObjectHeaderModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }
  
  public createImageCollectionSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ImageCollectionModel (
      DataConverter.toJavaObject(params),
      this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
        write(error, 'mdk.trace.ui', messageType.error);
      }
  }  

  public createProfileHeaderSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ProfileHeaderModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createObjectTableSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.ObjectTableModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createSimplePropertySection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.SimplePropertySectionModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public createKPIHeaderSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.KPIHeaderModel (
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
        write(error, 'mdk.trace.ui', messageType.error);
      }
  }

  public createKPISection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.KPISectionModel (
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
        write(error, 'mdk.trace.ui', messageType.error);
      }
  }

  public createFormCellSection(params: any, callback: any) {
    try {
      this._sectionBridge = new com.sap.mdk.client.ui.fiori.sections.models.FormCellSectionModel(
        DataConverter.toJavaObject(params),
        this.createCallback(callback));
      return this._sectionBridge;
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public setFormCellSectionItems(cellItems: any) {
    cellItems.forEach(cell => {
      this._sectionBridge.setFormCellSectionItem(cell.model);
    });
  }

  public updateCell(params: any, row: number) {
    // intentional no-op
  }

  /**
   * Calls native module to update Form Cells in FormCell Section
   */
  public updateCells(params: any) {
    this._sectionBridge.updateFormCells();
  }
  
  public redraw(data: any) {
    this._sectionBridge.redraw(DataConverter.toJavaObject(data));
  }

  public reloadData(itemCount: number) {
    this._sectionBridge.reloadData(itemCount);
  }

  public reloadRow(index: number) {
    this._sectionBridge.reloadRow(index);
  }

  public updateRow(index: number, data: any) {
    this._sectionBridge.updateRow(index, DataConverter.toJavaObject(data));
  }

  public setIndicatorState(params: any) {
    this._sectionBridge.setIndicatorState(DataConverter.toJavaObject(params));
  }

  public refreshIndicators() {
    this._sectionBridge.refreshIndicators();
  }

  public redrawLayout() {
    this._sectionBridge.redrawLayout();
  }

  public updateProgressBar(visible: boolean) {
    this._sectionBridge.updateProgressBar(visible);
  }

  public destroy() {
    this._sectionBridge.destroy();
    this._sectionBridge = undefined;
  }

  public setFocus(sectionedTable: SectionedTable, row: number, keyboardVisibility: string): void {
    if (typeof(this._sectionBridge.setFocus) !== undefined) {
      sectionedTable.setFocus(this._sectionBridge, row, keyboardVisibility);
    }
  }
  
  // Section List Picker form cell
  public hideLazyLoadingIndicator() {
    this._sectionBridge.hideLazyLoadingIndicator();
  }

  public setSelectionMode(params: any) {
    return this._sectionBridge.setSelectionMode(params.selectionMode);
  }
};

export class SectionedTable extends View {
  public nativeView: any;
  private _sections: any[] = [];
  private _containerCallback: any;

  private _sectionedTableBridge = new com.sap.mdk.client.ui.fiori.sections.views.SectionedTable();

  constructor(page: Page, containerCallback: any) {
    super();
    this._containerCallback = containerCallback;
  }

  public createNativeView(): Object {
    try {
      const nativeSections = this._sections.filter(section => section.visible === true)
        .map(section => section.nativeSection);

      return this._sectionedTableBridge.create(nativeSections, this._context, this.parent.android);
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public initNativeView(): void {
    (<any> this.nativeView).owner = this;
    super.initNativeView();
  }

  public disposeNativeView(): void {
    if (this._sections) {
      this._sections.forEach((section) => {
        section.disposeNativeSection();
      });
      this._sections = undefined;
    }
    
    this._sectionedTableBridge = undefined;
    // Remove reference from native view to this instance.
    if (this.nativeView) {
      (<any> this.nativeView).owner = null;
    }

    super.disposeNativeView();
  }

  public onLoaded() {
    super.onLoaded();
    this._containerCallback.onLoaded();
  }

  public create(sections: any[]) {
    this._sections = sections;
    return this;
  }

  public destroy() {
    // No-op
  }

  public redraw() {
    const nativeSections = this._sections.filter(section => section.visible === true)
      .map(section => section.nativeSection);
    
    this._sectionedTableBridge.redraw(nativeSections, this._context, this.parent.android);
  }

  public setFocus(nativeSection: any, row: number, keyboardVisibility: string): void {
    this._sectionedTableBridge.setFocus(nativeSection, row, Util.toSoftKeyboardType(keyboardVisibility));
  }

  public setInEmbeddedFrame(embedded: boolean) {
    // No-op
  }
};
