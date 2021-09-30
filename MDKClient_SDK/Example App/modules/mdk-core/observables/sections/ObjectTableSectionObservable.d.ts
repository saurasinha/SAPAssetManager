import { BaseTableSectionObservable } from './BaseTableSectionObservable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { ExecuteSource } from '../../common/ExecuteSource';
export declare class ObjectTableSectionObservable extends BaseTableSectionObservable {
    private static _itemsParamKey;
    private static _objectID;
    searchUpdated(searchText: string): Promise<any>;
    protected _bindRowProperties(row: number, bindingObject: any, definition: any): Promise<any>;
    protected _createStaticCellsData(): Promise<ObservableArray<any>>;
    protected _definitionUsesStaticCells(): boolean;
    protected _getRowOnPressAction(row: number, action: string, source: ExecuteSource): string;
    protected _getSearchKeys(): string[];
    protected _filterCells(items: Array<Object>): Array<Object>;
}
