import { BaseAction } from './BaseAction';
import { IActionResult } from '../context/IClientAPI';
export declare class LogoutAction extends BaseAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
}
