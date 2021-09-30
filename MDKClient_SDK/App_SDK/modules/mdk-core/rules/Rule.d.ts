import { IContext } from '../context/IContext';
import { RuleDefinition } from '../definitions/RuleDefinition';
export declare class Rule {
    private _context;
    private static preloadedModules;
    private static modules;
    private static _assignPreloadedModule;
    private ruleFunction;
    private ruleName;
    constructor(oRuleDefinition: RuleDefinition, _context: IContext);
    run(): Promise<any>;
    private _preloadRuleModules;
    private _preloadedRuleModules;
}
