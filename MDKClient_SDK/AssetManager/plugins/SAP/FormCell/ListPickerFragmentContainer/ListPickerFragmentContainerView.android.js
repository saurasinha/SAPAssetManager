"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var trace_1 = require("tns-core-modules/trace");
var ListPickerFragmentContainerView = (function (_super) {
    __extends(ListPickerFragmentContainerView, _super);
    function ListPickerFragmentContainerView(page, params) {
        var _this = _super.call(this) || this;
        _this._listPickerFragmentContainerBridge = new com.sap.mdk.client.ui.fiori.formCell.ListPickerFragmentContainer();
        _this._listPickerModel = params.model;
        trace_1.write("Container params in createWithParams: " + _this._containerParams, 'mdk.trace.ui', trace_1.messageType.log);
        return _this;
    }
    ListPickerFragmentContainerView.prototype.createNativeView = function () {
        try {
            var parent_1 = this.parent.android;
            trace_1.write("Container params in createNativeView: " + this._containerParams, 'mdk.trace.ui', trace_1.messageType.log);
            return this._listPickerFragmentContainerBridge.create(this._listPickerModel, this._context, parent_1);
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    ListPickerFragmentContainerView.prototype.disposeNativeView = function () {
        if (this.nativeView) {
            this.nativeView.owner = null;
        }
        _super.prototype.disposeNativeView.call(this);
    };
    ListPickerFragmentContainerView.prototype.initNativeView = function () {
        this.nativeView.owner = this;
        _super.prototype.initNativeView.call(this);
    };
    ListPickerFragmentContainerView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
    };
    ListPickerFragmentContainerView.prototype.onFragmentContainerLoaded = function () {
        this._listPickerFragmentContainerBridge.onFragmentContainerLoaded();
    };
    ListPickerFragmentContainerView.prototype.onNavigatingBack = function () {
        this._listPickerFragmentContainerBridge.onNavigatingBack();
    };
    ListPickerFragmentContainerView.prototype.collapseToolBarActionView = function () {
        this._listPickerFragmentContainerBridge.collapseToolBarActionView();
    };
    return ListPickerFragmentContainerView;
}(view_1.View));
exports.ListPickerFragmentContainerView = ListPickerFragmentContainerView;
;
