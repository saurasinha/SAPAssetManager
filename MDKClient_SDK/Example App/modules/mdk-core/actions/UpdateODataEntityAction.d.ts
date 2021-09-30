import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class UpdateODataEntityAction extends ODataAction {
    private _service;
    private _readLink;
    constructor(definition: any);
    readonly readLink: string;
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
