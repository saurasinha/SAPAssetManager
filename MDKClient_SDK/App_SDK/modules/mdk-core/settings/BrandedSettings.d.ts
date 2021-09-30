import { SettingsFromJsonFile } from './SettingsFromJsonFile';
export declare class BrandedSettings extends SettingsFromJsonFile {
    static getInstance(): BrandedSettings;
    private static _instance;
    private constructor();
    hasDemoSetting(param: string): boolean;
    private getJSONData;
}
