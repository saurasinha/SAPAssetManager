import { UndoPendingChangesODataActionDefinition } from '../definitions/actions/UndoPendingChangesODataActionDefinition';
import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class UndoPendingChangesODataAction extends ODataAction {
    private service;
    private data;
    constructor(definition: UndoPendingChangesODataActionDefinition);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
