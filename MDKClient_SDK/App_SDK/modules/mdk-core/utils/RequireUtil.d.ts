export declare class RequireUtil {
    static replaceMdkRequire(sContents: string): string;
    static copyTextFile(srcPath: string, destPath: string, replaceMdkRequire?: boolean): boolean;
    static getFolderName(filePath: string): string;
    static getFileName(filePath: string): string;
    static setRequire(webpackRequire: any, globalRequire?: any): void;
    static require(sPath: string): any;
    static isInDefinitionBundleFolder(filePath: string): boolean;
    static getDefinitionBundleFolder(): string;
    private static readonly BUNDLE_FOLDER_PATH;
    private static tryRequire;
    private static hasFileExtension;
}
