import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class CancelDownloadOfflineODataAction extends ODataAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
}
