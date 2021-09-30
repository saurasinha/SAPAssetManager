"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var IControl_1 = require("../controls/IControl");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var label_1 = require("tns-core-modules/ui/label");
var FallbackExtension = (function (_super) {
    __extends(FallbackExtension, _super);
    function FallbackExtension(_error, _native) {
        var _this = _super.call(this) || this;
        _this._error = _error;
        _this._native = _native;
        if (_error instanceof Error) {
            _this._errorText = _error.message;
        }
        else {
            _this._errorText = ErrorMessage_1.ErrorMessage.EXTENSION_NOT_CORRECTLY_IMPLEMENT;
        }
        return _this;
    }
    FallbackExtension.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
    };
    FallbackExtension.prototype.view = function () {
        if (this._native && app.android && this.androidContext()) {
            return this.androidView();
        }
        else if (this._native && app.ios) {
            return this.iosView();
        }
        else {
            return this.nativeScriptLabel();
        }
    };
    FallbackExtension.prototype.nativeScriptLabel = function () {
        var label = new label_1.Label();
        label.text = this._errorText;
        label.textAlignment = 'center';
        label.fontSize = 20;
        return label;
    };
    FallbackExtension.prototype.androidView = function () {
        var textView = new android.widget.TextView(this.androidContext());
        textView.setText(this._errorText);
        return textView;
    };
    FallbackExtension.prototype.iosView = function () {
        var label = TNSLabel.alloc().init();
        label.text = this._errorText;
        return label;
    };
    FallbackExtension.prototype.observable = function () {
        return null;
    };
    FallbackExtension.prototype.setContainer = function (container) {
    };
    FallbackExtension.prototype.setValue = function (value, notify, isTextValue) {
        return Promise.resolve();
    };
    return FallbackExtension;
}(IControl_1.IControl));
exports.FallbackExtension = FallbackExtension;
