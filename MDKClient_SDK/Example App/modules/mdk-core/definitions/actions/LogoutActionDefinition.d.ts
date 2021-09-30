import { BaseActionDefinition } from './BaseActionDefinition';
export declare class LogoutActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    getSkipReset(): string | boolean;
}
