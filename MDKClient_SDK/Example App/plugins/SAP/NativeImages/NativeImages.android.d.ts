import { ImageSource } from 'tns-core-modules/image-source';
export declare class NativeImages {
    private static _instance;
    static getInstance(): NativeImages;
    getIconTextImage(text: string, imageWidth: number, imageHeight: number, stylesJSON?: string, scale?: number): any;
    getCircularImage(imageSource: ImageSource): any;
}
