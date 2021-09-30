import { ITargetServiceSpecifier } from './ITargetSpecifier';
export declare abstract class IRestService {
    static setInstance(provider: IRestService): void;
    static instance(): IRestService;
    static isValid(): boolean;
    private static _instance;
    abstract sendRequest(service: ITargetServiceSpecifier): Promise<any>;
}
