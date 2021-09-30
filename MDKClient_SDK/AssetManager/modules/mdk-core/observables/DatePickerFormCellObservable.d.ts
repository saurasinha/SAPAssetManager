import { BaseFormCellObservable } from './BaseFormCellObservable';
export declare class DatePickerFormCellObservable extends BaseFormCellObservable {
    bindValue(data: any): Promise<any>;
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
    private getDefaultDate;
}
