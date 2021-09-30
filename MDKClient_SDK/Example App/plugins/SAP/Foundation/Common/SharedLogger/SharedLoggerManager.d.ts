export declare class SharedLoggerManager {
    static log(message: any, severity?: any): Promise<any>;
    static pluginError(message: any, ...args: any[]): Promise<any>;
    static pluginDebug(message: any, ...args: any[]): Promise<any>;
    static pluginInfo(message: any, ...args: any[]): Promise<any>;
    static pluginWarn(message: any, ...args: any[]): Promise<any>;
}
