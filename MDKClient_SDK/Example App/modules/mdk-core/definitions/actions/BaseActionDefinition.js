"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../BaseJSONDefinition");
var BaseActionDefinition = (function (_super) {
    __extends(BaseActionDefinition, _super);
    function BaseActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    Object.defineProperty(BaseActionDefinition.prototype, "failureAction", {
        get: function () {
            return this.data.OnFailureAction || this.data.OnFailure;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActionDefinition.prototype, "invalidAction", {
        get: function () {
            return this.data.OnInvalidAction || this.data.OnInvalid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActionDefinition.prototype, "successAction", {
        get: function () {
            return this.data.OnSuccessAction || this.data.OnSuccess;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActionDefinition.prototype, "type", {
        get: function () {
            return this.data._Type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActionDefinition.prototype, "validationRule", {
        get: function () {
            return this.data.ValidationRule;
        },
        enumerable: true,
        configurable: true
    });
    BaseActionDefinition.prototype.getOnSuccessLog = function () {
        if (this.data.OnSuccessLog) {
            return new LogDetail(this.data.OnSuccessLog);
        }
        else {
            return undefined;
        }
    };
    BaseActionDefinition.prototype.getOnFailureLog = function () {
        if (this.data.OnFailureLog) {
            return new LogDetail(this.data.OnFailureLog);
        }
        else {
            return undefined;
        }
    };
    BaseActionDefinition.prototype.getOnInvalidLog = function () {
        if (this.data.OnInvalidLog) {
            return new LogDetail(this.data.OnInvalidLog);
        }
        else {
            return undefined;
        }
    };
    Object.defineProperty(BaseActionDefinition.prototype, "showActivityIndicator", {
        get: function () {
            return this.data.ShowActivityIndicator ? this.data.ShowActivityIndicator : false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActionDefinition.prototype, "activityIndicatorText", {
        get: function () {
            return this.data.ActivityIndicatorText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActionDefinition.prototype, "actionResult", {
        get: function () {
            return this.data.ActionResult;
        },
        enumerable: true,
        configurable: true
    });
    BaseActionDefinition.type = {
        ApplicationUpdate: 'Action.Type.ApplicationUpdate',
        BannerMessage: 'Action.Type.BannerMessage',
        ChangeSet: 'Action.Type.ODataService.ChangeSet',
        ChangeUserPasscode: 'Action.Type.ChangeUserPasscode',
        VerifyPasscode: 'Action.Type.VerifyPasscode',
        CheckBarcodeScannerPrerequisite: 'Action.Type.CheckBarcodeScannerPrerequisite',
        CheckRequiredFields: 'Action.Type.CheckRequiredFields',
        ClearOfflineOData: 'Action.Type.OfflineOData.Clear',
        CloseOfflineOData: 'Action.Type.OfflineOData.Close',
        ClosePage: 'Action.Type.ClosePage',
        CreateODataEntity: 'Action.Type.ODataService.CreateEntity',
        CreateODataMedia: 'Action.Type.ODataService.CreateMedia',
        CreateODataRelatedEntity: 'Action.Type.ODataService.CreateRelatedEntity',
        CreateODataRelatedMedia: 'Action.Type.ODataService.CreateRelatedMedia',
        CreateODataService: 'Action.Type.ODataService.Create',
        DeleteODataEntity: 'Action.Type.ODataService.DeleteEntity',
        DeleteODataMedia: 'Action.Type.ODataService.DeleteMedia',
        DownloadMediaOData: 'Action.Type.ODataService.DownloadMedia',
        DownloadOfflineOData: 'Action.Type.OfflineOData.Download',
        DownloadStreamOData: 'Action.Type.ODataService.DownloadStream',
        Filter: 'Action.Type.Filter',
        InitializeOData: 'Action.Type.ODataService.Initialize',
        InitializeOfflineOData: 'Action.Type.OfflineOData.Initialize',
        LoggingLogMessage: 'Action.Type.Logger.LogMessage',
        LoggingSetLevel: 'Action.Type.Logger.SetLevel',
        LoggingSetState: 'Action.Type.Logger.SetState',
        LoggingUpload: 'Action.Type.Logger.Upload',
        Logout: 'Action.Type.Logout',
        Message: 'Action.Type.Message',
        Navigation: 'Action.Type.Navigation',
        ODataCallFunction: 'Action.Type.ODataService.CallFunction',
        OpenBarcodeScanner: 'Action.Type.OpenBarcodeScanner',
        OpenDocument: 'Action.Type.OpenDocument',
        OpenODataService: 'Action.Type.ODataService.Open',
        PopoverMenu: 'Action.Type.PopoverMenu',
        ProgressBanner: 'Action.Type.ProgressBanner',
        PushNotificationRegister: 'Action.Type.PushNotificationRegister',
        PushNotificationUnregister: 'Action.Type.PushNotificationUnregister',
        ReadODataService: 'Action.Type.ODataService.Read',
        SendRequest: 'Action.Type.RestService.SendRequest',
        SetLanguage: 'Action.Type.SetLanguage',
        SetRegion: 'Action.Type.SetRegion',
        SetTheme: 'Action.Type.SetTheme',
        ToastMessage: 'Action.Type.ToastMessage',
        UndoPendingChanges: 'Action.Type.OfflineOData.UndoPendingChanges',
        UpdateODataEntity: 'Action.Type.ODataService.UpdateEntity',
        UploadOfflineOData: 'Action.Type.OfflineOData.Upload',
        CancelUploadOfflineOData: 'Action.Type.OfflineOData.CancelUpload',
        CancelDownloadOfflineOData: 'Action.Type.OfflineOData.CancelDownload',
        UploadStreamOData: 'Action.Type.ODataService.UploadStream',
    };
    return BaseActionDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.BaseActionDefinition = BaseActionDefinition;
var LogDetail = (function () {
    function LogDetail(detailDefinition) {
        this.data = detailDefinition;
    }
    LogDetail.prototype.getMessage = function () {
        return this.data.Message;
    };
    LogDetail.prototype.getLevel = function () {
        return this.data.Level;
    };
    return LogDetail;
}());
exports.LogDetail = LogDetail;
;
