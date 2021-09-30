import { ActionExecutionStatus } from '../../ClientEnums';
import { IActionResult } from '../../context/IClientAPI';
export declare class ActionResultBuilder {
    static implementsIActionResult(obj: Object): boolean;
    protected _actionResult: IActionResult;
    constructor();
    build(): IActionResult;
    canceled(): ActionResultBuilder;
    data(data: any): ActionResultBuilder;
    error(error: any): ActionResultBuilder;
    enabled(enabled: boolean): ActionResultBuilder;
    failed(): ActionResultBuilder;
    status(status: ActionExecutionStatus): ActionResultBuilder;
    valid(valid: boolean): ActionResultBuilder;
    pending(): ActionResultBuilder;
}
