import { BaseControl } from './BaseControl';
import { IControlData } from './IControlData';
import { LoadingIndicatorData } from '../common/LoadingIndicatorData';
export declare class BaseContainer extends BaseControl {
    protected _loadingIndicatorData: LoadingIndicatorData;
    initialize(controlData: IControlData): void;
    protected _showLoadingIndicator(): void;
    protected _dismissLoadingIndicator(): void;
    protected _setLoadingIndicatorData(value: any): void;
}
