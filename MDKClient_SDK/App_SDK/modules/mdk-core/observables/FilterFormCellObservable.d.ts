import { BaseCollectionFormCellObservable } from './BaseCollectionFormCellObservable';
export declare class FilterFormCellObservable extends BaseCollectionFormCellObservable {
    protected _DISPLAYED_ITEMS_KEY: string;
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
    setFilterItems(items: Array<object>): void;
    setFilterCaption(caption: string): void;
    updateCollection(items: Array<object>): Promise<any>;
    updateSelectedValues(values: any): Promise<any>;
}
