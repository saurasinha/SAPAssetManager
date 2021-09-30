"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var BannerCallback = (function (_super) {
    __extends(BannerCallback, _super);
    function BannerCallback() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BannerCallback.initWithCallback = function (callback) {
        var bridgeCallback = BannerCallback.new();
        bridgeCallback._callback = callback;
        return bridgeCallback;
    };
    BannerCallback.prototype.onActionLabelPress = function () {
        this._callback.onActionLabelPress();
    };
    BannerCallback.prototype.onCompletionActionLabelPress = function () {
        this._callback.onCompletionActionLabelPress();
    };
    BannerCallback.ObjCExposedMethods = {
        onActionLabelPress: { params: [interop.types.void], returns: interop.types.void },
        onCompletionActionLabelPress: { params: [interop.types.void], returns: interop.types.void },
    };
    return BannerCallback;
}(NSObject));
var Banner = (function () {
    function Banner() {
        this.bridge = BannerMessageViewBridge.new();
        if (Banner._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.BANNER_INSTANTIATION_FAILED);
        }
        Banner._instance = this;
    }
    Banner.getInstance = function () {
        return Banner._instance;
    };
    Banner.prototype.display = function (data, callback) {
        if (!data.topFrame) {
            return;
        }
        data.topFrame = data.topFrame.ios.controller;
        data.message = data.message.toString();
        this.myCallback = BannerCallback.initWithCallback(callback);
        this.bridge.displayBannerMessageCallback(data, this.myCallback);
    };
    Banner.prototype.dismiss = function (data) {
        var dataParam = data ? data : {};
        this.bridge.dismissBanner(dataParam);
    };
    Banner.prototype.prepareToRelocate = function () {
        this.bridge.prepareToRelocate();
    };
    Banner.prototype.updateText = function (message, topFrame) {
        if (message !== null && message !== undefined) {
            this.bridge.updateText({ text: message });
        }
    };
    Banner.prototype.relocateTo = function (topFrame, view) {
        if (topFrame && topFrame.ios && topFrame.ios.controller) {
            this.bridge.relocateToWithParams(topFrame.ios.controller, view);
        }
    };
    Banner._instance = new Banner();
    return Banner;
}());
exports.Banner = Banner;
;
