export interface IDefinitionLoader {
    getLocalizationResourceList(): any;
    loadDefinition(reference: any): Object;
    loadBundle(): Promise<any>;
    loadJsonDefinition(oPathObject: string): Promise<any>;
    loadJsDefinition(oPathObject: string): Promise<any>;
}
