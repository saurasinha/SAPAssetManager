import { ChangeSetManager } from './ChangeSetManager';
export declare enum ODataCrudOperation {
    Create = 0,
    Update = 1,
    Delete = 2,
    Read = 3
}
export declare class BaseODataCruder {
    protected service: string[];
    protected params: string[];
    protected headers: any;
    protected serviceUrl: string;
    protected changeSetManager: ChangeSetManager;
    protected requestOptionsParm: any;
    constructor(params: any);
    getServiceUrl(): string;
    setChangeSetManager(changeSetManager: any): void;
    getDataContext(dataService: any): any;
    private setService;
    private setServiceUrl;
    private setHeaders;
    private setRequestOptions;
}
