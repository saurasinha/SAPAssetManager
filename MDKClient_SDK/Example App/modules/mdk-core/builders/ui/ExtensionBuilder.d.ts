import { FallbackExtension } from '../../controls/FallbackExtension';
import { ExtensionViewDefinition } from '../../definitions/ExtensionViewDefinition';
import { IView } from '../../IView';
export declare class ExtensionBuilder {
    static createFallbackExtension(error: any, props: any, native?: boolean): FallbackExtension;
    private _controlFolderName;
    private _moduleName;
    private _controlName;
    private _className;
    private _defaultExtensionFolderName;
    private _tsExtName;
    private _jsExtName;
    private _extSource;
    private _retryCount;
    private _maxRetryCount;
    setModule(moduleName: string): this;
    setControl(controlName: string): this;
    setClass(className: string): this;
    build(def: ExtensionViewDefinition, binding: any, props: any): IView;
    createExtension(): IView;
    private _getExtensionModule;
    private _getExtensionModuleFromDefinition;
    private _getExtensionModuleFromExtension;
    private _getPartialExtensionModulePath;
    private _getDefinitionExtensionModulePath;
    private _isModuleExists;
    private _isValidExtensionView;
    private _updateExtControlSourceMap;
}
