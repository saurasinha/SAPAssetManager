import { SimpleSettings } from './SimpleSettings';
export declare class PersistentSettings extends SimpleSettings {
    private _keyStoreName;
    constructor(name: string, loggingName: string);
    setSettings(obj: any): void;
    setSetting(key: string, value: string): void;
    clear(): void;
    protected saveSettings(): void;
    protected retrieveSettingsFromStorage(): void;
    protected getStoreName(): string;
}
