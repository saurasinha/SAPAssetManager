import { Page } from 'tns-core-modules/ui/page/page';

export class Section {
  public destroy() {
    // No-op
  }

  public create(params: any, callback: any) {
    // No-op
  }

  public createButtonSection(params: any, callback: any) {
    // No-op
  }

  public createContactTableSection(params: any, callback: any) {
    // No-op
  }

  public createExtensionSection(params: any, callback: any) {
    // No-op
  }

  public createGridTableSection(params: any, callback: any) {
    // No-op
  }

  public createKeyValueSection(params: any, callback: any) {
    // No-op
  }

  public createObjectCollectionSection(params: any, callback: any) {
    // No-op
  }

  public createAnalyticCardCollectionSection(params: any, callback: any) {
    // No-op
  }

  public createChartContentSection(params: any, callback: any) {
    // No-op
  }
  
  public createObjectHeaderSection(params: any, callback: any) {
    // No-op
  }

  public createProfileHeaderSection(params: any, callback: any) {
    // No-op
  }

  public createKPIHeaderSection(params: any, callback: any) {
    // No-op
  }

  public createKPISection(params: any, callback: any) {
    // No-op
  }
  
  public createObjectTableSection(params: any, callback: any) {
    // No-op
  }

  public createSimplePropertySection(params: any, callback: any) {
    // No-op
  }

  public createImageCollectionSection(params: any, callback: any) {  
    // No-op
  };

  public createFormCellSection(params: any, callback: any) {
    // No-op
  }

  public setFormCellSectionItems(cellItems: any) {
    // No-op
  }

  public updateCell(params: any, row: number) {
    // No-op
  }

  public updateCells(params: any) {
    // No-op
  }

  public redraw(data: any) {
    //
  }

  public reloadData(itemCount: number) {
    //
  }

  public reloadRow(index: number) {
    //
  }

  public updateRow(index: number, data: any) {
    //
  }

  public setIndicatorState(params: any) {
    //
  }

  public setSelectionMode(params: any) {
    //
  }

  public updateSectionSelectionMode(mode: any) {
    //
  }

  public refreshIndicators() {
    //
  }

  public redrawLayout() {
    //
  }

  public updateProgressBar(visible: boolean) {
    //
  }

  public setFocus(sectionedTable: SectionedTable, row: number, keyboardVisibility: string): void {
    // No-op
  }
  
  public hideLazyLoadingIndicator(row?: number) {
    // No-op
  }
};

export class SectionedTable {

  protected page: Page;
  protected containerCallback: any;

  constructor(page: Page, containerCallback: any) {
    this.page = page;
    this.containerCallback = containerCallback;
  }

  public create(sections: any[]) {
    //
  }
  public destroy() {
    //
  }

  public redraw() {
    //
  }

  public setSearchString(searchString: string): boolean {
    return false;
  }

  public setFocus(nativeSection: any, row: number, keyboardVisibility: string): void {
    // No-op
  }

  public setInEmbeddedFrame(embedded: boolean) {
    // No-op
  }
};
