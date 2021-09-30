"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCellObservable_1 = require("./BaseFormCellObservable");
var AttachmentAdapter_1 = require("../utils/AttachmentAdapter");
var Application_1 = require("../Application");
var app = require("tns-core-modules/application");
var AttachmentFormCellObservable = (function (_super) {
    __extends(AttachmentFormCellObservable, _super);
    function AttachmentFormCellObservable(control, definition, page) {
        var _this = _super.call(this, control, definition, page) || this;
        _this.context.clientData[AttachmentAdapter_1.AttachmentAdapter.addedAttachmentsKey] = [];
        _this.context.clientData[AttachmentAdapter_1.AttachmentAdapter.deletedAttachmentsKey] = [];
        return _this;
    }
    AttachmentFormCellObservable.prototype.bindValue = function (data) {
        if (!this._control || !this._control.definition()) {
            throw new Error('AttachmentFormCellObservable.bindValue invalid call missing required data');
        }
        if (data.Value !== undefined && data.Value !== null) {
            this.setValue(data.Value, false);
        }
        if (!data.Value) {
            this.setValue([], false);
        }
        if (!data.AllowedFileTypes) {
            this.setAllowedFileTypes([]);
        }
        return Promise.resolve(data);
    };
    AttachmentFormCellObservable.prototype.cellValueChange = function (platformSpecificData) {
        var _this = this;
        var data = AttachmentAdapter_1.AttachmentAdapter.toData(platformSpecificData);
        this._processDeletedAttachments(data);
        this._processNewAttachments(data);
        if (app.android || app.ios) {
            return _super.prototype.setValue.call(this, AttachmentAdapter_1.AttachmentAdapter.toAttachments(data), true, true).then(function () {
                _this._control.updateFormCellModel(false);
            });
        }
        else {
            return _super.prototype.setValue.call(this, this.context.clientData[AttachmentAdapter_1.AttachmentAdapter.addedAttachmentsKey], true, true).then(function () {
                _this._control.updateFormCellModel(false);
            });
        }
    };
    AttachmentFormCellObservable.prototype.onPress = function (cell, view) {
        Application_1.Application.setNonNSActivityDone(true);
    };
    AttachmentFormCellObservable.prototype.setAttachmentTitle = function (title) {
        var builder = this.builder;
        builder.setTitle(title);
    };
    AttachmentFormCellObservable.prototype.setAttachmentAddTitle = function (title) {
        var builder = this.builder;
        builder.setAddTitle(title);
    };
    AttachmentFormCellObservable.prototype.setAttachmentCancelTitle = function (title) {
        var builder = this.builder;
        builder.setCancelTitle(title);
    };
    AttachmentFormCellObservable.prototype.setAllowedFileTypes = function (fileTypes) {
        var builder = this.builder;
        builder.setAllowedFileTypes(fileTypes);
    };
    AttachmentFormCellObservable.prototype.setAttachmentActionType = function (actionType) {
        var builder = this.builder;
        builder.setActionType(actionType);
    };
    AttachmentFormCellObservable.prototype._addDeletedAttachment = function (deletedAttachment) {
        var deletedAttachments = this.context.clientData[AttachmentAdapter_1.AttachmentAdapter.deletedAttachmentsKey];
        deletedAttachments.push(deletedAttachment);
        return deletedAttachments;
    };
    AttachmentFormCellObservable.prototype._addNewAttachment = function (attachment) {
        if (!this._isExistingAttachment(attachment)) {
            var addedAttachments = this.context.clientData[AttachmentAdapter_1.AttachmentAdapter.addedAttachmentsKey];
            if (app.android || app.ios) {
                addedAttachments.push(attachment);
            }
            else {
                addedAttachments = addedAttachments.concat(attachment.nativeAttachment);
            }
            this.context.clientData[AttachmentAdapter_1.AttachmentAdapter.addedAttachmentsKey] = addedAttachments;
        }
    };
    AttachmentFormCellObservable.prototype._deleteAttachmentFromAddQueue = function (deletedAttachment) {
        var deletedUrl = deletedAttachment.urlString;
        var addedAttachments = this.context.clientData[AttachmentAdapter_1.AttachmentAdapter.addedAttachmentsKey];
        addedAttachments = addedAttachments.filter(function (addedAttachment) {
            return deletedUrl !== addedAttachment.urlString;
        });
        return addedAttachments;
    };
    AttachmentFormCellObservable.prototype._isExistingAttachment = function (attachment) {
        if (!attachment.readLink) {
            return false;
        }
        return attachment.readLink && attachment.readLink.length !== 0;
    };
    AttachmentFormCellObservable.prototype._processDeletedAttachments = function (data) {
        var deletedAttachment = AttachmentAdapter_1.AttachmentAdapter.toDeletedAttachment(data);
        var addedAttachments;
        if (deletedAttachment) {
            if (this._isExistingAttachment(deletedAttachment)) {
                var deletedAttachments = this._addDeletedAttachment(deletedAttachment);
                this.context.clientData[AttachmentAdapter_1.AttachmentAdapter.deletedAttachmentsKey] = deletedAttachments;
                var builder = this.builder;
                builder.deleteAttachment(deletedAttachment);
            }
            else {
                if (app.android || app.ios) {
                    addedAttachments = this._deleteAttachmentFromAddQueue(deletedAttachment);
                }
                else {
                    addedAttachments = this._deleteAttachmentFromAddQueue(deletedAttachment.nativeAttachment[0]);
                }
                this.context.clientData[AttachmentAdapter_1.AttachmentAdapter.addedAttachmentsKey] = addedAttachments;
            }
        }
    };
    AttachmentFormCellObservable.prototype._processNewAttachments = function (data) {
        var addedAttachment = AttachmentAdapter_1.AttachmentAdapter.toAddedAttachment(data);
        if (addedAttachment) {
            this._addNewAttachment(addedAttachment);
        }
    };
    return AttachmentFormCellObservable;
}(BaseFormCellObservable_1.BaseFormCellObservable));
exports.AttachmentFormCellObservable = AttachmentFormCellObservable;
