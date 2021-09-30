import { BaseControlDefinition } from './BaseControlDefinition';
export declare class FlexibleColumnLayoutDefinition extends BaseControlDefinition {
    private startColumn;
    private endColumn;
    constructor(path: any, data: any, parent: any);
    getStartColumn(): any;
    getEndColumn(): any;
}
