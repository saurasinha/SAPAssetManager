export declare class CrudParamsHelper {
    static readonly MALFORMEDPARAM: string;
    static getHeadersFromParams(params: any): any;
    static getServiceFromParams(params: any): any;
    static getServiceUrlFromService(params: any): string;
    static getEntitySetNameFromService(params: any): string;
    static getPropertiesFromService(params: any): any;
    static getLinkCreatorsFromParams(params: any): any;
    static getLinkUpdatersFromParams(params: any): any;
    static getLinkDeletersFromParams(params: any): any;
    static getRequestOptionsFromService(params: any): any;
    static getParentFromParams(params: any): any;
    static getPropertyFromParent(params: any): any;
    private static readonly SERVICEKEY;
    private static readonly PROPERTYKEY;
    private static readonly SERVICEURLKEY;
    private static readonly ENTITYSETNAMEKEY;
    private static readonly ENTITYPROPERTIESKEY;
    private static readonly CREATELINKS;
    private static readonly UPDATELINKS;
    private static readonly DELETELINKS;
    private static readonly HEADERSKEY;
    private static readonly REQUESTOPTIONS;
    private static readonly PARENTKEY;
}
