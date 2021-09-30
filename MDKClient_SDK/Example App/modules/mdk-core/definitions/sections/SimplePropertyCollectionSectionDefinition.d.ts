import { BaseCollectionSectionDefinition } from './BaseCollectionSectionDefinition';
export declare class SimplePropertyCollectionSectionDefinition extends BaseCollectionSectionDefinition {
    readonly accessoryType: string;
    readonly keyName: string;
    readonly value: string;
    readonly simplePropertyCell: any;
    readonly simplePropertyCells: [Object];
    readonly onPress: string;
    readonly usesExtensionViews: boolean;
    readonly usePreviewMode: boolean;
}
