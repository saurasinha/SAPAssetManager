import { BaseJSONDefinition } from '../BaseJSONDefinition';
export declare class CollectionLayoutDefinition extends BaseJSONDefinition {
    private parent;
    constructor(path: any, data: any, parent: any);
    readonly numberOfColumns: number;
    readonly minimumInteritemSpacing: number;
    readonly layoutType: string;
}
