import { BaseCollectionSectionObservable } from './BaseCollectionSectionObservable';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
export declare class AnalyticCardCollectionSectionObservable extends BaseCollectionSectionObservable {
    private static readonly ITEMS_PARAM_KEY;
    private static _objectID;
    private _data;
    private _dataReadPageSize;
    private _boundItems;
    private _resolveSectionTarget;
    onPress(row: number): Promise<any>;
    getItem(index: number): any;
    getBoundData(row: number): any;
    loadMoreItems(): void;
    bind(): Promise<any>;
    protected _resolveData(cardDefinition: any): Promise<ObservableArray<any>>;
    protected _bindRowProperties(row: number, bindingObject: any, definition: any): Promise<any>;
    private _setMaxItems;
    private _bindRow;
    private bindItems;
    private resolveDataForCard;
}
