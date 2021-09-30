"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataConverter_1 = require("../../Common/DataConverter");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var trace_1 = require("tns-core-modules/trace");
var app = require("tns-core-modules/application");
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
        this._model.redraw(DataConverter_1.DataConverter.toJavaObject(data));
    };
    MDKFormCellModel.prototype.hideLazyLoadingIndicator = function () {
        this._model.hideLazyLoadingIndicator();
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
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.AttachmentModel);
    };
    FormCellFactory.prototype.createButtonFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.ButtonModel);
    };
    FormCellFactory.prototype.createDateFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.DateTimeModel);
    };
    FormCellFactory.prototype.createDurationFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.DurationModel);
    };
    FormCellFactory.prototype.createExtensionFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.ExtensionModel);
    };
    FormCellFactory.prototype.createFilterFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.FilterModel);
    };
    FormCellFactory.prototype.createListPicker = function (data, callback) {
        if (!!data.UsesObjectCells) {
            return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.ObjectCellListPickerModel);
        }
        else {
            return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.TextListPickerModel);
        }
    };
    FormCellFactory.prototype.createNoteFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.NoteModel);
    };
    FormCellFactory.prototype.createSegmentedFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.SegmentedModel);
    };
    FormCellFactory.prototype.createSignatureCaptureFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.SignatureCaptureModel);
    };
    FormCellFactory.prototype.createSimplePropertyFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.SimplePropertyModel);
    };
    FormCellFactory.prototype.createSorterFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.SorterModel);
    };
    FormCellFactory.prototype.createSwitchFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.SwitchModel);
    };
    FormCellFactory.prototype.createTitleFormCell = function (data, callback) {
        return this.createFormCell(data, callback, com.sap.mdk.client.ui.fiori.formCell.models.TitleModel);
    };
    FormCellFactory.prototype.createFormCell = function (data, callback, nativeClass) {
        try {
            var nativeCallback = new com.sap.mdk.client.ui.fiori.formCell.models.IFormCellCallback({
                getView: function () {
                    return callback.getView();
                },
                loadMoreItems: function () {
                    callback.loadMoreItems();
                },
                onPress: function (row, view) {
                    callback.onPress(row, view);
                },
                searchUpdated: function (searchText) {
                    callback.searchUpdated(searchText);
                },
                valueChanged: function (value) {
                    var map = new Map();
                    map.set('Value', DataConverter_1.DataConverter.toJavaScriptValue(value));
                    callback.cellValueChange(map);
                },
            });
            var model_1 = new nativeClass(DataConverter_1.DataConverter.toJavaObject(data), nativeCallback);
            if (nativeClass === com.sap.mdk.client.ui.fiori.formCell.models.ObjectCellListPickerModel
                || nativeClass === com.sap.mdk.client.ui.fiori.formCell.models.TextListPickerModel) {
                var nativeListPickerCallback = new com.sap.mdk.client.ui.fiori.formCell.models.IListPickerFormCellCallback({
                    closeListPickerFragmentPage: function () {
                        callback.androidCloseListPickerFragmentPage();
                    },
                    createListPickerFragmentPage: function () {
                        callback.androidCreateListPickerFragmentPage(model_1);
                    },
                    getForegroundActivity: function () {
                        return app.android.foregroundActivity;
                    },
                    getModalFrameTag: function () {
                        return callback.androidGetModalFrameTag();
                    },
                    refreshForSelections: function (value) {
                        var map = new Map();
                        map.set('Value', DataConverter_1.DataConverter.toJavaScriptValue(value));
                        callback.androidRefreshForSelections(map);
                    },
                    updateActionViewExpandedStatus: function (isActive) {
                        callback.androidUpdateActionViewExpandedStatus(isActive);
                    },
                });
                model_1._listPickerCallback = nativeListPickerCallback;
            }
            if (nativeClass === com.sap.mdk.client.ui.fiori.formCell.models.SignatureCaptureModel) {
                var nativeSignatureCallback = new com.sap.mdk.client.ui.fiori.formCell.models.ISignatureCaptureFormCellCallback({
                    getForegroundActivity: function () {
                        return app.android.foregroundActivity;
                    },
                    getModalFrameTag: function () {
                        return callback.androidGetModalFrameTag();
                    },
                    createSignatureCaptureFragmentPage: function () {
                        callback.androidCreateSignatureFragmentPage(model_1);
                    },
                    closeSignatureCaptureFragmentPage: function () {
                        callback.androidCloseSignatureFragmentPage(model_1);
                    }
                });
                model_1._signatureCallback = nativeSignatureCallback;
            }
            return new MDKFormCellModel(model_1);
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
            throw error;
        }
    };
    FormCellFactory._instance = new FormCellFactory();
    return FormCellFactory;
}());
exports.FormCellFactory = FormCellFactory;
;
