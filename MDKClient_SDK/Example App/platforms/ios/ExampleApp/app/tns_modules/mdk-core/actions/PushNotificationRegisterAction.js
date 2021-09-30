"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var PushNotificationRegisterActionDefinition_1 = require("../definitions/actions/PushNotificationRegisterActionDefinition");
var mdk_sap_1 = require("mdk-sap");
var ClientSettings_1 = require("../storage/ClientSettings");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var app = require("tns-core-modules/application");
var PushNotificationRegisterAction = (function (_super) {
    __extends(PushNotificationRegisterAction, _super);
    function PushNotificationRegisterAction(actionDefinition) {
        var _this = this;
        if (!(actionDefinition instanceof PushNotificationRegisterActionDefinition_1.PushNotificationRegisterActionDefinition)) {
            throw new Error('Cannot instantiate PushNotificationRegisterAction without PushNotificationRegisterActionDefinition');
        }
        _this = _super.call(this, actionDefinition) || this;
        return _this;
    }
    PushNotificationRegisterAction.prototype.execute = function () {
        var applicationId = ClientSettings_1.ClientSettings.getAppId();
        var baseUrl = ClientSettings_1.ClientSettings.getCpmsUrl();
        if (app.ios || app.android) {
            if (applicationId.length <= 0 || baseUrl.length <= 0) {
                return Promise.resolve(new ActionResultBuilder_1.ActionResultBuilder().error('Invalid client settings').valid(false).build());
            }
        }
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            return Promise.resolve(new ActionResultBuilder_1.ActionResultBuilder().data(null).build());
        }
        return mdk_sap_1.PushNotification.getInstance().registerForPushNotification(applicationId, baseUrl, null)
            .then(function (data) {
            var actionResult = app.ios || app.android ?
                new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
            return Promise.resolve(actionResult);
        });
    };
    return PushNotificationRegisterAction;
}(BaseAction_1.BaseAction));
exports.PushNotificationRegisterAction = PushNotificationRegisterAction;
