export class LoggerManager {
 /**
  * Static initializer to initializes the LoggerManager and adds the log file handlers.
  * Example:
  * ```typescript
  * LoggerManager.init("log.txt", 3)
  * ```
  * 
  * @param logFileName  Optional, File name of the local log file on the 
  * client device. If missing, default value is ClientLog.txt
  * @param maxFileSizeInMegaBytes Optional, Max file size before rollover of 
  * the local log file on the client device. If missing, default value is 1MB.
  * The default root log level is 'Error', according to SAP SDK.
  */
  public static init(logFileName: string = 'ClientLog.txt', maxFileSizeInMegaBytes: number = 1) {
    //
  }

  /**
   * Static function to return the singleton instance of the LoggerManager.
   * If it has not been initialized yet, it throws exception.
   * @returns the instance of the LoggerManager .
   * @throws Error Throws error if calling before initilizing LoggerManager.
   */
  public static getInstance(): any {
    return '';
  }

  /**
   * Static function to clear log and set the LoaggerManager's status to non-initialized
   */
  public static clearLog() {
    //
  }

  private constructor() {
    //
  }

  /**
   * If the logger is turned off, then it will be turned on.
   * Otherwise it will be turned off.
   */
  public toggle(): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  /**
   * Turns on the logger.
   * If it has not been changed, the default log level is 'Error'.
   */
  public on(): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  /**
   * Turns off the logger.
   */
  public off(): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  /**
   * Returns true, if the Logger is turned On. Otherwise returns false.
   * @returns {boolean}
   */
  public isTurnedOn(): boolean {
    return false;
  }

   /**
    * Check if loglevel is higher than serverity or not
    * @param {string} severity The severity level. It's values can be: Error, Warn, Info, Debug, Off.
    * @returns {boolean}
    */
  public isLogSeverityHigher(severity: string): boolean {
    return false;
  }
  /**
   * Returns the log level of the root Logger.
   * @returns {string}
   */
  public getLevel(): string {
    return '';
  }

  /**
   * Sets the log level and updates the logger state accordingly (turns it on/off).
   * @param {string} newLevel The log level. It's values can be: Error, Warn, Info, Debug, Off.
   */
  public setLevel(newLevel: string): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  /**
   * Logs a message, if the logger is turned on.
   * @param {string} message The message to be logged.
   * @param {LoggerSeverity} severity Optional. The severity of the log level for logging 
   * this message. If the severity parameter is not specified or invalid, the root log level will be used.
   */
  public log(message: string, severity: string = undefined): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  /**
   * Uploads the current set of logs (logs since the last upload) to the backend URL with app ID.
   * @param {string} backendURL The backend URL.
   * @param {string} applicationID The application ID.
   */
  public uploadLogFile(backendURL: string, applicationID: string): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }
  
  /**
   * Gets the level from user stored settings from the key 'AppModeler_logLevel'
   * @returns {boolean}
   */

  public getLevelFromUserDefaults(): string {
    return '';
  }
}
