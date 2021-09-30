import { BaseTableSectionObservable } from '../sections/BaseTableSectionObservable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { ExecuteSource } from '../../common/ExecuteSource';
export declare class ContactCellSectionObservable extends BaseTableSectionObservable {
    private static _objectID;
    private static _descriptionKey;
    private static _detailImageKey;
    private static _headlineKey;
    private static _subheadlineKey;
    private static _activityItemsKey;
    private static _avKey;
    private static _accessoryTypeKey;
    private static _contextMenuKey;
    protected _resolveData(definition: any): Promise<ObservableArray<any>>;
    protected _createStaticCellsData(): Promise<ObservableArray<any>>;
    protected _definitionUsesStaticCells(): boolean;
    protected _getRowOnPressAction(row: number, action: string, source: ExecuteSource): string;
    protected _getSearchKeys(): string[];
    protected _bindRowProperties(row: number, bindingObject: any, definition: any): Promise<any>;
    protected _filterCells(items: Array<Object>): Array<Object>;
    private _keyToCellKey;
    private _findSearchKeysFromValues;
}
