import { SharedLoggerManager } from '../SharedLogger/SharedLoggerManager';
import { ErrorMessage } from '../../../ErrorHandling/ErrorMessage';
import { CommonUtil } from '../../../ErrorHandling/CommonUtil';
import * as application from 'tns-core-modules/application';
import * as appSettings from 'tns-core-modules/application-settings';
import { messageType, write } from 'tns-core-modules/trace';

declare var com;
const foundationPkg = com.sap.mdk.client.foundation;
/**
 * Describes the states of the logging.
 * The state of the logging can be turned On or Off.
 */
enum LoggerState {
    On,
    Off,
}

/**
 * Describes the possible values for log levels.
 */
enum LoggerSeverity {
    Off,
    Error,
    Warn,
    Info,
    Debug,
}

export class LoggerManager {

    public static createIPromiseCallback(args): any {
        return new foundationPkg.IPromiseCallback(args);
    }

    /**
     * Initializes the LoggerManager.
     * Adds the log file handlers.
     * @param {string} logFileName  Optional, File name of the local log file on the 
     * client device. Default value is ClientLog.txt
     * @param {number} maxFileSizeInMegaBytes Optional, Max file size before rollover of 
     * the local log file on the client device. Default value is 1MB.
     * The default root log level is 'Error', according to SAP SDK.
     */
    public static init(logFileName: string = 'ClientLog.txt', maxFileSizeInMegaBytes: number = 1) {
        if (!LoggerManager.isInitialized) {
            LoggerManager.isInitialized = true;
            LoggerManager.instance = new LoggerManager();
            LoggerManager.instance.initialContext();
            LoggerManager.instance.initLogLocalFileHandler(logFileName, maxFileSizeInMegaBytes);
            LoggerManager.instance.saveLoggerParams(logFileName, maxFileSizeInMegaBytes);
            LoggerManager.instance.initLogLevelFromSharedPreferences();
            write('Logger initialized successfully', 'mdk.trace.logging', messageType.log);
        } else {
            SharedLoggerManager.pluginWarn(ErrorMessage.WARN_LOG_FILE_NOT_CREATED, logFileName);    
        }
    }

    /**
     * Returns the single initialized instance of the LoggerManager.
     * If it has not been initialized yet, it returns an error.
     * @returns LoggerManager The instance.
     * @throws Error Throws error if calling before initilizing LoggerManager.
     */
    public static getInstance(): LoggerManager {
        if (LoggerManager.instance == null) {
            throw new Error(ErrorMessage.LOGGER_MANAGER_NOT_INITIALIZED_YET);
        } else {
            return LoggerManager.instance;
        }
    }

    public static clearLog() {
        if (LoggerManager.isInitialized) {
            LoggerManager.isInitialized = false;
            LoggerManager.getInstance().bridge.clearLog();
        }
    }
    
    private static instance = new LoggerManager();
    private static isInitialized = false;
    private currentLoggerState = LoggerState.Off;
    private logLevel: LoggerSeverity = LoggerSeverity.Off; // root log level
    private bridge = com.sap.mdk.client.foundation.LoggerManager;

    /**
     * Private constructor because of the singleton pattern.
     * Getting instance is possible with the getInstance() method.
     */
    private constructor() {
        //
    }

    /**
     * Returns true, if the Logger is turned On. Otherwise returns false.
     * @returns {boolean}
     */
    public isTurnedOn(): boolean {
        return this.currentLoggerState === LoggerState.On;
    }

    /**
     * Returns the log level of the root Logger.
     * @returns {string}
     */
    public getLevel(): string {
        return <string> LoggerSeverity[this.logLevel];
    }

    /**
     * Check if loglevel is higher than serverity or not
     * @param {string} severity The severity level. It's values can be: Error, Warn, Info, Debug, Off.
     * @returns {boolean}
     */
    public isLogSeverityHigher(severity: string): boolean {
        let logSeverity: LoggerSeverity = LoggerSeverity[severity];
        return (logSeverity > 0 && this.logLevel >= logSeverity);
    }

    /**
     * If the logger is turned off, then it will be turned on.
     * Otherwise it will be turned off.
     */
    public toggle(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.currentLoggerState === LoggerState.Off) {
                // Turn logging on 
                this.on();
                resolve();
            } else {
                // Turn logging off
                this.off();
                resolve();
            }
        });
    }

    /**
     * Turns on the logger.
     * If it has not been changed, the default log level is 'Error'.
     */
    public on(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.currentLoggerState === LoggerState.Off) {
                this.currentLoggerState = LoggerState.On;
                if (this.logLevel === LoggerSeverity.Off) {
                    this.logLevel = LoggerSeverity.Error;
                }
                this.activateNewLogSeverity(this.logLevel);
                write('Logging turned on', 'mdk.trace.logging', messageType.log);
            }
            resolve();
        });
    }

    /**
     * Turns off the logger.
     */
    public off(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.currentLoggerState === LoggerState.On) {
                this.logLevel = LoggerSeverity.Off;
                this.currentLoggerState = LoggerState.Off;
                this.activateNewLogSeverity(LoggerSeverity.Off);
                write('Logging turned off.', 'mdk.trace.logging', messageType.log);
            }
            resolve();
        });
    }

    /**
     * Sets the log level and updates the logger state accordingly (turns it on/off).
     * @param {string} newLevel The log level. It's values can be: Error, Warn, Info, Debug, Off.
     */
    public setLevel(newLevel: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let newSeverity = LoggerSeverity[newLevel];

            // If log level is invalid, then reject
            if (newSeverity === undefined) {
                reject('Defined log level is not a valid value.');
                return;
            }

            // Storing new log level and updating logger state accordingly
            this.logLevel = newSeverity;
            this.updateLoggerState(newSeverity);

            // Activating new log level
            this.activateNewLogSeverity(this.logLevel);
            resolve();
        });
    }

    /**
     * Uploads the current set of logs (logs since the last upload) to the backend URL with app ID.
     * @param {string} backendURL The backend URL.
     * @param {string} applicationID The application ID.
     */
    public uploadLogFile(backendURL: string, applicationID: string) {
        return new Promise((resolve, reject) => {
            let successHandler = LoggerManager.createIPromiseCallback({
                onResolve(result) {
                    resolve(result);
            }});
            let failureHandler = LoggerManager.createIPromiseCallback({
                onRejected(code, message, error) {
                    reject(CommonUtil.toJSError(code, message, error));
            }});
            return this.bridge.uploadLogFile(backendURL, applicationID, successHandler, failureHandler);
        });
    }

    /**
     * Logs a message, if the logger is turned on.
     * @param {string} message The message to be logged.
     * @param {LoggerSeverity} severity Optional. The severity of the log level for logging 
     * this message. If the severity parameter is not specified or invalid, the root log level will be used.
     */
    public log(message: string, severity: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {

            let logSeverity: LoggerSeverity = LoggerSeverity[severity];

            // If log level is invalid, then use the log level of the root
            if (logSeverity === undefined) {
                logSeverity = this.logLevel;
            }

            // If Logger is On, then log message and resolve, else reject
            if ((this.currentLoggerState === LoggerState.On) && (logSeverity !== LoggerSeverity.Off)) {
                let logSeverityString = <string> LoggerSeverity[logSeverity];
                if (!this.isLogSeverityHigher(logSeverityString)) {
                    let logLevelString = this.getLevel();
                    const msg = `Log severity '${logSeverityString}' is lower than log level '${logLevelString}'`;
                    write(msg, 'mdk.trace.onboarding', messageType.log);
                } else {
                    this.bridge.log(message, logSeverityString);
                    const logMessage: string = `Logged a message with severity '${logSeverityString}'`;
                    write(logMessage, 'mdk.trace.onboarding', messageType.log);
                }
                resolve();
            } else {
                reject('Logger is turned off.');
            }
        });
    }

    public getLevelFromUserDefaults() {
        let logLevelAsString:any = appSettings.getString('AppModeler_logLevel');
        return logLevelAsString === undefined || logLevelAsString === null ? '' : logLevelAsString;
    }

    /**
     * Sets the log level of the Logger to the specified one.
     * @param {LoggerSeverity} newLogLevelSeverity The new default log level.
     */
    private activateNewLogSeverity(newLogLevelSeverity: LoggerSeverity) {
        let logLevelAsString = <string> LoggerSeverity[newLogLevelSeverity];
        this.bridge.activateLogLevel(logLevelAsString);
        this.saveLogLevelToSharedPreferences(newLogLevelSeverity);
    }

    /**
     * Updates the logger state (On/Off) according to the selected new log level.
     * @param {LoggerSeverity} logLevelSeverity The new log level, set by the setLogLevel method.
     */
    private updateLoggerState(logLevelSeverity: LoggerSeverity) {
        if (logLevelSeverity === LoggerSeverity.Off) {
            this.currentLoggerState = LoggerState.Off;
        } else {
            this.currentLoggerState = LoggerState.On;
        }
    }

    private initialContext() {
      this.bridge.initialContext(application.android.context);
    }

    private initLogLocalFileHandler(logFileName: String, maxFileSizeInMegaBytes: number) {
        this.bridge.addLocalFileHandler(logFileName, maxFileSizeInMegaBytes);
    }

    private initLogLevelFromSharedPreferences() {
        let logLevelAsString: string = appSettings.getString('AppModeler_logLevel');
        let newSeverity: LoggerSeverity = LoggerSeverity[logLevelAsString];
        if (newSeverity) {
            // restoring log level from settings
            this.logLevel = newSeverity;
            this.updateLoggerState(newSeverity);
        }
    }

    private saveLogLevelToSharedPreferences(newLogLevelSeverity: LoggerSeverity) {
        let logLevelAsString: string = <string> LoggerSeverity[newLogLevelSeverity];
        if (logLevelAsString) {
            appSettings.setString('AppModeler_logLevel', logLevelAsString);
            appSettings.flush();
        }
    }

    private saveLoggerParams(logFileName: string, maxFileSizeInMegaBytes: number) {
        appSettings.setString('AppModeler_logFileName', logFileName);
        appSettings.setNumber('AppModeler_logFileSize', maxFileSizeInMegaBytes);
        appSettings.flush();
    }

}
