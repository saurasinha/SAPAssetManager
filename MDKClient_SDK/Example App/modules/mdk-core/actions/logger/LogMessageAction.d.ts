import { BaseAction } from '../BaseAction';
import { LogMessageActionDefinition } from '../../definitions/actions/logger/LogMessageActionDefinition';
import { IActionResult } from '../../context/IClientAPI';
export declare class LogMessageAction extends BaseAction {
    constructor(actionDefinition: LogMessageActionDefinition);
    execute(): Promise<IActionResult>;
}
