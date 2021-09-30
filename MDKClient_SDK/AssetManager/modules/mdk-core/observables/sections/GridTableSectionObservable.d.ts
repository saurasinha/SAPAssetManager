import { BaseTableSectionObservable } from './BaseTableSectionObservable';
import { IGridRowData } from '../../builders/sections/GridRowData';
import { ExecuteSource } from '../../common/ExecuteSource';
export declare class GridTableSectionObservable extends BaseTableSectionObservable {
    private static _headerGridParamKey;
    private static _gridImageKey;
    protected _bindRowProperties(row: number, bindingObject: any, definition: any): Promise<IGridRowData>;
    protected _bindValues(bindingObject: any, definition: any): Promise<any>;
    protected _definitionUsesStaticCells(): boolean;
    protected _getRowOnPressAction(row: number, action: string, source: ExecuteSource): string;
    protected _getSearchKeys(): any[];
    private _bindGridRow;
}
