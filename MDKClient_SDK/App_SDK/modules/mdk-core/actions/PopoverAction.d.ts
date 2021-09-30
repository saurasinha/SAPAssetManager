import { BaseAction } from './BaseAction';
import { PopoverActionDefinition } from '../definitions/actions/PopoverActionDefinition';
export declare class PopoverAction extends BaseAction {
    constructor(definition: PopoverActionDefinition);
    execute(): Promise<any>;
}
