"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControl_1 = require("./BaseControl");
var mdk_sap_1 = require("mdk-sap");
var SignatureToolBarCollapseActionViewEvent = (function () {
    function SignatureToolBarCollapseActionViewEvent(container) {
        this.container = container;
    }
    SignatureToolBarCollapseActionViewEvent.prototype.collapseToolBarActionView = function () {
        this.container.collapseToolBarActionView();
    };
    return SignatureToolBarCollapseActionViewEvent;
}());
exports.SignatureToolBarCollapseActionViewEvent = SignatureToolBarCollapseActionViewEvent;
var SignatureCaptureFragmentContainer = (function (_super) {
    __extends(SignatureCaptureFragmentContainer, _super);
    function SignatureCaptureFragmentContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._controls = [];
        return _this;
    }
    SignatureCaptureFragmentContainer.prototype.bind = function () {
        var _this = this;
        return this._createSignatureCaptureFragmentContainerView().then(function (data) {
            _this.backPressedEvent = new SignatureToolBarCollapseActionViewEvent(_this);
            return Promise.resolve();
        });
    };
    SignatureCaptureFragmentContainer.prototype.getBackPressedEvent = function () {
        return this.backPressedEvent;
    };
    SignatureCaptureFragmentContainer.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
    };
    SignatureCaptureFragmentContainer.prototype.viewIsNative = function () {
        return true;
    };
    SignatureCaptureFragmentContainer.prototype.setStyle = function (style) {
        this.sdkStyleClass = style;
    };
    Object.defineProperty(SignatureCaptureFragmentContainer.prototype, "controls", {
        get: function () {
            return this._controls;
        },
        enumerable: true,
        configurable: true
    });
    SignatureCaptureFragmentContainer.prototype.onNavigatedTo = function (initialLoading) {
        this.view().onFragmentContainerLoaded();
    };
    SignatureCaptureFragmentContainer.prototype.onNavigatingFrom = function () {
        this.view().onNavigatingBack();
    };
    SignatureCaptureFragmentContainer.prototype.collapseToolBarActionView = function () {
        this.view().collapseToolBarActionView();
    };
    SignatureCaptureFragmentContainer.prototype._createSignatureCaptureFragmentContainerView = function () {
        var _this = this;
        return this.formcellData.then(function (data) {
            var view = new mdk_sap_1.SignatureCaptureFragmentContainerView(_this.page(), data);
            _this.setView(view);
        });
    };
    Object.defineProperty(SignatureCaptureFragmentContainer.prototype, "formcellData", {
        get: function () {
            return Promise.resolve({
                model: this.definition().data.Model,
            });
        },
        enumerable: true,
        configurable: true
    });
    return SignatureCaptureFragmentContainer;
}(BaseControl_1.BaseControl));
exports.SignatureCaptureFragmentContainer = SignatureCaptureFragmentContainer;
