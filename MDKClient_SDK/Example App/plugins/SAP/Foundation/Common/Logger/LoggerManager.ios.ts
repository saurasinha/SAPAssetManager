import { SharedLoggerManager } from '../SharedLogger/SharedLoggerManager';
import { ErrorMessage } from '../../../ErrorHandling/ErrorMessage';
import { CommonUtil } from '../../../ErrorHandling/CommonUtil';
import { messageType, write } from 'tns-core-modules/trace';
import * as appSettings from 'tns-core-modules/application-settings';

// ios native class
declare var LoggerManagerSwift: any;

declare var interop: any;
declare var NSUserDefaults: any;

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
            LoggerManager.instance.attachUploaderToRootLogger(maxFileSizeInMegaBytes);
            LoggerManager.instance.initLogLocalFileHandler(logFileName, maxFileSizeInMegaBytes);
            LoggerManager.instance.saveLoggerParams(logFileName, maxFileSizeInMegaBytes);
            LoggerManager.instance.initLogLevelFromNSDefaults();
            write('Logger initialized successfully.', 'mdk.trace.logging', messageType.log);
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

    /**
     * Deletes log file.
     */
    public static clearLog() {
        if (LoggerManager.isInitialized) {
            LoggerManager.isInitialized = false;
            let errorRef = new interop.Reference();
            LoggerManager.getInstance().bridge.clearLogAndReturnError(errorRef);
            if (errorRef && errorRef.value) {
                throw new Error(ErrorMessage.LOGGER_FAILED_TO_DELETE_LOG_FILE);
            }
        }
    }

    private static instance = new LoggerManager();
    private static isInitialized = false;
    private currentLoggerState = LoggerState.Off;
    private logLevel: LoggerSeverity = LoggerSeverity.Off; // root log level
    private bridge = LoggerManagerSwift;

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
                write('Logging turned on.', 'mdk.trace.logging', messageType.log);
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
            return this.bridge.uploadLogsWithBackendURLApplicationIDResolveReject(backendURL, applicationID, (result) => {
                resolve(result);
            }, (code, message, error) => {
                reject(CommonUtil.toJSError(code, message, error));
            });
        });
    }

    public getLevelFromUserDefaults(): string {
        let groupDefaults = NSUserDefaults.standardUserDefaults;
        let logLevelAsString: any = groupDefaults.objectForKey('AppModeler_logLevel');
        return logLevelAsString === undefined || logLevelAsString === null? '' : logLevelAsString;
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
                    write(msg, 'mdk.trace.logging', messageType.log);
                } else {
                    this.bridge.logWithSeverity(message, logSeverityString);
                    const logMessage: string = `Logged a message with severity '${logSeverityString}'`;
                    write(logMessage, 'mdk.trace.logging', messageType.log);
                }
                resolve();
            } else {
                reject('Logger is turned off.');
            }
        });
    }

    /**
     * Sets the log level of the Logger to the specified one.
     * @param {LoggerSeverity} newLogLevelSeverity The new default log level.
     */
    private activateNewLogSeverity(newLogLevelSeverity: LoggerSeverity) {
        let logLevelAsString = <string> LoggerSeverity[newLogLevelSeverity];
        this.bridge.activateLogLevelWithSeverity(logLevelAsString);
        this.saveLogLevelToNSDefaults(newLogLevelSeverity);
    }

    /**
     * Attaches a log uploader to the logger.
     * The logs will be written to the Caches folder, with the max file size infinite.
     * After uploading the logs to the server, the content of the log file will be cleared.
     */
    private attachUploaderToRootLogger(maxFileSizeInMegaBytes: number) {
        let errorRef = new interop.Reference();
        this.bridge.attachUploaderToRootLoggerWithMaxFileSizeError(maxFileSizeInMegaBytes, errorRef);
        if (errorRef.value) {
            throw new Error(ErrorMessage.ERROR_WHILE_CREATING_LOG_UPLOAD);
        }
    }

    /**
     * Adds a file handler to the Logger, to prepare creating logs locally on the client device.
     * The logs will be written to the Documents folder.
     * Log file name and max file size can be specified when the logger is initialized.
     * @param {string} fileName File name of the created log file in the Documents folder.
     * @param {number} maxFileSizeInMegaBytes Maximal size of log file locally on the client 
     * device. When this size is reached, the log file will be cleared (roll over).
     * @throws {Error} if problem happens at file creation, an error could be thrown.
     */
    private initLogLocalFileHandler(fileName: string, maxFileSizeInMegaBytes: number) {
        let errorRef = new interop.Reference();
        this.bridge.addLocalFileHandlerWithFileNameMaxFileSizeError(
            fileName,
            maxFileSizeInMegaBytes,
            errorRef);
        if (errorRef.value) {
            throw new Error(ErrorMessage.ERROR_CREATING_LOCAL_FILE);
        }
    }

    /**
     * Restores the persisted log level from the application settings 
     * (NSDefaults) upon restart of the application.
     */
    private initLogLevelFromNSDefaults() {
        let groupDefaults = NSUserDefaults.standardUserDefaults;
        let logLevelAsString: string = groupDefaults.objectForKey('AppModeler_logLevel');
        let newSeverity: LoggerSeverity = LoggerSeverity[logLevelAsString];

        if (newSeverity) {
            // restoring log level from settings
            this.logLevel = newSeverity;
            this.updateLoggerState(newSeverity);
        }
        // else using default
    }

    /**
     * Persists the selected log level to the application settings (NSDefaults)
     * @param {LoggerSeverity} newLogLevelSeverity The log level to be stored in the settings.
     * Persists the selected logging level so that the last specified logging level can be 
     * restored upon restart of the application.
     */
    private saveLogLevelToNSDefaults(newLogLevelSeverity: LoggerSeverity) {
        let groupDefaults = NSUserDefaults.standardUserDefaults;
        let logLevelAsString: string = <string> LoggerSeverity[newLogLevelSeverity];
        if (logLevelAsString) {
            groupDefaults.setObjectForKey(logLevelAsString, 'AppModeler_logLevel');
            groupDefaults.synchronize();
        }
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

    private saveLoggerParams(logFileName: string, maxFileSizeInMegaBytes: number) {
        appSettings.setString('AppModeler_logFileName', logFileName);
        appSettings.setNumber('AppModeler_logFileSize', maxFileSizeInMegaBytes);
        appSettings.flush();
    }

}
