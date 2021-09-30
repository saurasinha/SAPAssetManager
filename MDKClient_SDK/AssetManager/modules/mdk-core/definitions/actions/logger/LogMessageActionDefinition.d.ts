import { BaseActionDefinition } from '../BaseActionDefinition';
export declare class LogMessageActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    getMessage(): string;
    getLevel(): string;
}
