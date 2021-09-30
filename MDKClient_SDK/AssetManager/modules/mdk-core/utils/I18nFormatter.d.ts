export declare class I18nFormatter {
    static currencyOptions: {
        currency: string;
        currencyDisplay: string;
        maximumFractionDigits: any;
        minimumFractionDigits: any;
        minimumIntegerDigits: any;
        style: string;
        useGrouping: any;
    };
    static numberOptions: {
        maximumFractionDigits: number;
        minimumFractionDigits: any;
        minimumIntegerDigits: any;
        style: string;
        useGrouping: boolean;
    };
    static percentageOptions: {
        maximumFractionDigits: number;
        minimumFractionDigits: any;
        minimumIntegerDigits: any;
        style: string;
        useGrouping: boolean;
    };
    static scientificOptions: {
        maximumFractionDigits: any;
        minimumFractionDigits: any;
        minimumIntegerDigits: any;
        style: string;
        useGrouping: boolean;
    };
    static formatDateToLocaleString(date: Date, format?: string, customLocale?: string, customTimeZone?: string, customOptions?: any): string;
    static formatNumberToLocaleString(value: number, options?: any, customLocale?: string, patterns?: string): string;
    static parseFormatOptions(defaultOptions: any, customOptions: any): any;
    static validateDate(value: any): any;
    static validateNumber(value: any): any;
    static validateBoolean(value: any): any;
    private static _invalidDateText;
}
