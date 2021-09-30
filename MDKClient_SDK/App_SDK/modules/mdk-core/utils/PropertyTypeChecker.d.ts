export declare const enum DynamicTargetPathType {
    TargetPath = 0,
    EscapeBracket = 1,
    EscapeHash = 2,
    Binding = 3
}
export declare class PropertyTypeChecker {
    static isGlobal(sReference: any): boolean;
    static isImage(sReference: any): boolean;
    static isRule(sReference: any): boolean;
    static isTargetPath(sReference: any): boolean;
    static isBinding(sReference: any): boolean;
    static isDynamicTargetPath(sReference: any): boolean;
    static getDynamicTargetPath(sReference: any): {
        Prefix: string;
        DynamicTargetPath: string;
        Suffix: string;
        BindingType: DynamicTargetPathType;
    };
    static checkNextTargetPath(sReference: any): DynamicTargetPathType;
    static checkNextEscape(sReference: any): {
        Index: number;
        Type: DynamicTargetPathType;
    };
    static isNewDynamicTargetPath(sReference: any): boolean;
    static isNewBinding(sReference: any): boolean;
    static isEscape(sReference: any): boolean;
    static isLocalizableString(sReference: any): boolean;
    static isPlatformSpecific(sReference: any): boolean;
    static isDefaultValue(sReference: any): boolean;
    static isSAPIcon(sReference: any): boolean;
    static isFontIcon(sReference: any): boolean;
    static isResourcePath(sReference: any): boolean;
    static isFilePath(sReference: any): boolean;
    private static _isValidString;
}
