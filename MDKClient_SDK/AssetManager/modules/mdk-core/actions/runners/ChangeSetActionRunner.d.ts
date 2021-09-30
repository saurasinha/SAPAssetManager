import { ActionRunner } from './ActionRunner';
import { IAction } from '../IAction';
import { IActionResult } from '../../context/IClientAPI';
import { ExecuteSource } from '../../common/ExecuteSource';
export declare class ChangeSetActionRunner extends ActionRunner {
    private _servicePromise;
    protected _source: ExecuteSource;
    run(action: IAction): Promise<IActionResult>;
    protected _processChangeSets(changeSets: string[]): Promise<IActionResult>;
    protected _processChangeSet(action: string): Promise<IActionResult>;
    private _beginChangeSet;
    private _cancelChangeSet;
    private _commitChangeSet;
}
