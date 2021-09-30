import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class DownloadODataStreamAction extends ODataAction {
    private _hasPendindData;
    constructor(definition: any);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
