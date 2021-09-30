import { FormCellDataBuilder } from './FormCellDataBuilder';
import { BaseControlDefinition } from '../../../definitions/controls/BaseControlDefinition';
import { IContext } from '../../../context/IContext';
export declare class AttachmentDataBuilder extends FormCellDataBuilder {
    constructor(context: IContext, definition: BaseControlDefinition);
    deleteAttachment(attachment: IAttachment): any;
    setActionType(actionType: string[]): this;
    setAddTitle(title: string): this;
    setAttachments(attachments: any): this;
    setCancelTitle(title: string): this;
    setTitle(title: string): this;
    setAllowedFileTypes(fileTypes: string[]): this;
}
