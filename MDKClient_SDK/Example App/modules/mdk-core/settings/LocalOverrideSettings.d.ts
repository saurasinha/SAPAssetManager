import { SettingsFromJsonFile } from './SettingsFromJsonFile';
export declare class LocalOverrideSettings extends SettingsFromJsonFile {
    static getInstance(): LocalOverrideSettings;
    private static _instance;
    private constructor();
    hasSetting(key: string): boolean;
    getSetting(key: string): any;
    getSettings(): any;
    protected loadJSONData(): any;
    private canOverride;
    private getJSONData;
}
