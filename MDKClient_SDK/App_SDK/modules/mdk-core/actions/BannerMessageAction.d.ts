import { BaseAction } from './BaseAction';
import { BannerMessageActionDefinition } from '../definitions/actions/BannerMessageActionDefinition';
import { IActionResult } from '../context/IClientAPI';
export declare class BannerMessageAction extends BaseAction {
    constructor(definition: BannerMessageActionDefinition);
    execute(): Promise<IActionResult>;
    onActionLabelPress(): Promise<any>;
}
