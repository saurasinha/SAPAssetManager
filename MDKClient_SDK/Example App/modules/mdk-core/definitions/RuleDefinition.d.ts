import { BaseJSONDefinition } from './BaseJSONDefinition';
export declare class RuleDefinition extends BaseJSONDefinition {
    constructor(path: any, data: any);
    getRuleFunction(sExportedName: any): any;
    private _findExportedFunction;
}
