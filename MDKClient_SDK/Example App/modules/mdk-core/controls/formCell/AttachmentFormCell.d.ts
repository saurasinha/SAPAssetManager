import { BaseFormCell } from './BaseFormCell';
import { AttachmentFormCellObservable } from '../../observables/AttachmentFormCellObservable';
export declare class AttachmentFormCell extends BaseFormCell {
    setAttachmentTitle(title: string): void;
    setAttachmentAddTitle(addTitle: string): void;
    setAttachmentCancelTitle(cancelTitle: string): void;
    setAttachmentActionType(actionType: [string]): void;
    setAllowedFileTypes(fileType: [string]): void;
    protected createObservable(): AttachmentFormCellObservable;
}
