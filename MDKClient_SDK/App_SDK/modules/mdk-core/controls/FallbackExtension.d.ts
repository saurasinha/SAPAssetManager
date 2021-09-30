import { IControl } from '../controls/IControl';
import { IControlData } from './IControlData';
export declare class FallbackExtension extends IControl {
    private _error;
    private _native;
    private _errorText;
    constructor(_error: any, _native: any);
    initialize(controlData: IControlData): void;
    view(): any;
    nativeScriptLabel(): any;
    androidView(): any;
    iosView(): any;
    observable(): any;
    setContainer(container: any): void;
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<void>;
}
