import { ImageSource } from 'tns-core-modules/image-source';
export declare class NativeImages {
    private static _instance;
    private convertHexToRGB;
    static getInstance(): NativeImages;
    getCircularImage(imageSource: ImageSource): UIImage;
    getIconTextImage(iconText: any, imageWidth: number, imageHeight: number, stylesJSON?: string, scale?: number): UIImage;
}
