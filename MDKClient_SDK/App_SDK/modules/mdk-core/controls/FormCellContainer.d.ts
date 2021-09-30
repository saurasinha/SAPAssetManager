import { BaseFormCell } from './formCell/BaseFormCell';
import { IControlData } from './IControlData';
import { ListPickerFormCell } from './formCell/ListPickerFormCell';
import { BaseContainer } from './BaseContainer';
export declare class FormCellContainer extends BaseContainer {
    private _controls;
    private sdkStyleClass;
    private allControlsAreBuilt;
    private _triggerListPickerOnValueChangeEvent;
    bind(): Promise<any>;
    initialize(controlData: IControlData): void;
    viewIsNative(): boolean;
    setStyle(style: string): void;
    redraw(builtData?: any, cell?: BaseFormCell): Promise<void>;
    readonly controls: BaseFormCell[];
    updateCell(control: BaseFormCell): void;
    setFocus(control: BaseFormCell, keyboardVisibility: string): void;
    hideLazyLoadingIndicator(control: ListPickerFormCell): void;
    updateCellByProperties(control: BaseFormCell, data: any): void;
    private _triggerOnValueChangeEventForOneItemSelected;
    onLoaded(): void;
    private _resolveLoadingIndicator;
    private _buildCells;
    private _createFormCellContainerView;
    private _createCells;
    private _isValidIndexPath;
    private _resolveSectionsInfo;
    private readonly formcellData;
}
