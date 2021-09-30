import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class CallFunctionODataAction extends ODataAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
    private _storeToActionBinding;
    private _saveSessionObjectIfExisted;
    private _recursiveKeySearch;
}
