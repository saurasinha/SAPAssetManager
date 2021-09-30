import { ErrorMessage } from '../../../ErrorHandling/ErrorMessage';
declare var com;

export class SharedLoggerManager {
    /**
     * Logs a message, if the logger is turned on.
     * @param {string} message The message to be logged.
     * @param {LoggerSeverity} severity Optional. The severity of the log level for logging 
     * this message. If the severity parameter is not specified or invalid, the root log level will be used.
     */
    public static log(message: string, severity: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.bridge.log('SAP.MDKClient', severity, message);
            resolve();
        });
    }

    public static pluginDebug(message: string, ...args: any[]): Promise<void> {
        return SharedLoggerManager.pluginLog('Debug', message, args);
    }

    public static pluginError(message: string, ...args: any[]): Promise<void> {
        return SharedLoggerManager.pluginLog('Error', message, args);
    }

    public static pluginInfo(message: string, ...args: any[]): Promise<void> {
        return SharedLoggerManager.pluginLog('Info', message, args);
    }

    public static pluginWarn(message: string, ...args: any[]): Promise<void> {
        return SharedLoggerManager.pluginLog('Warn', message, args);
    }

    private static instance = new SharedLoggerManager();
    private static bridge = com.sap.mdk.client.foundation.SharedLoggerManager;

    private static pluginLog(severity: string, message: string, ...args: any[]): Promise<void> {
        let str = ErrorMessage.format(message, ...args);
        return new Promise<void>((resolve, reject) => {
            SharedLoggerManager.bridge.log('SAP.Plugin', severity, str);
            resolve();
        });
    }
}
