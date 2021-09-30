import { BaseActionDefinition } from './BaseActionDefinition';
export declare class DataServiceActionDefinition extends BaseActionDefinition {
    getService(): string;
    protected readonly service: string;
}
