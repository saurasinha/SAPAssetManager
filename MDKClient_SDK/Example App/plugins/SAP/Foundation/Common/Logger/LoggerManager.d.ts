export declare class LoggerManager {
    static init(logFileName?: string, maxFileSizeInMegaBytes?: number): void;
    static getInstance(): any;
    static clearLog(): void;
    private constructor();
    toggle(): Promise<any>;
    on(): Promise<any>;
    off(): Promise<any>;
    isTurnedOn(): boolean;
    isLogSeverityHigher(severity: string): boolean;
    getLevel(): string;
    setLevel(newLevel: string): Promise<any>;
    log(message: string, severity?: string): Promise<any>;
    uploadLogFile(backendURL: string, applicationID: string): Promise<any>;
    getLevelFromUserDefaults(): string;
}
