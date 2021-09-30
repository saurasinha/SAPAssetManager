import { BaseSectionDefinition } from './BaseSectionDefinition';
import { CollectionLayoutDefinition } from './CollectionLayoutDefinition';
export declare class BaseCollectionSectionDefinition extends BaseSectionDefinition {
    private _collectionLayoutDefinition;
    constructor(path: any, data: any, parent: any);
    readonly collectionLayoutDefinition: CollectionLayoutDefinition;
}
