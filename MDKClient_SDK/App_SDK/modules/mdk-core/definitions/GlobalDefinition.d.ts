import { BaseJSONDefinition } from './BaseJSONDefinition';
export declare class GlobalDefinition extends BaseJSONDefinition {
    static globalType: {
        Boolean: string;
        Number: string;
        String: string;
    };
    constructor(path: any, data: any);
    getType(): any;
    getValue(): any;
}
