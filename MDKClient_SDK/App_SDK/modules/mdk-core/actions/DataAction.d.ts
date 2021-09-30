import { BaseAction } from './BaseAction';
import { BaseActionDefinition } from '../definitions/actions/BaseActionDefinition';
import { IActionResult } from '../context/IClientAPI';
export declare abstract class DataAction extends BaseAction {
    private _oDataEventHandler;
    constructor(definition: BaseActionDefinition);
    getService(): string;
    onSuccess(actionResult: IActionResult): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
