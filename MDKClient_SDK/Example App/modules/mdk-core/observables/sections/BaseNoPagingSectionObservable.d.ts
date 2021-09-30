import { BaseCollectionSectionObservable } from './BaseCollectionSectionObservable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
export declare abstract class BaseNoPagingSectionObservable extends BaseCollectionSectionObservable {
    protected _data: ObservableArray<any>;
    protected _objectID: string;
    protected _itemsParamKey: string;
    readonly binding: any;
    bind(): Promise<Object>;
    getData(): any;
    getItem(row: number): any;
    onPress(cell: any): Promise<any>;
    protected abstract readonly genericCellPropertyName: any;
    protected abstract _keyToItemKey(key: string): string;
    protected abstract readonly genericSectionDefinitionClass: any;
    protected abstract readonly genericCellAggregationPropertyName: any;
    protected isSectionEmpty(): boolean;
    protected _bindRow(row: number, bindingObject: any, definition: any): Promise<any>;
    protected _definitionForRow(row: number): any;
    protected _resolveData(definition: any): Promise<any>;
    protected _setMaxItemCount(): void;
}
