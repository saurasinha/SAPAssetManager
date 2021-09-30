import { BaseFormCellObservable } from './BaseFormCellObservable';
import { BaseControlDefinition } from '../definitions/controls/BaseControlDefinition';
import { IControl } from '../controls/IControl';
import { Page, View } from 'tns-core-modules/ui/page/page';
export declare class AttachmentFormCellObservable extends BaseFormCellObservable {
    constructor(control: IControl, definition: BaseControlDefinition, page: Page);
    bindValue(data: any): Promise<any>;
    cellValueChange(platformSpecificData: Map<String, any>): Promise<any>;
    onPress(cell: any, view: View): void;
    setAttachmentTitle(title: string): void;
    setAttachmentAddTitle(title: string): void;
    setAttachmentCancelTitle(title: string): void;
    setAllowedFileTypes(fileTypes: string[]): void;
    setAttachmentActionType(actionType: string[]): void;
    private _addDeletedAttachment;
    private _addNewAttachment;
    private _deleteAttachmentFromAddQueue;
    private _isExistingAttachment;
    private _processDeletedAttachments;
    private _processNewAttachments;
}
