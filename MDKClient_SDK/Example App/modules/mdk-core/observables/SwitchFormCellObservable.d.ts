import { BaseFormCellObservable } from './BaseFormCellObservable';
export declare class SwitchFormCellObservable extends BaseFormCellObservable {
    cellValueChange(newValue: Map<String, any>): Promise<any>;
    getValue(): any;
}
