import { BaseCollectionSectionDefinition } from './BaseCollectionSectionDefinition';
export declare class ImageCollectionSectionDefinition extends BaseCollectionSectionDefinition {
    readonly title: string;
    readonly subtitle: string;
    readonly attribute: string;
    readonly image: string;
    readonly imageIsCircular: boolean;
    readonly imageCell: any;
    readonly imageCells: [Object];
    readonly onPress: string;
    readonly usesExtensionViews: boolean;
}
