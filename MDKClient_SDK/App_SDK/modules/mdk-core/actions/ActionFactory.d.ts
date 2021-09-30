import { BaseActionDefinition } from '../definitions/actions/BaseActionDefinition';
import { IAction } from './IAction';
import { IActionRunner } from './runners/IActionRunner';
export declare class ActionFactory {
    static Create(definition: any): IAction;
    static CreateActionRunner(definition: BaseActionDefinition): IActionRunner;
}
export default ActionFactory;
