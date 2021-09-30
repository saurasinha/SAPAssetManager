"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MDKFormCellModel = (function () {
    function MDKFormCellModel(model) {
        this._model = model;
    }
    Object.defineProperty(MDKFormCellModel.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: true,
        configurable: true
    });
    MDKFormCellModel.prototype.update = function (data) {
    };
    MDKFormCellModel.prototype.hideLazyLoadingIndicator = function () {
    };
    return MDKFormCellModel;
}());
exports.MDKFormCellModel = MDKFormCellModel;
var FormCellFactory = (function () {
    function FormCellFactory() {
    }
    FormCellFactory.getInstance = function () {
        return null;
    };
    FormCellFactory.prototype.createAttachmentFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createButtonFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createDateFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createDurationFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createExtensionFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createFilterFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createListPicker = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createNoteFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createSegmentedFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createSignatureCaptureFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createSimplePropertyFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createSorterFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createSwitchFormCell = function (data, callback) {
        return undefined;
    };
    FormCellFactory.prototype.createTitleFormCell = function (data, callback) {
        return undefined;
    };
    return FormCellFactory;
}());
exports.FormCellFactory = FormCellFactory;
;
