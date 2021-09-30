export declare class I18n {
    static applyLanguage(languageCode: string): void;
    static formatDateToLocaleString(date: Date, format?: string, customLocale?: string, customTimeZone?: string, customOptions?: any): string;
    static formatNumberToLocaleString(value: number, options?: any, customLocale?: string, patterns?: string): string;
    static getDeviceLanguageCode(): string;
    static getDeviceRegionCode(): string;
    static getDeviceFontScale(): number;
    static getDeviceRegionCodeList(): string[];
    static getDeviceRegionName(currentAppLocale: string, countryCode: string): string;
    static getLocalizedLanguageName(currentAppLocale: string, languageCode: string): string;
    private static localesCache;
    private static getLocale;
    private static getDeviceLocale;
    private static getDateTimePattern;
}
