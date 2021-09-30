export declare class AttachmentAdapter {
    static addedAttachmentsKey: string;
    static deletedAttachmentsKey: string;
    static contentKey: string;
    static contentTypeKey: string;
    static readLinkKey: string;
    static urlStringKey: string;
    static uriPathKey: string;
    static valueKey: string;
    static toAttachments(data: Map<String, any>): IAttachment[];
    static toAddedAttachment(data: Map<String, any>): IAttachment;
    static toDeletedAttachment(data: Map<String, any>): IAttachment;
    static toData(data: Map<String, any>): Map<String, any>;
    private static _toAttachment;
}
