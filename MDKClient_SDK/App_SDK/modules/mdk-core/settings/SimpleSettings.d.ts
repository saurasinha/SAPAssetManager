import { ISettings } from './ISettings';
export declare class SimpleSettings extends ISettings {
    protected _settings: any;
    protected _loggingName: string;
    constructor(loggingName: string, initialSettings?: any);
    getLogName(): string;
    hasSetting(key: string): boolean;
    getSetting(key: string): any;
    setSetting(key: string, value: any): void;
    setSettings(obj: any): void;
    getSettings(): any;
    clear(): void;
    protected hasValue(obj: Object, key: string): boolean;
    protected getValue(obj: Object, key: string): any;
    protected setValue(obj: Object, key: string, value: any): any;
    private makeCopy;
}
