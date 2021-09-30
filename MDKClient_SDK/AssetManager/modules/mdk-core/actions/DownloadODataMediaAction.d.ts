import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class DownloadODataMediaAction extends ODataAction {
    private _hasPendindData;
    constructor(definition: any);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
