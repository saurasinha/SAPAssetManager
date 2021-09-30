import { BaseDefinition } from './BaseDefinition';
export declare class BaseJSONDefinition extends BaseDefinition {
    static controlIdNumber: number;
    private _data;
    constructor(path: any, data: any);
    readonly name: string;
    readonly data: any;
    getName(): string;
}
