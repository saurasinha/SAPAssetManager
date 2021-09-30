import { IClientAPI } from './IClientAPI';
import { IContext, IClientAPIProps, IClientData } from './IContext';
import { ExecuteSource } from '../common/ExecuteSource';
export declare class Context implements IContext {
    binding?: any;
    element?: any;
    static fromPage(source?: ExecuteSource): IContext;
    private static _launchContext;
    clientAPIProps: IClientAPIProps;
    private _clientData;
    private _clientAPI;
    constructor(binding?: any, element?: any);
    resetClientAPIProps(): void;
    readonly clientData: IClientData;
    readonly clientAPI: IClientAPI;
    readonly readLink: string;
}
