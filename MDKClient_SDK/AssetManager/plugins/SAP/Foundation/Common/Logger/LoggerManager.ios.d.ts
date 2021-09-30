export declare class LoggerManager {
    static init(logFileName?: string, maxFileSizeInMegaBytes?: number): void;
    static getInstance(): LoggerManager;
    static clearLog(): void;
    private static instance;
    private static isInitialized;
    private currentLoggerState;
    private logLevel;
    private bridge;
    private constructor();
    isTurnedOn(): boolean;
    getLevel(): string;
    isLogSeverityHigher(severity: string): boolean;
    toggle(): Promise<void>;
    on(): Promise<void>;
    off(): Promise<void>;
    setLevel(newLevel: string): Promise<void>;
    uploadLogFile(backendURL: string, applicationID: string): Promise<unknown>;
    getLevelFromUserDefaults(): string;
    log(message: string, severity: string): Promise<void>;
    private activateNewLogSeverity;
    private attachUploaderToRootLogger;
    private initLogLocalFileHandler;
    private initLogLevelFromNSDefaults;
    private saveLogLevelToNSDefaults;
    private updateLoggerState;
    private saveLoggerParams;
}
