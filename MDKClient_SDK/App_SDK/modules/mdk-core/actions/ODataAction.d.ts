import { DataAction } from './DataAction';
import { BaseActionDefinition } from '../definitions/actions/BaseActionDefinition';
export declare abstract class ODataAction extends DataAction {
    protected _resolvedEntitySet: string;
    private _sapLanguageParamIdentifier;
    constructor(definition: BaseActionDefinition);
    getEntitySet(): string;
    getResolvedEntitySet(): string;
    protected getLanguageUrlParam(): string;
    protected getServiceUrlSuffix(serviceUrl: string): string;
    protected addServiceLanguageParam(serviceUrl: string, languageParam: string): void;
    protected setEmptyProperties(service: any): void;
    private _getLanguageForServiceURLSuffix;
}
