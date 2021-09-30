import { IContext } from '../context/IContext';
export declare enum ValueType {
    Rule = 1,
    Global = 2,
    TargetPath = 3,
    DynamicTargetPath = 4,
    Image = 5,
    SAPIcon = 6,
    FontIcon = 7,
    Binding = 8,
    PlatformSpecific = 9,
    LocalizableString = 10,
    NewBinding = 11,
    NativeArray = 12,
    Array = 13,
    Object = 14,
    Escape = 15,
    DefaultValue = 16
}
export declare class ValueResolver {
    static resolveValue(sValue: any, context?: IContext, recursive?: boolean, excludedTypes?: [ValueType], style?: string): Promise<any>;
    static canRecursive(sValue: any, value: any): boolean;
    static canResolve(sValue: any): boolean;
    static resolveKeyValues(definitionObj: any, context?: IContext, recursive?: boolean, excludedTypes?: [ValueType]): Promise<{
        key: string;
        value: any;
    }>;
    static resolveArrayOfKeyValues(definitionObjArray: any, context?: IContext, recursive?: boolean, excludedTypes?: [ValueType]): Promise<{
        key: string;
        value: string;
    }[]>;
    static parseBinding(value: string, context?: IContext): any;
    private static _darkOption;
    private static _lightOption;
    private static _isNativeArray;
    private static _canResolveArray;
    private static _canResolveObject;
    private static _resolveValue;
    private static _isInExcludedTypes;
    private static _isDateInvalid;
    private static _resolveArray;
    private static _resolveObject;
    private static _parseBindingProperty;
    private static _parseGlobal;
    private static _parseImage;
    private static _parsePlatformSpecific;
    private static _parseDefaultValue;
    private static _getMatchedPosition;
    private static _evaluateTargetPath;
    private static _parseDynamicTargetPath;
    private static _executeRule;
    private static _onParseFail;
    private static _conbinePrefixAndResult;
}
