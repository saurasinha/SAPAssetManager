import { BaseAction } from './BaseAction';
import { CheckRequiredFieldsActionDefinition } from '../definitions/actions/CheckRequiredFieldsActionDefinition';
import { IActionResult } from '../context/IClientAPI';
export declare class CheckRequiredFieldsAction extends BaseAction {
    constructor(definition: CheckRequiredFieldsActionDefinition);
    execute(): Promise<IActionResult>;
    private getRequiredFieldsArray;
}
