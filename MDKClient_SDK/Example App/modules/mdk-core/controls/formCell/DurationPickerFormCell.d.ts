import { BaseFormCell } from './BaseFormCell';
export declare class DurationPickerFormCell extends BaseFormCell {
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
    getValue(): number;
}
