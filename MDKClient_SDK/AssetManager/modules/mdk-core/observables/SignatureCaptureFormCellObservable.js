"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCellObservable_1 = require("./BaseFormCellObservable");
var app = require("tns-core-modules/application");
var SignatureCaptureFormCellObservable = (function (_super) {
    __extends(SignatureCaptureFormCellObservable, _super);
    function SignatureCaptureFormCellObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SignatureCaptureFormCellObservable.prototype.androidGetModalFrameTag = function () {
        return this.control.androidGetModalFrameTag();
    };
    SignatureCaptureFormCellObservable.prototype.androidCreateSignatureFragmentPage = function (model) {
        return this.control.androidCreateSignatureFragmentPage(model);
    };
    SignatureCaptureFormCellObservable.prototype.androidCloseSignatureFragmentPage = function () {
        return this.control.androidCloseSignatureFragmentPage();
    };
    SignatureCaptureFormCellObservable.prototype.cellValueChange = function (platformSpecificData) {
        var _this = this;
        return _super.prototype.setValue.call(this, this.toImageObject(platformSpecificData), true, true).then(function () {
            _this._control.updateFormCellModel(false);
        });
    };
    SignatureCaptureFormCellObservable.prototype.toImageObject = function (data) {
        var value = data.get('Value');
        if (app.android) {
            value.length = value.content.length;
            return value;
        }
        else if (app.ios) {
            return {
                content: value.valueForKey('content'),
                contentType: value.valueForKey('contentType'),
                length: value.valueForKey('content').length
            };
        }
        ;
    };
    return SignatureCaptureFormCellObservable;
}(BaseFormCellObservable_1.BaseFormCellObservable));
exports.SignatureCaptureFormCellObservable = SignatureCaptureFormCellObservable;
