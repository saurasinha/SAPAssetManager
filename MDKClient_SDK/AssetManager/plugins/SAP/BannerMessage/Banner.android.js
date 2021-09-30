"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var enums_1 = require("tns-core-modules/ui/enums");
var platform_1 = require("tns-core-modules/platform");
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var IBannerData_1 = require("../BannerMessage/IBannerData");
var utils = require("tns-core-modules/utils/utils");
var Banner = (function () {
    function Banner() {
        this._bannerBridge = com.sap.mdk.client.ui.fiori.banner.BannerManager;
        if (Banner._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.BANNER_INSTANTIATION_FAILED);
        }
        Banner._instance = this;
    }
    Banner.getInstance = function () {
        return Banner._instance;
    };
    Banner.prototype.dismiss = function (data) {
        if (data && data.type === IBannerData_1.BannerType.progress) {
            this._bannerBridge.dismiss();
        }
    };
    Banner.prototype.prepareToRelocate = function () {
        this._bannerBridge.prepareToRelocate();
    };
    Banner.prototype.relocateTo = function (topFrame, view) {
        var frame = this._getFrame(topFrame);
        if (frame === undefined) {
            return undefined;
        }
        this._bannerBridge.relocateTo(frame, view);
    };
    Banner.prototype.display = function (data, callback) {
        var duration = data.type === IBannerData_1.BannerType.progress ? 0 : data.duration;
        this._displayStandard(callback, data.message, data.topFrame, duration, data.animated, data.bottomOffset, data.maxLines, data.CloseButtonCaption, data.type, data.actionLabel, data.onActionLabelPress, data.completionActionLabel, data.onCompletionActionLabelPress, data.dismissBannerOnAction, data.view);
    };
    Banner.prototype._getFrame = function (topFrame) {
        var foregroundAct = app.android.foregroundActivity;
        if (!foregroundAct || !topFrame.currentPage || !topFrame.currentPage.android) {
            return undefined;
        }
        var frame = topFrame.currentPage.android;
        if (foregroundAct && foregroundAct.getClass().getSimpleName()
            && foregroundAct.getClass().getSimpleName() !== 'MDKAndroidActivity') {
            frame = foregroundAct.getWindow().getDecorView().findViewById(android.R.id.content);
        }
        return frame;
    };
    Banner.prototype._displayStandard = function (callback, message, topFrame, duration, animated, bottomOffset, maxLines, closeButtonCaption, bannerType, actionLabel, onActionLabelPress, completionActionLabel, onCompletionActionLabelPress, dismissBannerOnAction, view) {
        var frame = this._getFrame(topFrame);
        if (frame === undefined) {
            return undefined;
        }
        var params = new org.json.JSONObject();
        params.put('Duration', duration);
        params.put('Message', message.toString());
        params.put('CloseButtonCaption', closeButtonCaption);
        params.put('BottomOffset', bottomOffset);
        params.put('MaxLines', maxLines);
        params.put('Type', bannerType);
        params.put('ActionLabel', actionLabel);
        params.put('OnActionLabelPress', onActionLabelPress);
        params.put('CompletionActionLabel', completionActionLabel);
        params.put('OnCompletionActionLabelPress', onCompletionActionLabelPress);
        params.put('DismissBannerOnAction', dismissBannerOnAction);
        params.put('View', view);
        if (platform_1.device.deviceType === enums_1.DeviceType.Phone) {
            params.put('Margin', Banner._phoneMargin);
        }
        else {
            params.put('Margin', Banner._tabletMargin);
            params.put('MinWidth', Banner._minWidth);
            params.put('MaxWidth', Banner._maxWidth);
        }
        var foregroundAct = app.android.foregroundActivity;
        this._bannerBridge.show(params, foregroundAct, frame, this.createCallback(callback));
    };
    Banner.prototype.updateText = function (message, topFrame) {
        if (message !== null && message !== undefined) {
            var params = new org.json.JSONObject();
            params.put('text', message.toString());
            this._bannerBridge.updateText(params);
        }
    };
    Banner.prototype.createCallback = function (callback) {
        return new com.sap.mdk.client.ui.fiori.banner.IBannerCallback({
            onActionLabelPress: function () {
                callback.onActionLabelPress();
            },
            onCompletionActionLabelPress: function () {
                callback.onCompletionActionLabelPress();
            },
        });
    };
    Banner._instance = new Banner();
    Banner._phoneMargin = utils.layout.toDevicePixels(8);
    Banner._tabletMargin = utils.layout.toDevicePixels(24);
    Banner._minWidth = utils.layout.toDevicePixels(288);
    Banner._maxWidth = utils.layout.toDevicePixels(568);
    return Banner;
}());
exports.Banner = Banner;
;
