import { BaseActionDefinition } from '../BaseActionDefinition';
export declare class SetStateActionDefinition extends BaseActionDefinition {
    constructor(path: string, data: any);
    getLoggerState(): string;
    getLogFileName(): string;
    getMaxFileSize(): string;
}
