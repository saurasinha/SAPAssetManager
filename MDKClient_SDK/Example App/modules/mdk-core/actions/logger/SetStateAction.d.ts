import { BaseAction } from '../BaseAction';
import { SetStateActionDefinition } from '../../definitions/actions/logger/SetStateActionDefinition';
import { IActionResult } from '../../context/IClientAPI';
export declare class SetStateAction extends BaseAction {
    constructor(actionDefinition: SetStateActionDefinition);
    execute(): Promise<IActionResult>;
    private setLoggerState;
}
