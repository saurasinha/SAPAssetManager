import { BaseTableSection } from './BaseTableSection';
import { FormCellSectionObservable } from '../observables/sections/FormCellSectionObservable';
import { BaseFormCell } from '../controls/formCell/BaseFormCell';
import { ListPickerFormCell } from 'src/controls/formCell/ListPickerFormCell';
export declare class FormCellSection extends BaseTableSection {
    private _controls;
    private _models;
    readonly controls: BaseFormCell[];
    protected _createObservable(): FormCellSectionObservable;
    initialize(): Promise<any>;
    redraw(data: any): Promise<any>;
    redrawFormCells(cell?: BaseFormCell): Promise<void>;
    updateCell(control: BaseFormCell): void;
    hideLazyLoadingIndicatorView(control: ListPickerFormCell): void;
    updateCellByProperties(control: BaseFormCell, data: any): void;
    sectionBridge(): any;
    setFocus(control: BaseFormCell, keyboardVisibility: string): void;
    private _createCells;
    private _buildCells;
    private _getRowIndex;
}
