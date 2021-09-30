import { BaseControl } from '../controls/BaseControl';
import { IControlData } from './IControlData';
export declare class DefaultExtension extends BaseControl {
    private _className;
    bridge: any;
    private _viewController;
    private _params;
    private _delegate;
    constructor(_className: any);
    initialize(controlData: IControlData): void;
    view(): any;
    viewIsNative(): boolean;
    readonly extensionProperties: any;
    executeAction(mActionPath: any): Promise<any>;
    update(params: Object): void;
    redraw(): void;
    setControlValue(value: any): void;
    executeActionOrRule(definitionPath: string): Promise<void>;
    resolveValue(value: string): void;
}
