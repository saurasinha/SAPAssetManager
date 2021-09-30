import { BaseFormCell } from './BaseFormCell';
import { FilterFormCellObservable } from '../../observables/FilterFormCellObservable';
import { IFilterable, FilterType, FilterCriteria } from '../IFilterable';
export declare class FilterFormCell extends BaseFormCell {
    private _filterProperty;
    private _caption;
    getValue(): FilterCriteria;
    getCollection(): {
        DisplayValue: string;
        ReturnValue: string;
    }[];
    setFilterCriteria(filterable: IFilterable): Promise<any>;
    private areAllSelectedValuesPresent;
    onLoaded(): Promise<any>;
    protected getValueWithFilterType(filterType: FilterType): FilterCriteria;
    protected createObservable(): FilterFormCellObservable;
}
