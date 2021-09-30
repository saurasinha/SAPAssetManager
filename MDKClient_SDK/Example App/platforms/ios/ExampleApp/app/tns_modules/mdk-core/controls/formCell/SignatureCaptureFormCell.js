"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCell_1 = require("./BaseFormCell");
var PageRenderer_1 = require("../../pages/PageRenderer");
var app = require("tns-core-modules/application");
var PageDefinition_1 = require("../../definitions/PageDefinition");
var TabFrame_1 = require("../../pages/TabFrame");
var SignatureCaptureFormCellObservable_1 = require("../../observables/SignatureCaptureFormCellObservable");
var SignatureCaptureFormCell = (function (_super) {
    __extends(SignatureCaptureFormCell, _super);
    function SignatureCaptureFormCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SignatureCaptureFormCell.prototype.androidGetModalFrameTag = function () {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        if (topFrame._dialogFragment) {
            return topFrame._dialogFragment.getTag();
        }
        else {
            return "";
        }
    };
    SignatureCaptureFormCell.prototype.androidCreateSignatureFragmentPage = function (model) {
        if (!app.ios && model) {
            var pageData = {
                Caption: model.caption(),
                Controls: [{
                        Model: model,
                        _Name: 'SignatureCaptureFragmentContainer',
                        _Type: 'Control.Type.SignatureCaptureFragmentContainer',
                    }],
                _Name: 'SignatureCaptureFragment',
                _Type: 'Page',
            };
            PageRenderer_1.PageRenderer.showPageByDefinition(new PageDefinition_1.PageDefinition(null, pageData));
        }
    };
    SignatureCaptureFormCell.prototype.androidCloseSignatureFragmentPage = function () {
        var topFrame = TabFrame_1.TabFrame.getCorrectTopmostFrame();
        var currentPage = topFrame.currentPage;
        if (app.android && currentPage.definition.name === 'SignatureCaptureFragment') {
            topFrame.goBack();
        }
    };
    SignatureCaptureFormCell.prototype.createObservable = function () {
        return new SignatureCaptureFormCellObservable_1.SignatureCaptureFormCellObservable(this, this.definition(), this.page());
    };
    SignatureCaptureFormCell.prototype.setValue = function (value, notify, isTextValue) {
        return Promise.resolve();
    };
    return SignatureCaptureFormCell;
}(BaseFormCell_1.BaseFormCell));
exports.SignatureCaptureFormCell = SignatureCaptureFormCell;
