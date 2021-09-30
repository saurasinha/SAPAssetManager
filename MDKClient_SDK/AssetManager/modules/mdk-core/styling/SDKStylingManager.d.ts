export declare class SDKStylingManager {
    static STYLE_FILE_NAME: string;
    static BRANDING_STYLE_FILE: string;
    static saveSDKStyleFile(styleFileContent: string, styleFileName?: string): Promise<any>;
    static applySDKStyle(styleFileName?: string): void;
    static applyBrandingStyles(): void;
    static deleteSDKStyleFile(styleFileName?: string): Promise<any>;
}
