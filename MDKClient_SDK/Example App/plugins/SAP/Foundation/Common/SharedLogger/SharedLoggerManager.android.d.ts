export declare class SharedLoggerManager {
    static log(message: string, severity: string): Promise<void>;
    static pluginDebug(message: string, ...args: any[]): Promise<void>;
    static pluginError(message: string, ...args: any[]): Promise<void>;
    static pluginInfo(message: string, ...args: any[]): Promise<void>;
    static pluginWarn(message: string, ...args: any[]): Promise<void>;
    private static instance;
    private static bridge;
    private static pluginLog;
}
