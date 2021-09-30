"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var view_1 = require("tns-core-modules/ui/core/view");
var trace_1 = require("tns-core-modules/trace");
var SignatureCaptureFragmentContainerView = (function (_super) {
    __extends(SignatureCaptureFragmentContainerView, _super);
    function SignatureCaptureFragmentContainerView(page, params) {
        var _this = _super.call(this) || this;
        _this._signatureFragmentContainerBridge = new com.sap.mdk.client.ui.fiori.formCell.SignatureCaptureFragmentContainer();
        _this._signatureCaptureModel = params.model;
        trace_1.write("Container params in createWithParams: " + _this._containerParams, 'mdk.trace.ui', trace_1.messageType.log);
        return _this;
    }
    SignatureCaptureFragmentContainerView.prototype.createNativeView = function () {
        try {
            var parent_1 = this.parent.android;
            trace_1.write("Container params in createNativeView: " + this._containerParams, 'mdk.trace.ui', trace_1.messageType.log);
            return this._signatureFragmentContainerBridge.create(this._signatureCaptureModel, this._context, parent_1);
        }
        catch (error) {
            trace_1.write(error, 'mdk.trace.ui', trace_1.messageType.error);
        }
    };
    SignatureCaptureFragmentContainerView.prototype.disposeNativeView = function () {
        if (this.nativeView) {
            this.nativeView.owner = null;
        }
        _super.prototype.disposeNativeView.call(this);
    };
    SignatureCaptureFragmentContainerView.prototype.initNativeView = function () {
        this.nativeView.owner = this;
        _super.prototype.initNativeView.call(this);
    };
    SignatureCaptureFragmentContainerView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
    };
    SignatureCaptureFragmentContainerView.prototype.onFragmentContainerLoaded = function () {
        this._signatureFragmentContainerBridge.onFragmentContainerLoaded();
    };
    SignatureCaptureFragmentContainerView.prototype.onNavigatingBack = function () {
        this._signatureFragmentContainerBridge.onNavigatingBack();
    };
    SignatureCaptureFragmentContainerView.prototype.collapseToolBarActionView = function () {
        this._signatureFragmentContainerBridge.collapseToolBarActionView();
    };
    return SignatureCaptureFragmentContainerView;
}(view_1.View));
exports.SignatureCaptureFragmentContainerView = SignatureCaptureFragmentContainerView;
;
