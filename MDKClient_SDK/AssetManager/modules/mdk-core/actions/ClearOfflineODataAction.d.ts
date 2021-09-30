import { ODataAction } from './ODataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class ClearOfflineODataAction extends ODataAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
}
