export declare class ODataHelper {
    static createEntityValueList(): any;
    static entityValueListToJson(entityValueList: any, dataContext: any, isErrorArchive?: boolean): string;
    static complexValueListToJson(complexList: any, dataContext: any): string;
    static createEntityValue(entityType: any): any;
    static entityValueToJson(entityValue: any, dataContext: any): string;
    static setEntityValueProperties(entityValue: any, dataService: any, properties: any): void;
    static isEntityValueKnownToBackend(entityValue: any): boolean;
    static entityWithReadLink(changeSet: any, readLink: string): any;
    static complexValueToJson(entityValue: any, dataContext: any): string;
    static dataValueToJson(dataValue: any, dataContext: any): string;
    static dataListValueToJson(dataListValue: any, dataContext: any, isErrorArchive?: boolean): string;
    static partnerPropertyFromEntity(property: any, targetEntity: any): any;
    static createHttpHeaders(): any;
    static createDataContext(dataService: any): any;
    static createDataQuery(): any;
    static createChangeSet(): any;
    static createRequestBatch(): any;
    static isOnlineProvider(dataService: any): boolean;
    static getRequestOptions(requestOptions: any, service: any): any;
    static getHttpHeaders(headers: any): any;
    static createAction0(args: any): any;
    static createAction1(args: any): any;
}
