import { BaseAction } from './BaseAction';
import { ClosePageActionDefinition } from '../definitions/actions/ClosePageActionDefinition';
import { IActionResult } from '../context/IClientAPI';
export declare class ClosePageAction extends BaseAction {
    constructor(definition: ClosePageActionDefinition);
    execute(): Promise<IActionResult>;
    closeState(params: any): {
        canceled: any;
        completed: any;
    };
}
