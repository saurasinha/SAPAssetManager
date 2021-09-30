import { SimpleSettings } from './SimpleSettings';
export declare class DefaultSettings extends SimpleSettings {
    protected _settings: any;
    constructor();
    setSettings(obj: any): void;
    setSetting(key: string, value: string): void;
    clear(): void;
    protected setValue(obj: any, key: string, value: any): any;
}
