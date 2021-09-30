import { ITargetServiceSpecifier } from '../../../data/ITargetSpecifier';
import { UniqueIdType } from '../../../common/UniqueIdType';
export declare class TargetServiceBuilder {
    static fromDefinition(data: any): ITargetServiceSpecifier;
    private _entitySet;
    private _function;
    private _keyProperties;
    private _offlineEnabled;
    private _properties;
    private _queryOptions;
    private _readLink;
    private _editLink;
    private _serviceName;
    private _uniqueTypeId;
    private _requestOptions;
    private _statefulService;
    private _headers;
    private _serverSidePaging;
    private _requestProperties;
    private _path;
    private _outputPath;
    build(): ITargetServiceSpecifier;
    entitySet(entitySet: string): TargetServiceBuilder;
    function(oFunction: {
        Name: string;
        Parameters?: {
            key: string;
            value: any;
        };
    }): TargetServiceBuilder;
    keyProperties(keyProperties: string[]): TargetServiceBuilder;
    properties(properties: string[] | {
        key: string;
        value: any;
    }): TargetServiceBuilder;
    queryOptions(queryOptions: string): TargetServiceBuilder;
    readLink(readLink: string): TargetServiceBuilder;
    editLink(editLink: string): TargetServiceBuilder;
    serviceName(serviceName: string): TargetServiceBuilder;
    uniqueTypeId(uniqueTypeId: UniqueIdType): TargetServiceBuilder;
    requestOptions(requestOptions: any): TargetServiceBuilder;
    headers(headers: any): TargetServiceBuilder;
    serverSidePaging(serverSidePaging: boolean): TargetServiceBuilder;
    requestProperties(requestProperties: any): TargetServiceBuilder;
    path(path: string): TargetServiceBuilder;
    outputPath(outputPath: string): TargetServiceBuilder;
    private _valid;
}
