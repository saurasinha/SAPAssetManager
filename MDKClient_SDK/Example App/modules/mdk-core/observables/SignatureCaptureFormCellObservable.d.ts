import { BaseFormCellObservable } from './BaseFormCellObservable';
export declare class SignatureCaptureFormCellObservable extends BaseFormCellObservable {
    androidGetModalFrameTag(): string;
    androidCreateSignatureFragmentPage(model: any): void;
    androidCloseSignatureFragmentPage(): void;
    cellValueChange(platformSpecificData: Map<String, any>): Promise<any>;
    private toImageObject;
}
