import { DataAction } from './DataAction';
import { IActionResult } from '../context/IClientAPI';
export declare class SendRequestRestServiceAction extends DataAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
    protected publishAfterSuccess(): Promise<boolean>;
}
