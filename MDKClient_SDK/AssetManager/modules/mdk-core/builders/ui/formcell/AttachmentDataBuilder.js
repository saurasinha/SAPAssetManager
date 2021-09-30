"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormCellDataBuilder_1 = require("./FormCellDataBuilder");
var BaseControlDefinition_1 = require("../../../definitions/controls/BaseControlDefinition");
var AttachmentDataBuilder = (function (_super) {
    __extends(AttachmentDataBuilder, _super);
    function AttachmentDataBuilder(context, definition) {
        var _this = _super.call(this, context, definition) || this;
        _this.data._Type = BaseControlDefinition_1.BaseControlDefinition.type.FormCellAttachment;
        _this.doNotResolveKeys = {
            Value: false,
        };
        return _this;
    }
    AttachmentDataBuilder.prototype.deleteAttachment = function (attachment) {
        var readLink = attachment.readLink;
        var attachements = this.builtData.Value;
        if (Array.isArray(attachements)) {
            attachements = attachements.filter(function (attachmentEntry) {
                if (typeof attachmentEntry === 'object' && attachmentEntry.readLink && attachmentEntry.readLink === readLink) {
                    return false;
                }
                return true;
            });
            this.setAttachments(attachements);
        }
    };
    AttachmentDataBuilder.prototype.setActionType = function (actionType) {
        this.builtData.AttachmentActionType = actionType;
        return this;
    };
    AttachmentDataBuilder.prototype.setAddTitle = function (title) {
        this.builtData.AttachmentAddTitle = title;
        return this;
    };
    AttachmentDataBuilder.prototype.setAttachments = function (attachments) {
        this.setValue(attachments);
        return this;
    };
    AttachmentDataBuilder.prototype.setCancelTitle = function (title) {
        this.builtData.AttachmentCancelTitle = title;
        return this;
    };
    AttachmentDataBuilder.prototype.setTitle = function (title) {
        this.builtData.AttachmentTitle = title;
        return this;
    };
    AttachmentDataBuilder.prototype.setAllowedFileTypes = function (fileTypes) {
        this.builtData.AllowedFileTypes = fileTypes;
        return this;
    };
    return AttachmentDataBuilder;
}(FormCellDataBuilder_1.FormCellDataBuilder));
exports.AttachmentDataBuilder = AttachmentDataBuilder;
