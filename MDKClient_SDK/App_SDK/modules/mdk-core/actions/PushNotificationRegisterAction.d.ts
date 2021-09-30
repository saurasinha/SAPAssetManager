import { BaseAction } from './BaseAction';
import { IActionResult } from '../context/IClientAPI';
export declare class PushNotificationRegisterAction extends BaseAction {
    constructor(actionDefinition: any);
    execute(): Promise<IActionResult>;
}
