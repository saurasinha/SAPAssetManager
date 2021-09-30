export declare class ImageHelper {
    static imageFontIconClassName: string;
    static imageFontIconFontFamilyName: string;
    static imageFontIconInternalClassName: string;
    static cache: Map<any, any>;
    static resExist(resUrl: string): boolean;
    static fileExist(filePath: string): boolean;
    static processIcon(icon: string, width: number, height: number, isIconCircular?: boolean): Promise<string>;
    static convertFontIconToBase64(icon: string, styleClass?: any): string;
    static _getFontIconSizeAdjustment(adjustAndroid?: boolean, adjustIOS?: boolean): number;
    static clearCache(): void;
    static deleteCachedImages(): void;
    private static checkIfImageAlreadyDownloaded;
    private static resizeImageForIOS;
    private static resizeImageForAndroid;
    static getIconTextInitials(text: string): string;
    private static resizeAndSaveImageSourceToFile;
    private static getHashedFileName;
    private static isFileCached;
}
