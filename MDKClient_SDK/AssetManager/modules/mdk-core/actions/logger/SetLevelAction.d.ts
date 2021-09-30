import { BaseAction } from '../BaseAction';
import { SetLevelActionDefinition } from '../../definitions/actions/logger/SetLevelActionDefinition';
import { IActionResult } from '../../context/IClientAPI';
export declare class SetLevelAction extends BaseAction {
    constructor(actionDefinition: SetLevelActionDefinition);
    execute(): Promise<IActionResult>;
    private setLoggerLevel;
}
