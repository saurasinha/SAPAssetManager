import { CreateODataRelatedMediaActionDefinition } from '../definitions/actions/CreateODataRelatedMediaActionDefinition';
import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class CreateODataRelatedMediaAction extends ODataAction {
    private headerKeys;
    constructor(definition: CreateODataRelatedMediaActionDefinition);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
