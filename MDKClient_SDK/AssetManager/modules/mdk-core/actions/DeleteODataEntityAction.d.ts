import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class DeleteODataEntityAction extends ODataAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
