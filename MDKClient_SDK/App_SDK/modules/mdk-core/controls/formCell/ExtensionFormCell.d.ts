import { BaseFormCell } from './BaseFormCell';
import { ExtensionFormCellObservable } from '../../observables/ExtensionFormCellObservable';
import { IView } from '../../IView';
import { View } from 'tns-core-modules/ui/core/view';
export declare class ExtensionFormCell extends BaseFormCell {
    protected _extension: IView;
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
    getValue(): any;
    build(): Promise<any>;
    redraw(): Promise<any>;
    onPress(cell: any, view: View): Promise<any>;
    getView(): any;
    onNavigatedFrom(pageExists: boolean): void;
    onNavigatedTo(initialLoading: boolean): void;
    onNavigatingFrom(pageExists: boolean): void;
    onNavigatingTo(initialLoading: boolean): void;
    onPageLoaded(initialLoading: boolean): void;
    onPageUnloaded(pageExists: boolean): void;
    protected createObservable(): ExtensionFormCellObservable;
}
