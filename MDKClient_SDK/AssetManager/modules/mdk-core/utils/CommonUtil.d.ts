export declare class CommonUtil {
    static format(str: string, ...args: any[]): string;
    static inspectIndicatorValues(values: string[]): string[];
    static isJSONString(str: any): boolean;
    static refineFilterQueryString(queryString: string): string;
    static getValidHexCode(hexColorCode: string): string;
    static deepCopyWithoutKey(sourceObject: any, withoutKey?: string): object;
    private static _deleteKey;
    static addKeyToObjectFromObject(sourceObject: any, destObject: any, comparedKey: string, expectedKey: string): void;
    static getJSONObject(value: any): any;
}
