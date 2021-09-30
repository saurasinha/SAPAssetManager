import { BaseFormCell } from "./BaseFormCell";
import { SignatureCaptureFormCellObservable } from '../../observables/SignatureCaptureFormCellObservable';
export declare class SignatureCaptureFormCell extends BaseFormCell {
    androidGetModalFrameTag(): string;
    androidCreateSignatureFragmentPage(model: any): void;
    androidCloseSignatureFragmentPage(): void;
    protected createObservable(): SignatureCaptureFormCellObservable;
    setValue(value: any, notify: boolean, isTextValue?: boolean): Promise<any>;
}
