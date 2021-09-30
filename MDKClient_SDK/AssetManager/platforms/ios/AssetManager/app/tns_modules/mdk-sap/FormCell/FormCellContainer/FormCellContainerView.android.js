"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataConverter_1 = require("../../Common/DataConverter");
var Util_1 = require("../../Common/Util");
var view_1 = require("tns-core-modules/ui/core/view");
var trace_1 = require("tns-core-modules/trace");
var FormCellContainerView = (function (_super) {
    __extends(FormCellContainerView, _super);
    function FormCellContainerView(page, containerCallback, params) {
        var _this = _super.call(this) || this;
        _this._formCellContainerBridge = new com.sap.mdk.client.ui.fiori.formCell.FormCellContainer();
        if (!params.numberOfRowsInSection || !params.numberOfSections || !params.sectionNames) {
            throw new Error('FormCellContainerManager.android.createWithParams() invalid parameters');
        }
        _this._containerCallback = containerCallback;
        _this._containerParams = new org.json.JSONObject();
        _this._containerParams.put('numberOfSections', params.numberOfSections);
        _this._containerParams.put('numberOfRowsInSection', DataConverter_1.DataConverter.toJavaArray(params.numberOfRowsInSection));
        _this._containerParams.put('sectionNames', DataConverter_1.DataConverter.toJavaArray(params.sectionNames));
        trace_1.write("Container params in createWithParams: " + _this._containerParams, 'mdk.trace.ui', trace_1.messageType.log);
        return _this;
    }
    FormCellContainerView.prototype.addFormCell = function (formCellDefinition) {
        if (formCellDefinition != null) {
            this._formCellContainerBridge.addFormCell(formCellDefinition.model);
        }
    };
    FormCellContainerView.prototype.createNativeView = function () {
        try {
            var parent_1 = this.parent.android;
            trace_1.write("Container params in createNativeView: " + this._containerParams, 'mdk.trace.ui', trace_1.messageType.log);
            return this._formCellContainerBridge.create(this._containerParams, this._context, parent_1);
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    FormCellContainerView.prototype.disposeNativeView = function () {
        this._formCellContainerBridge = null;
        if (this.nativeView) {
            this.nativeView.owner = null;
        }
        _super.prototype.disposeNativeView.call(this);
    };
    FormCellContainerView.prototype.initNativeView = function () {
        this.nativeView.owner = this;
        _super.prototype.initNativeView.call(this);
    };
    FormCellContainerView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this._containerCallback.onLoaded();
    };
    FormCellContainerView.prototype.updateCell = function (data, row, section) {
    };
    FormCellContainerView.prototype.updateCells = function (data, style) {
        this._formCellContainerBridge.redraw(this.nativeView, style);
    };
    FormCellContainerView.prototype.setFocus = function (row, section, keyboardVisibility) {
        this._formCellContainerBridge.setFocus(row, section, Util_1.Util.toSoftKeyboardType(keyboardVisibility));
    };
    FormCellContainerView.prototype.hideLazyLoadingIndicator = function (row, section) {
    };
    FormCellContainerView.prototype.setInEmbeddedFrame = function (embedded) {
    };
    return FormCellContainerView;
}(view_1.View));
exports.FormCellContainerView = FormCellContainerView;
;
