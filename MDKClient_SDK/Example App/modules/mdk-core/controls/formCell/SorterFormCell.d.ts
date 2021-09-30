import { FilterFormCell } from './FilterFormCell';
import { SorterFormCellObservable } from '../../observables/SorterFormCellObservable';
import { IFilterable, FilterCriteria } from '../IFilterable';
export declare class SorterFormCell extends FilterFormCell {
    getValue(): FilterCriteria;
    setFilterCriteria(filterable: IFilterable): Promise<any>;
    protected createObservable(): SorterFormCellObservable;
}
