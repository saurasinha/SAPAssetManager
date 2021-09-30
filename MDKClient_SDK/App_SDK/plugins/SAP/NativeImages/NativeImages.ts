import { ImageSource } from 'tns-core-modules/image-source';
export declare class NativeImages {
    static getInstance(): NativeImages;
    public getIconTextImage(iconText: any, imageWidth: number, imageHeight: number, stylesJSON?: string, scale?: number): any;
    public getCircularImage(imageSource: ImageSource): any;
}