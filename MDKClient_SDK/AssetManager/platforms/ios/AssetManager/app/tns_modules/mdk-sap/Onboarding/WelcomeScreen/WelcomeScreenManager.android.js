"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataConverter_1 = require("../../Common/DataConverter");
var application = require("tns-core-modules/application");
var trace_1 = require("tns-core-modules/trace");
var WelcomeScreen = (function () {
    function WelcomeScreen() {
    }
    WelcomeScreen.getInstance = function () {
        if (!WelcomeScreen._instance) {
            WelcomeScreen._instance = new WelcomeScreen();
        }
        return WelcomeScreen._instance;
    };
    WelcomeScreen.prototype.createCallback = function (callback, resolve, reject) {
        return new com.sap.mdk.client.ui.onboarding.IWelcomeScreenCallback({
            finishedLoadingRegistrationInfo: function (data) {
                var aMap = DataConverter_1.DataConverter.toJavaScriptMap(data);
                callback.finishedLoadingRegistrationInfo(aMap);
            },
            finishedOnboardingWithParams: function (data) {
                var aMap = DataConverter_1.DataConverter.toJavaScriptMap(data);
                callback.finishedOnboardingWithParams(aMap);
            },
            finishedRestoringWithParams: function (data) {
                var aMap = DataConverter_1.DataConverter.toJavaScriptMap(data);
                callback.finishedRestoringWithParams(aMap);
            },
            userSwitchedWithParams: function (data) {
                var aMap = DataConverter_1.DataConverter.toJavaScriptMap(data);
                callback.userSwitchedWithParams(aMap);
            },
            qrCodeScanComplete: function (data) {
                callback.qrCodeScanComplete(data);
            },
            setPasscodeTimeout: function (data) {
                callback.setPasscodeTimeout(data);
            },
            setOnboardingStage: function (stage) {
                callback.setOnboardingStage(stage);
            },
            retryPrevUserPendingTxnsUpload: function () {
                callback.retryPrevUserPendingTxnsUpload();
            },
            resetInitializedOData: function () {
                callback.resetInitializedOData();
            },
            resetClientComplete: function (success) {
                var status = success ? "successful" : "failed";
                trace_1.write("RESET Flow completion status: " + status, 'mdk.trace.core', trace_1.messageType.info);
                resolve();
            },
        });
    };
    WelcomeScreen.prototype.create = function (params, callback) {
        var onboardingParams = DataConverter_1.DataConverter.toJavaObject(params);
        this.callback = callback;
        this.welcomeScreenBridge = new com.sap.mdk.client.ui.onboarding.WelcomeScreenBridge(application.android.context);
        this.welcomeScreenBridge.create(onboardingParams, this.createCallback(callback));
        return this.welcomeScreenBridge;
    };
    WelcomeScreen.prototype.onLoaded = function () {
        var context = application.android.foregroundActivity ? application.android.foregroundActivity :
            application.android.context;
        this.welcomeScreenBridge.onLoaded(context);
        return this.welcomeScreenBridge;
    };
    WelcomeScreen.prototype.applicationWillEnterBackground = function () {
        this.welcomeScreenBridge.lockScreen();
    };
    WelcomeScreen.prototype.applicationWillEnterForeground = function () {
        try {
            return Promise.resolve(this.welcomeScreenBridge.unlockScreen());
        }
        catch (error) {
        }
    };
    WelcomeScreen.prototype.restoreOnRelaunch = function (params) {
        try {
            var newParams = DataConverter_1.DataConverter.toJavaObject(params);
            return Promise.resolve(this.welcomeScreenBridge.restoreOnRelaunch(newParams));
        }
        catch (error) {
        }
    };
    WelcomeScreen.prototype.changeUserPasscode = function () {
        try {
            return Promise.resolve(this.welcomeScreenBridge.changeUserPasscode());
        }
        catch (error) {
        }
    };
    WelcomeScreen.prototype.verifyPasscode = function (params) {
        try {
            var newParams = DataConverter_1.DataConverter.toJavaObject(params);
            return Promise.resolve(this.welcomeScreenBridge.verifyPasscode(newParams));
        }
        catch (error) {
        }
    };
    WelcomeScreen.prototype.resetClient = function () {
        var _this = this;
        try {
            return new Promise(function (resolve, reject) {
                _this.welcomeScreenBridge.resetClient(_this.createCallback(_this.callback, resolve, reject));
            });
        }
        catch (error) {
        }
    };
    WelcomeScreen.prototype.showErrorScreen = function (params, onboardingParams) {
        try {
            var newParams = DataConverter_1.DataConverter.toJavaObject(params);
            var newOnboardingParams = DataConverter_1.DataConverter.toJavaObject(onboardingParams);
            return Promise.resolve(this.welcomeScreenBridge.showErrorScreen(newParams, newOnboardingParams));
        }
        catch (error) {
        }
    };
    WelcomeScreen.prototype.showSyncInProgressScreen = function (onboardingParams) {
        try {
            var newOnboardingParams = DataConverter_1.DataConverter.toJavaObject(onboardingParams);
            return Promise.resolve(this.welcomeScreenBridge.showSyncInProgressScreen(newOnboardingParams));
        }
        catch (error) {
        }
    };
    WelcomeScreen.prototype.finishUserSwitchSyncInProgress = function () {
        this.welcomeScreenBridge.finishUserSwitchSyncInProgress();
    };
    WelcomeScreen.prototype.showNoNetworkScreen = function (onboardingParams) {
        try {
            var newOnboardingParams = DataConverter_1.DataConverter.toJavaObject(onboardingParams);
            return Promise.resolve(this.welcomeScreenBridge.showNoNetworkScreen(newOnboardingParams));
        }
        catch (error) {
        }
    };
    WelcomeScreen.prototype.isAppInMultiUserMode = function () {
        try {
            return this.welcomeScreenBridge.isAppInMultiUserMode();
        }
        catch (error) {
            return false;
        }
    };
    return WelcomeScreen;
}());
exports.WelcomeScreen = WelcomeScreen;
;
