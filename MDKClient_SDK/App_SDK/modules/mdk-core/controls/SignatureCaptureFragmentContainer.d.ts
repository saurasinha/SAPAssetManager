import { BaseControl } from "./BaseControl";
import { BaseFormCell } from "./formCell/BaseFormCell";
import { IControlData } from "./IControlData";
export declare class SignatureToolBarCollapseActionViewEvent {
    private container;
    constructor(container: SignatureCaptureFragmentContainer);
    collapseToolBarActionView(): void;
}
export declare class SignatureCaptureFragmentContainer extends BaseControl {
    private _controls;
    private sdkStyleClass;
    private backPressedEvent;
    bind(): Promise<any>;
    getBackPressedEvent(): SignatureToolBarCollapseActionViewEvent;
    initialize(controlData: IControlData): void;
    viewIsNative(): boolean;
    setStyle(style: string): void;
    readonly controls: BaseFormCell[];
    onNavigatedTo(initialLoading: boolean): void;
    onNavigatingFrom(): void;
    collapseToolBarActionView(): void;
    private _createSignatureCaptureFragmentContainerView;
    private readonly formcellData;
}
