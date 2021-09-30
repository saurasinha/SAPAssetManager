import { BaseActionDefinition } from '../BaseActionDefinition';
export declare class SetLevelActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    getLevel(): string;
}
