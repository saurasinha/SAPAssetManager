"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("./BaseJSONDefinition");
var app = require("tns-core-modules/application");
var ApplicationDefinition = (function (_super) {
    __extends(ApplicationDefinition, _super);
    function ApplicationDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApplicationDefinition.prototype.getMainPage = function () {
        return this.data.MainPage;
    };
    ApplicationDefinition.prototype.getOnLaunch = function () {
        return this.data.OnLaunch;
    };
    ApplicationDefinition.prototype.getOnUnCaughtError = function () {
        return this.data.OnUnCaughtError;
    };
    ApplicationDefinition.prototype.getOnExit = function () {
        return this.data.OnExit;
    };
    ApplicationDefinition.prototype.getOnUserSwitch = function () {
        return this.data.OnUserSwitch;
    };
    ApplicationDefinition.prototype.getStyles = function () {
        return this.data.Styles;
    };
    ApplicationDefinition.prototype.getStyleSheets = function () {
        if (this.data.StyleSheets instanceof Object) {
            return this.data.StyleSheets;
        }
        else {
            return null;
        }
    };
    ApplicationDefinition.prototype.getCSSStyles = function (theme) {
        if (theme !== undefined && this.data.StyleSheets instanceof Object) {
            return this.data.StyleSheets[theme].css;
        }
        else {
            return null;
        }
    };
    ApplicationDefinition.prototype.getSDKStyles = function (theme) {
        var platform = 'ios';
        if (app.android) {
            platform = 'android';
        }
        if (theme !== undefined && this.data.StyleSheets instanceof Object) {
            return this.data.StyleSheets[theme][platform];
        }
        else if (this.data.SDKStyles instanceof Object) {
            return this.data.SDKStyles[platform];
        }
        return null;
    };
    ApplicationDefinition.prototype.getLocalization = function () {
        return this.data.Localization;
    };
    ApplicationDefinition.prototype.getOnWillUpdate = function () {
        return this.data.OnWillUpdate;
    };
    ApplicationDefinition.prototype.getOnDidUpdate = function () {
        return this.data.OnDidUpdate;
    };
    ApplicationDefinition.prototype.getVersion = function () {
        return this.data.Version;
    };
    Object.defineProperty(ApplicationDefinition.prototype, "foregroundNotificationEventHandler", {
        get: function () {
            return this.data.OnReceiveForegroundNotification;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationDefinition.prototype, "contentAvailableEventHandler", {
        get: function () {
            return this.data.OnReceiveFetchCompletion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplicationDefinition.prototype, "receiveNotificationResponseEventHandler", {
        get: function () {
            return this.data.OnReceiveNotificationResponse;
        },
        enumerable: true,
        configurable: true
    });
    ApplicationDefinition.prototype.getOnSuspend = function () {
        return this.data.OnSuspend;
    };
    ApplicationDefinition.prototype.getOnResume = function () {
        return this.data.OnResume;
    };
    ApplicationDefinition.prototype.getOnLinkDataReceived = function () {
        return this.data.OnLinkDataReceived;
    };
    return ApplicationDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.ApplicationDefinition = ApplicationDefinition;
;
