export declare enum LanguageSource {
    UserDefined = 1,
    DeviceSetting = 2,
    DefaultApp = 3,
    Hardcoded = 4
}
export declare class I18nLanguage {
    static defaultI18n: string;
    static hardcodedLanguageCode: string;
    static getPossibleCombinationFromLanguageCode(languageCode: string, addDefault?: boolean): string[];
    static getAppLanguage(): string;
    static getSupportedLanguages(): Object;
    static isUsingDeviceLanguage(): boolean;
    static loadAppLanguage(): void;
    static applyLanguage(languageCode: string): void;
    static setAppLanguage(languageCode: string, source: any, isOverride?: boolean): void;
    static setUserDefinedLanguage(languageCode: string): void;
    static toTitleCase(text: string): string;
    static convertSAPSpecificLanguageCode(language: any): string;
    private static _adjustLanguageCodeCase;
    private static _resetSupportedLanguages;
    private static _languageScripts;
    private static _addPossibleScriptFromLanguageCode;
}
