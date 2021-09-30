import { BaseAction } from './BaseAction';
import { ApplicationUpdateActionDefinition } from '../definitions/actions/ApplicationUpdateActionDefinition';
import { IActionResult } from '../context/IClientAPI';
export declare class ApplicationUpdateAction extends BaseAction {
    constructor(definition: ApplicationUpdateActionDefinition);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
