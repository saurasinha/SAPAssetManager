"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var utils = require("tns-core-modules/utils/utils");
var platform_1 = require("tns-core-modules/platform");
var enums_1 = require("tns-core-modules/ui/enums");
var Toaster = (function () {
    function Toaster() {
        this._isShowing = false;
        this._data = null;
        this._toastBridge = new com.sap.mdk.client.ui.fiori.toast.Toast();
        if (Toaster._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.TOASTER_INSTANTIATION_FAILED);
        }
        Toaster._instance = this;
    }
    Toaster.getInstance = function () {
        return Toaster._instance;
    };
    Toaster.prototype.dismiss = function (data) {
        this._toastBridge.dismiss();
    };
    Toaster.prototype.display = function (data) {
        var _this = this;
        if (!data.message || data.message === '') {
            throw new Error(ErrorMessage_1.ErrorMessage.TOASTER_NO_MESSAGE);
        }
        if (this._toastBridge) {
            var foregroundAct = app.android.foregroundActivity;
            var topFrame = data.background;
            if (foregroundAct === undefined || topFrame.currentPage === null || topFrame.currentPage.android === null) {
                return undefined;
            }
            var frame = topFrame.currentPage.android;
            if (foregroundAct) {
                var className = foregroundAct.getClass().getSimpleName();
                if (className !== 'QRCodeReaderActivity' && className !== 'MDKAndroidActivity' ||
                    !frame.isAttachedToWindow()) {
                    frame = foregroundAct.getWindow().getDecorView().findViewById(android.R.id.content);
                }
            }
            if (!frame.isAttachedToWindow()) {
                return undefined;
            }
            var callback = new com.sap.mdk.client.ui.fiori.toast.IToastCallback({
                onDismissed: function () {
                    _this._isShowing = false;
                    _this._data = null;
                    _this._timeAtShowing = 0;
                }
            });
            var params = new org.json.JSONObject();
            params.put('Duration', data.duration);
            params.put('Message', data.message);
            params.put('CloseButtonCaption', data.CloseButtonCaption);
            params.put('BottomOffset', data.bottomOffset);
            params.put('MaxLines', data.maxLines);
            params.put('Animated', data.animated);
            params.put('Callback', callback);
            if (platform_1.device.deviceType === enums_1.DeviceType.Phone) {
                params.put('Margin', Toaster._phoneMargin);
            }
            else {
                params.put('Margin', Toaster._tabletMargin);
                params.put('MinWidth', Toaster._minWidth);
                params.put('MaxWidth', Toaster._maxWidth);
            }
            this._isShowing = true;
            this._data = data;
            this._timeAtShowing = new Date().getTime();
            this._toastBridge.show(params, foregroundAct, frame);
        }
    };
    Toaster.prototype.relocate = function (frame, bottomOffset) {
        if (this._isShowing) {
            var newData = this._data;
            var currentTime = new Date().getTime();
            var shownDuration = (currentTime - this._timeAtShowing) / 1000;
            var newDuration = newData.duration;
            if (shownDuration > 0) {
                newDuration = newDuration - shownDuration + 0.5;
                if (newDuration <= 0) {
                    newDuration = 3;
                }
            }
            newData.background = frame;
            newData.duration = newDuration;
            newData.bottomOffset = bottomOffset;
            Toaster.getInstance().display(newData);
        }
    };
    Toaster._instance = new Toaster();
    Toaster._phoneMargin = utils.layout.toDevicePixels(8);
    Toaster._tabletMargin = utils.layout.toDevicePixels(24);
    Toaster._minWidth = utils.layout.toDevicePixels(288);
    Toaster._maxWidth = utils.layout.toDevicePixels(568);
    return Toaster;
}());
exports.Toaster = Toaster;
;
