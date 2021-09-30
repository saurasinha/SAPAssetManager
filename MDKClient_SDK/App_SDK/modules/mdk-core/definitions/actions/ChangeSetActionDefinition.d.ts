import { BaseActionDefinition } from './BaseActionDefinition';
export declare class ChangeSetActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    readonly actions: [string];
}
