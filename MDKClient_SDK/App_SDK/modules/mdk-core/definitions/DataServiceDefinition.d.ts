import { BaseJSONDefinition } from './BaseJSONDefinition';
export declare class DataServiceDefinition extends BaseJSONDefinition {
    constructor(path: any, data: any);
    readonly csdlOptions: string[];
    readonly offlineCsdlOptions: string[];
    readonly destinationName: string;
    readonly pathSuffix: string;
    readonly languageUrlParam: string;
    readonly serviceURL: string;
    readonly isOffline: boolean;
    readonly isOnline: boolean;
    static isOffline(offlineEnabled: any): boolean;
    static isOnline(offlineEnabled: any): boolean;
    readonly offlineEnabled: any;
    getApplicationID(): any;
    readonly serviceOptions: any;
    readonly statefulService: boolean;
    readonly offlineServiceOptions: any;
    readonly offlineStoreParameters: any;
    readonly headers: any;
}
