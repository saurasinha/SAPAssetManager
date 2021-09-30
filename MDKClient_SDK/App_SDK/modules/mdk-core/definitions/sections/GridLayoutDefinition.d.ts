import { BaseJSONDefinition } from '../BaseJSONDefinition';
export declare class GridLayoutDefinition extends BaseJSONDefinition {
    private parent;
    constructor(path: any, data: any, parent: BaseJSONDefinition);
    readonly columnWidth: number[];
    readonly columnWidthPercentage: number[];
    readonly spacing: number;
}
