import { CreateODataMediaActionDefinition } from '../definitions/actions/CreateODataMediaActionDefinition';
import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class CreateODataMediaAction extends ODataAction {
    private headerKeys;
    constructor(definition: CreateODataMediaActionDefinition);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
