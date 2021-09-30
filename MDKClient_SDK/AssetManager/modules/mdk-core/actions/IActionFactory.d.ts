import { IActionRunner } from './runners/IActionRunner';
import { BaseActionDefinition } from '../definitions/actions/BaseActionDefinition';
export declare class IActionFactory {
    static setCreateFunction(func: (definition: BaseActionDefinition) => any): void;
    static setCreateActionRunnerFunction(func: (definition: BaseActionDefinition) => IActionRunner): void;
    static Create(definition: BaseActionDefinition): any;
    static CreateActionRunner(definition: BaseActionDefinition): IActionRunner;
    private static _CreateActionRunner;
    private static _Create;
}
