import { BaseActionDefinition } from './BaseActionDefinition';
export declare class SetRegionActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    getRegion(): string;
}
