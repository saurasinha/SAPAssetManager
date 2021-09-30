"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var AttachmentAdapter = (function () {
    function AttachmentAdapter() {
    }
    AttachmentAdapter.toAttachments = function (data) {
        var value = data.get(AttachmentAdapter.valueKey);
        var attachments = [];
        if (app.android) {
            for (var i = 0; i < value.length(); i++) {
                attachments.push(AttachmentAdapter._toAttachment(value.get(i)));
            }
        }
        else if (app.ios) {
            for (var j = 0; j < value.count; j++) {
                attachments.push(AttachmentAdapter._toAttachment(value.objectAtIndex(j)));
            }
        }
        else {
            for (var k = 0; k < value.length; k++) {
                attachments.push(AttachmentAdapter._toAttachment(value[k]));
            }
        }
        return attachments;
        ;
    };
    AttachmentAdapter.toAddedAttachment = function (data) {
        return AttachmentAdapter._toAttachment(data.get(AttachmentAdapter.addedAttachmentsKey));
    };
    AttachmentAdapter.toDeletedAttachment = function (data) {
        return AttachmentAdapter._toAttachment(data.get(AttachmentAdapter.deletedAttachmentsKey));
    };
    AttachmentAdapter.toData = function (data) {
        if (app.android) {
            return data.get(AttachmentAdapter.valueKey);
        }
        else {
            return data;
        }
    };
    AttachmentAdapter._toAttachment = function (nativeAttachment) {
        var attachment = {};
        if (nativeAttachment) {
            attachment.nativeAttachment = nativeAttachment;
            if (app.android) {
                attachment[AttachmentAdapter.contentKey] = nativeAttachment.get(AttachmentAdapter.contentKey);
                attachment[AttachmentAdapter.contentTypeKey] = nativeAttachment.get(AttachmentAdapter.contentTypeKey);
                attachment[AttachmentAdapter.readLinkKey] = nativeAttachment.optString(AttachmentAdapter.readLinkKey, '');
                attachment[AttachmentAdapter.urlStringKey] = nativeAttachment.get(AttachmentAdapter.urlStringKey);
                attachment[AttachmentAdapter.uriPathKey] = nativeAttachment.get(AttachmentAdapter.uriPathKey);
            }
            else if (app.ios) {
                attachment[AttachmentAdapter.contentKey] = nativeAttachment.objectForKey(AttachmentAdapter.contentKey);
                attachment[AttachmentAdapter.contentTypeKey] = nativeAttachment.objectForKey(AttachmentAdapter.contentTypeKey);
                attachment[AttachmentAdapter.readLinkKey] = nativeAttachment.objectForKey(AttachmentAdapter.readLinkKey);
                attachment[AttachmentAdapter.urlStringKey] = nativeAttachment.objectForKey(AttachmentAdapter.urlStringKey);
            }
            else {
                attachment[AttachmentAdapter.contentKey] = nativeAttachment[AttachmentAdapter.contentKey];
                attachment[AttachmentAdapter.contentTypeKey] = nativeAttachment[AttachmentAdapter.contentTypeKey];
                attachment[AttachmentAdapter.readLinkKey] = nativeAttachment[AttachmentAdapter.readLinkKey];
                attachment[AttachmentAdapter.urlStringKey] = nativeAttachment[AttachmentAdapter.urlStringKey];
            }
            return attachment;
        }
        return undefined;
    };
    AttachmentAdapter.addedAttachmentsKey = 'AddedAttachments';
    AttachmentAdapter.deletedAttachmentsKey = 'DeletedAttachments';
    AttachmentAdapter.contentKey = 'content';
    AttachmentAdapter.contentTypeKey = 'contentType';
    AttachmentAdapter.readLinkKey = 'readLink';
    AttachmentAdapter.urlStringKey = 'urlString';
    AttachmentAdapter.uriPathKey = 'uriPath';
    AttachmentAdapter.valueKey = 'Value';
    return AttachmentAdapter;
}());
exports.AttachmentAdapter = AttachmentAdapter;
