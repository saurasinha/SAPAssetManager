import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class DownloadOfflineODataAction extends ODataAction {
    private _pendindReadLink;
    constructor(definition: any);
    execute(): Promise<IActionResult>;
    pendingReadLink(): string;
    protected publishAfterSuccess(): Promise<boolean>;
}
