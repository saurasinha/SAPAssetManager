import { BaseAction } from './BaseAction';
import { IActionResult } from '../context/IClientAPI';
export declare class NavigationAction extends BaseAction {
    constructor(definition: any);
    execute(): Promise<IActionResult>;
}
