"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Application_1 = require("../../Application");
var ClientSettings_1 = require("../../storage/ClientSettings");
var StyleHelper_1 = require("../../utils/StyleHelper");
var ApplicationSegment = (function (_super) {
    __extends(ApplicationSegment, _super);
    function ApplicationSegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ApplicationSegment.prototype.resolve = function () {
        var ctx = Application_1.Application.getContext();
        ctx.clientData.UserId = ClientSettings_1.ClientSettings.getUserInfo();
        ctx.clientData.DeviceId = ClientSettings_1.ClientSettings.getDeviceId();
        ctx.clientData.Session = ClientSettings_1.ClientSettings.getSession();
        ctx.clientData.MobileServiceEndpoint = ClientSettings_1.ClientSettings.getCpmsUrl();
        ctx.clientData.MobileServiceAppId = ClientSettings_1.ClientSettings.getAppId();
        ctx.clientData.AvailableThemes = StyleHelper_1.StyleHelper.getAvailableThemes();
        return ctx;
    };
    ApplicationSegment.prototype.isSpecifierRequired = function () {
        return false;
    };
    return ApplicationSegment;
}(ISegment_1.ISegment));
exports.ApplicationSegment = ApplicationSegment;
