import { BaseAction } from './BaseAction';
import { IActionResult } from '../context/IClientAPI';
export declare class PushNotificationUnregisterAction extends BaseAction {
    constructor(actionDefinition: any);
    execute(): Promise<IActionResult>;
}
