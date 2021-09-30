export declare enum RegionSource {
    UserDefined = 1,
    DeviceSetting = 2
}
export declare class I18nRegion {
    static getRegionLists(): Object;
    static isUsingDeviceRegion(): boolean;
    static loadAppRegion(): void;
    static setAppRegion(regionCode: string, source: any, isOverride?: boolean): void;
    static setUserDefinedRegion(regionCode: string): void;
    static getLocale(): string;
    private static _populateLocale;
}
