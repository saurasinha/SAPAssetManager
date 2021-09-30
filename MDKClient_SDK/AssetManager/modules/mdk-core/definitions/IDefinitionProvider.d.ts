export declare abstract class IDefinitionProvider {
    static setInstance(provider: IDefinitionProvider): void;
    static instance(): IDefinitionProvider;
    static isDefinitionInstantiated(): boolean;
    private static _instance;
    abstract getDefinition(oPathObject: any): any;
    abstract getDefinitionSync(oPathObject: any): any;
    abstract getExtensionDefinition(sPath: string): any;
    abstract getApplicationDefinition(): any;
    abstract getLocalizationResourceList(): any;
    abstract isDefinitionPathValid(oPathObject: any): boolean;
}
