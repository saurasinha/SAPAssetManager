export declare abstract class ISettings {
    abstract getLogName(): string;
    abstract hasSetting(key: string): boolean;
    abstract getSetting(key: string): any;
    abstract setSetting(key: string, value: any): void;
    abstract setSettings(obj: any): void;
    abstract getSettings(): any;
    abstract clear(): void;
}
