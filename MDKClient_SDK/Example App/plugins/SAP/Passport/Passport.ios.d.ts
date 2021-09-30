export declare class Passport {
    private static _bridge;
    private static _componentNameKey;
    private static _actionKey;
    private static _traceFlagKey;
    private static _componentTypeKey;
    private static _prevComponentNameKey;
    private static _userIdKey;
    static getHeaderValue(componentName: string, action: string, traceFlag: string, componentType: string, prevComponentName?: string, userId?: string): string;
}
