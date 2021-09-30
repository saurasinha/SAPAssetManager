"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonUtil_1 = require("../../ErrorHandling/CommonUtil");
var DataConverter_1 = require("../../Common/DataConverter");
var trace_1 = require("tns-core-modules/trace");
var WelcomeScreenCallback = (function (_super) {
    __extends(WelcomeScreenCallback, _super);
    function WelcomeScreenCallback() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WelcomeScreenCallback.initWithCallback = function (callback) {
        var bridgeCallback = WelcomeScreenCallback.new();
        bridgeCallback._callback = callback;
        return bridgeCallback;
    };
    WelcomeScreenCallback.prototype.finishedOnboardingWithParams = function (data) {
        var jsData = DataConverter_1.DataConverter.fromNSDictToMap(data);
        this._callback.finishedOnboardingWithParams(jsData);
    };
    WelcomeScreenCallback.prototype.finishedLoadingRegistrationInfo = function (data) {
        var jsData = DataConverter_1.DataConverter.fromNSDictToMap(data);
        this._callback.finishedLoadingRegistrationInfo(jsData);
    };
    WelcomeScreenCallback.prototype.qrCodeScanComplete = function (queryString) {
        this._callback.qrCodeScanComplete(queryString);
    };
    WelcomeScreenCallback.prototype.setOnboardingStage = function (stage) {
        this._callback.setOnboardingStage(stage);
    };
    WelcomeScreenCallback.ObjCExposedMethods = {
        finishedOnboardingWithParams: { params: [NSDictionary], returns: interop.types.void },
        finishedLoadingRegistrationInfo: { params: [NSDictionary], returns: interop.types.void },
        qrCodeScanComplete: { params: [NSString], returns: interop.types.void },
        setOnboardingStage: { params: [NSString], returns: interop.types.void },
    };
    return WelcomeScreenCallback;
}(NSObject));
var WelcomeScreen = (function () {
    function WelcomeScreen() {
        this.welcomeScreenBridge = WelcomeScreenBridge.new();
    }
    WelcomeScreen.getInstance = function () {
        if (!WelcomeScreen._instance) {
            WelcomeScreen._instance = new WelcomeScreen();
        }
        return WelcomeScreen._instance;
    };
    WelcomeScreen.prototype.create = function (params, callback) {
        var myCallback = WelcomeScreenCallback.initWithCallback(callback);
        return this.welcomeScreenBridge.createCallback(params, myCallback);
    };
    WelcomeScreen.prototype.reInitializePage = function (params) {
        this.welcomeScreenBridge.reInitializePage(params);
    };
    WelcomeScreen.prototype.manageBlurScreen = function (params) {
        this.welcomeScreenBridge.manageBlurScreen(params);
    };
    WelcomeScreen.prototype.applicationWillEnterForeground = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.welcomeScreenBridge.applicationWillEnterForegroundReject(function (result) {
                trace_1.write('Calling applicationWillEnterForeground was successful', 'mdk.trace.onboarding', trace_1.messageType.log);
                resolve(result);
            }, function (code, message, error) {
                reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
            });
        });
    };
    WelcomeScreen.prototype.changeUserPasscode = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.welcomeScreenBridge.changeUserPasscodeReject(function (result) {
                trace_1.write('Calling changeUserPasscode was successful', 'mdk.trace.onboarding', trace_1.messageType.log);
                resolve(result);
            }, function (code, message, error) {
                reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
            });
        });
    };
    WelcomeScreen.prototype.verifyPasscode = function (params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.welcomeScreenBridge.verifyPasscodeResolveReject(params, function (result) {
                trace_1.write('Calling verifyPasscode was successful', 'mdk.trace.onboarding', trace_1.messageType.log);
                resolve(result);
            }, function (code, message, error) {
                reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
            });
        });
    };
    WelcomeScreen.prototype.restoreOnRelaunch = function (params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this.welcomeScreenBridge.restoreOnRelaunchResolveReject(params, function (result) {
                trace_1.write('Calling restoreOnRelaunch was successful', 'mdk.trace.onboarding', trace_1.messageType.log);
                resolve(result);
            }, function (code, message, error) {
                reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
            });
        });
    };
    WelcomeScreen.prototype.resetClient = function () {
        return Promise.resolve('');
    };
    WelcomeScreen.prototype.showErrorScreen = function (params, onboardingParams) {
        return Promise.resolve('');
    };
    WelcomeScreen.prototype.showSyncInProgressScreen = function (onboardingParams) {
        return Promise.resolve('');
    };
    WelcomeScreen.prototype.showNoNetworkScreen = function (onboardingParams) {
        return Promise.resolve('');
    };
    WelcomeScreen.prototype.finishUserSwitchSyncInProgress = function () {
    };
    WelcomeScreen.prototype.isAppInMultiUserMode = function () {
        return false;
    };
    return WelcomeScreen;
}());
exports.WelcomeScreen = WelcomeScreen;
;
