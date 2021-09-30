import { ODataCrudOperation } from './BaseODataCruder';
export declare class CrudParams {
    private static readonly ENTITYSETNAMEKEY;
    private static readonly QUERYOPTIONSKEY;
    private static readonly READLINKKEY;
    private static readonly MALFORMEDPARAM;
    private static readonly SERVICEURLKEY;
    private static readonly HEADERS;
    private static readonly REQUESTOPTIONS;
    private serviceUrl;
    private entitySetName;
    private queryString;
    private readLink;
    private headers;
    private requestOptions;
    constructor(params: any, operation: ODataCrudOperation);
    getServiceUrl(): string;
    getEntitySetName(): string;
    getQueryString(): string;
    getReadLink(): string;
    getHeaders(): string;
    getRequestOptions(): string;
    private setServiceUrl;
    private setEntitySetName;
    private setQueryString;
    private setReadLink;
    private setHeaders;
    private setRequestOptions;
}
