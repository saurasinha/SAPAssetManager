"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("../BaseAction");
var LogUploadActionDefinition_1 = require("../../definitions/actions/logger/LogUploadActionDefinition");
var ClientSettings_1 = require("../../storage/ClientSettings");
var mdk_sap_1 = require("mdk-sap");
var Logger_1 = require("../../utils/Logger");
var ActionResultBuilder_1 = require("../../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var LogUploadAction = (function (_super) {
    __extends(LogUploadAction, _super);
    function LogUploadAction(definition) {
        var _this = this;
        if (!(definition instanceof LogUploadActionDefinition_1.LogUploadActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_LOGUPLOADACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    LogUploadAction.prototype.execute = function () {
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_UPLOADLOG_IN_DEMOMODE);
        }
        var params = ClientSettings_1.ClientSettings.getLogUploadingParams();
        var logger = mdk_sap_1.LoggerManager.getInstance();
        return logger.uploadLogFile(params.EndpointURL, params.ApplicationID).then(function (result) {
            Logger_1.Logger.instance.logManager.log(Logger_1.Logger.LOGMANAGER_UPLOAD_SUCCEEDED);
            return new ActionResultBuilder_1.ActionResultBuilder().data(result).build();
        }).catch(function (error) {
            Logger_1.Logger.instance.logManager.log(Logger_1.Logger.LOGMANAGER_UPLOAD_FAILED, error);
            throw error;
        });
    };
    return LogUploadAction;
}(BaseAction_1.BaseAction));
exports.LogUploadAction = LogUploadAction;
;
