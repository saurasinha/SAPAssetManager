import { IActionRunner } from './IActionRunner';
import { IAction } from '../IAction';
import { IActionResult } from '../../context/IClientAPI';
export declare class ActionRunner implements IActionRunner {
    protected _handlerRan: boolean;
    protected _actionResult: IActionResult;
    run(action: IAction): Promise<IActionResult>;
    protected _beginExecution(action: IAction): Promise<IActionResult>;
    protected _runExecute(action: IAction): Promise<IActionResult>;
    protected _runInvalid(action: IAction): Promise<IActionResult>;
    protected _runSuccess(action: IAction): Promise<IActionResult>;
    protected _runFailure(action: IAction): Promise<IActionResult>;
    protected _runValid(action: IAction): Promise<IActionResult>;
    protected _showIndicator(action: IAction): Promise<number>;
    protected _dismissIndicator(action: IAction): void;
}
