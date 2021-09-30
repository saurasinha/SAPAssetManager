"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
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
        this._model.data = data;
    };
    return MDKFormCellModel;
}());
exports.MDKFormCellModel = MDKFormCellModel;
var FormCellFactory = (function () {
    function FormCellFactory() {
        if (FormCellFactory._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.FORM_CELL_FACTORY_INSTANTIATION_FAILED);
        }
        FormCellFactory._instance = this;
    }
    FormCellFactory.getInstance = function () {
        return FormCellFactory._instance;
    };
    FormCellFactory.prototype.createAttachmentFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createButtonFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createDateFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createDurationFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createExtensionFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createFilterFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createListPicker = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createNoteFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createSegmentedFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createSignatureCaptureFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createSimplePropertyFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createSorterFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createSwitchFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createTitleFormCell = function (data, callback) {
        return this.createFormCell(data, callback);
    };
    FormCellFactory.prototype.createFormCell = function (data, callback) {
        return new MDKFormCellModel({ data: data, callback: callback });
    };
    FormCellFactory._instance = new FormCellFactory();
    return FormCellFactory;
}());
exports.FormCellFactory = FormCellFactory;
;
