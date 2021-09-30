import { BaseFormCell } from './BaseFormCell';
import { ListFormCellObservable } from '../../observables/ListFormCellObservable';
import { IFilterable, FilterCriteria } from '../IFilterable';
export declare class ListPickerFormCell extends BaseFormCell {
    private _filterProperty;
    private _caption;
    setSearchEnabled(isSearchEnabled: boolean): void;
    setBarcodeScanEnabled(isBarcodeScanEnabled: boolean): void;
    getValue(): {
        SelectedIndex: number;
        ReturnValue: String;
    }[];
    hideLazyLoadingIndicator(): void;
    getCollection(): {
        DisplayValue: string;
        ReturnValue: string;
    }[];
    setTargetSpecifier(specifier: any, redraw?: boolean): Promise<any>;
    webCreateListPickerDialog(model: any): void;
    androidCreateListPickerFragmentPage(model: any): void;
    androidCloseListPickerFragmentPage(): void;
    androidGetModalFrameTag(): string;
    androidUpdateActionViewExpandedStatus(isActive: boolean): void;
    androidRefreshForSelections(): void;
    triggerOnValueChangeEventForOneItemSelected(): void;
    getFilterValue(): FilterCriteria;
    setFilterCriteria(filterable: IFilterable): Promise<any>;
    onLoaded(): Promise<any>;
    protected createObservable(): ListFormCellObservable;
}
