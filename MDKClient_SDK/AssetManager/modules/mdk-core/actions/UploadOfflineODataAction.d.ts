import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class UploadOfflineODataAction extends ODataAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
    getUploadCategories(): string[];
    protected publishAfterSuccess(): Promise<boolean>;
}
