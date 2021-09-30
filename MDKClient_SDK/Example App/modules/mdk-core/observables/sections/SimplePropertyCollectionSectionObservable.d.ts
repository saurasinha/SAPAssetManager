import { BaseNoPagingSectionObservable } from './BaseNoPagingSectionObservable';
import { SimplePropertyCollectionSectionDefinition } from '../../definitions/sections/SimplePropertyCollectionSectionDefinition';
export declare class SimplePropertyCollectionSectionObservable extends BaseNoPagingSectionObservable {
    private _accessoryTypeParamKey;
    private _keyNameParamKey;
    private _valueParamKey;
    private _stylesKey;
    protected readonly genericCellAggregationPropertyName: string;
    protected readonly genericCellPropertyName: string;
    protected readonly genericSectionDefinitionClass: typeof SimplePropertyCollectionSectionDefinition;
    protected _bindRow(row: number, bindingObject: any, definition: any): Promise<any>;
    protected _keyToItemKey(key: string): string;
    protected _setMaxItemCount(): void;
    protected _filterCells(items: Array<Object>): Array<Object>;
}
