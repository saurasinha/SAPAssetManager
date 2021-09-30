import { BaseFormCellObservable } from './BaseFormCellObservable';
export declare class ExtensionFormCellObservable extends BaseFormCellObservable {
    private _binding;
    readonly binding: any;
    bind(): Promise<void>;
    getValue(): any;
    getView(): any;
    onPress(cell: any, view: any): Promise<any>;
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
    protected _resolveData(definition: any): Promise<Object>;
}
