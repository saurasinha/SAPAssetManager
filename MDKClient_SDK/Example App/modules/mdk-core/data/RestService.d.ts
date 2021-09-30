import { IRestService } from './IRestService';
import { ITargetServiceSpecifier } from './ITargetSpecifier';
export declare class RestService extends IRestService {
    private readonly _restServiceBridge;
    constructor();
    sendRequest(service: ITargetServiceSpecifier): Promise<any>;
    private getAdjustedPath;
}
