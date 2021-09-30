import { ITargetServiceSpecifier } from '../data/ITargetSpecifier';
import { ObservableArray } from 'tns-core-modules/data/observable-array';
export declare class DataHelper {
    static readFromService(service: ITargetServiceSpecifier): Promise<ObservableArray<any>>;
    static readWithPageSize(service: ITargetServiceSpecifier, pageSize?: number): Promise<{
        Value: ObservableArray<any>;
        nextLink: string;
    }>;
    static getPropertyType(serviceName: string, entitySet: string, propertyName: string): string;
    static isSearchableProperty(target: any, propertyName: string): boolean;
    static isCallFunctionTarget(service: ITargetServiceSpecifier): string | false;
    static isRestServiceTarget(service: ITargetServiceSpecifier): false | {
        Method: string;
        Headers?: {
            key: string;
            value: any;
        };
        Parameters?: {
            key: string;
            value: any;
        };
        Body?: string;
    };
}
