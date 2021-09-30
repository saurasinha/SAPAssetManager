import { BaseJSONDefinition } from '../BaseJSONDefinition';
export declare class GridRowItemDefinition extends BaseJSONDefinition {
    private parent;
    constructor(path: any, data: any, parent: BaseJSONDefinition);
    readonly image: string;
    readonly imageSizeAffectsRowHeight: boolean;
    readonly lineBreakMode: string;
    readonly numberOfLines: number;
    readonly style: string;
    readonly text: string;
    readonly textAlignment: string;
    readonly bindTo: string;
}
