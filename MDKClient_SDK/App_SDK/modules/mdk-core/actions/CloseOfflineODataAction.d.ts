import { IActionResult } from '../context/IClientAPI';
import { ODataAction } from './ODataAction';
export declare class CloseOfflineODataAction extends ODataAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
}
