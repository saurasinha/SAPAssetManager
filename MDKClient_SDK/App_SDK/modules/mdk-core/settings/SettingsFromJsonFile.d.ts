import { SimpleSettings } from './SimpleSettings';
export declare abstract class SettingsFromJsonFile extends SimpleSettings {
    protected _filePath: string;
    constructor(filePath: string, loggingName: string);
    setSettings(obj: any): void;
    setSetting(key: string, value: string): void;
    clear(): void;
    protected setValue(obj: any, key: string, value: any): any;
    protected loadJSONData(): any;
    protected checkBackwardCompatibility(result: any): any;
}
