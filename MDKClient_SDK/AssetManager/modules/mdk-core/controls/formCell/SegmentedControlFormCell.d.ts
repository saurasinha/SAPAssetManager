import { BaseFormCell } from './BaseFormCell';
import { SegmentedFormCellObservable } from '../../observables/SegmentedFormCellObservable';
export declare class SegmentedControlFormCell extends BaseFormCell {
    getValue(): any;
    getCollection(): {
        DisplayValue: string;
        ReturnValue: string;
    }[];
    protected createObservable(): SegmentedFormCellObservable;
}
