import { IActionResult } from './context/IClientAPI';
import { IContext } from './context/IContext';
import { ExecuteSource } from './common/ExecuteSource';
export declare class EventHandler {
    private _eventSource;
    executeAction(sActionPath: any): Promise<IActionResult>;
    executeRule(sRulePath: any, context: IContext): Promise<any>;
    executeActionOrRule(sActionOrRulePath: any, context: IContext): Promise<any>;
    executeActionOrRuleSync(sActionOrRulePath: any, context: IContext): Promise<any>;
    setEventSource(source: ExecuteSource, context?: IContext): void;
    getEventSource(): ExecuteSource;
    private _executeAction;
    private _executeRule;
    private _resolveHandler;
    private _resolveHandlerSync;
}
