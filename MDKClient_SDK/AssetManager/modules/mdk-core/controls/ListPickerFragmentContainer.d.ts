import { BaseControl } from './BaseControl';
import { BaseFormCell } from './formCell/BaseFormCell';
import { IControlData } from './IControlData';
export declare class ToolBarCollapseActionViewEvent {
    private container;
    constructor(container: ListPickerFragmentContainer);
    collapseToolBarActionView(): void;
}
export declare class ListPickerFragmentContainer extends BaseControl {
    private _controls;
    private sdkStyleClass;
    private backPressedEvent;
    bind(): Promise<any>;
    getBackPressedEvent(): ToolBarCollapseActionViewEvent;
    initialize(controlData: IControlData): void;
    viewIsNative(): boolean;
    setStyle(style: string): void;
    readonly controls: BaseFormCell[];
    onNavigatedTo(initialLoading: boolean): void;
    onNavigatingFrom(): void;
    collapseToolBarActionView(): void;
    private _createListPickerFragmentContainerView;
    private readonly formcellData;
}
