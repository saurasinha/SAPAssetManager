export declare class SwiftExtensionDelegate extends NSObject {
    static ObjCExposedMethods: {
        setControlValue: {
            params: (typeof NSString)[];
            returns: interop.Type<void>;
        };
        executeActionOrRule: {
            params: (typeof NSString)[];
            returns: interop.Type<void>;
        };
        resolveValue: {
            params: (typeof NSString)[];
            returns: interop.Type<void>;
        };
    };
    static initWithBridge(bridge: any, extension: any): SwiftExtensionDelegate;
    private _bridge;
    private _controlExtension;
    setControlExtension(controlExtension: any): void;
    setControlValue(value: any): void;
    executeActionOrRule(definitionPath: any): void;
    resolveValue(value: any): void;
}
