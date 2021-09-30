"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCell_1 = require("./BaseFormCell");
var AttachmentFormCellObservable_1 = require("../../observables/AttachmentFormCellObservable");
var AttachmentFormCell = (function (_super) {
    __extends(AttachmentFormCell, _super);
    function AttachmentFormCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AttachmentFormCell.prototype.setAttachmentTitle = function (title) {
        var observable = this.observable();
        observable.setAttachmentTitle(title);
    };
    AttachmentFormCell.prototype.setAttachmentAddTitle = function (addTitle) {
        var observable = this.observable();
        observable.setAttachmentAddTitle(addTitle);
    };
    AttachmentFormCell.prototype.setAttachmentCancelTitle = function (cancelTitle) {
        var observable = this.observable();
        observable.setAttachmentCancelTitle(cancelTitle);
    };
    AttachmentFormCell.prototype.setAttachmentActionType = function (actionType) {
        var observable = this.observable();
        observable.setAttachmentActionType(actionType);
    };
    AttachmentFormCell.prototype.setAllowedFileTypes = function (fileType) {
        var observable = this.observable();
        observable.setAllowedFileTypes(fileType);
    };
    AttachmentFormCell.prototype.createObservable = function () {
        return new AttachmentFormCellObservable_1.AttachmentFormCellObservable(this, this.definition(), this.page());
    };
    return AttachmentFormCell;
}(BaseFormCell_1.BaseFormCell));
exports.AttachmentFormCell = AttachmentFormCell;
