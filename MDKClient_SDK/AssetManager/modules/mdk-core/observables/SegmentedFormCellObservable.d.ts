import { BaseCollectionFormCellObservable } from './BaseCollectionFormCellObservable';
export declare class SegmentedFormCellObservable extends BaseCollectionFormCellObservable {
    protected readonly _DISPLAYED_ITEMS_KEY = "Segments";
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
}
