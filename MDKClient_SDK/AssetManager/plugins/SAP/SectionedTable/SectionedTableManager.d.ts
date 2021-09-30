import { Page } from 'tns-core-modules/ui/page/page';
export declare class Section {
    destroy(): void;
    create(params: any, callback: any): void;
    createButtonSection(params: any, callback: any): void;
    createContactTableSection(params: any, callback: any): void;
    createExtensionSection(params: any, callback: any): void;
    createGridTableSection(params: any, callback: any): void;
    createKeyValueSection(params: any, callback: any): void;
    createObjectCollectionSection(params: any, callback: any): void;
    createAnalyticCardCollectionSection(params: any, callback: any): void;
    createChartContentSection(params: any, callback: any): void;
    createObjectHeaderSection(params: any, callback: any): void;
    createProfileHeaderSection(params: any, callback: any): void;
    createKPIHeaderSection(params: any, callback: any): void;
    createKPISection(params: any, callback: any): void;
    createObjectTableSection(params: any, callback: any): void;
    createSimplePropertySection(params: any, callback: any): void;
    createImageCollectionSection(params: any, callback: any): void;
    createFormCellSection(params: any, callback: any): void;
    setFormCellSectionItems(cellItems: any): void;
    updateCell(params: any, row: number): void;
    updateCells(params: any): void;
    redraw(data: any): void;
    reloadData(itemCount: number): void;
    reloadRow(index: number): void;
    updateRow(index: number, data: any): void;
    setIndicatorState(params: any): void;
    setSelectionMode(params: any): void;
    updateSectionSelectionMode(mode: any): void;
    refreshIndicators(): void;
    redrawLayout(): void;
    updateProgressBar(visible: boolean): void;
    setFocus(sectionedTable: SectionedTable, row: number, keyboardVisibility: string): void;
    hideLazyLoadingIndicator(row?: number): void;
}
export declare class SectionedTable {
    protected page: Page;
    protected containerCallback: any;
    constructor(page: Page, containerCallback: any);
    create(sections: any[]): void;
    destroy(): void;
    redraw(): void;
    setSearchString(searchString: string): boolean;
    setFocus(nativeSection: any, row: number, keyboardVisibility: string): void;
    setInEmbeddedFrame(embedded: boolean): void;
}
