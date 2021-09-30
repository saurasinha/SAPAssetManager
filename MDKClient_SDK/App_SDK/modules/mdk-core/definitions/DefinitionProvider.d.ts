import { IDefinitionProvider } from './IDefinitionProvider';
import { ApplicationDefinition } from './ApplicationDefinition';
import { RuleDefinition } from './RuleDefinition';
export declare class DefinitionProvider extends IDefinitionProvider {
    private _defLoader;
    constructor(defLoader: any);
    getApplicationDefinition(): ApplicationDefinition;
    getDefinition(oPathObject: any): any;
    getDefinitionSync(oPathObject: any): any;
    getExtensionDefinition(sPath: string): any;
    getRuleDefinition(oPath: any, oRuleDefinitionData: any): RuleDefinition;
    getJSONDefinition(oPath: any, oDefinitionData: any): any;
    getActionDefinition(oPath: any, oDefinitionData: any): any;
    getLocalizationResourceList(): any;
    isDefinitionPathValid(oPathObject: any): boolean;
    private copyValue;
    private setDefintionLoader;
}
