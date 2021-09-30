import { PersistentSettings } from './PersistentSettings';
export declare class LatchedSettings extends PersistentSettings {
    constructor(name: string, loggingName: string);
    hasSetting(key: string): boolean;
    getSetting(key: string): any;
    getSettings(): any;
    setSetting(key: string, value: any): void;
    setSettings(obj: any): void;
    clear(): void;
    latchSettings(): void;
    unlatchSettings(): void;
    isLatched(): boolean;
}
