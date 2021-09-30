export declare class DefinitionPath {
    static types: {
        Actions: string;
        Extensions: string;
        Globals: string;
        Images: string;
        Pages: string;
        Rules: string;
        SDKStyles: string;
        Services: string;
        Styles: string;
        i18n: string;
    };
    private static pathToTypeIndex;
    private static isValid;
    private _path;
    private _type;
    constructor(path: any);
    path: any;
    readonly type: string;
}
