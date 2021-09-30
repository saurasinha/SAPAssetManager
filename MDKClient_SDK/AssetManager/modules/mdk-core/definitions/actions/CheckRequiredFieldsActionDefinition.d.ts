import { BaseActionDefinition } from './BaseActionDefinition';
export declare class CheckRequiredFieldsActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    getRequiredFields(): any;
}
