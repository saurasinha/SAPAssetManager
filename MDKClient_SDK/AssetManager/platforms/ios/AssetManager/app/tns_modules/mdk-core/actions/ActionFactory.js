"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("../definitions/actions/BaseActionDefinition");
var BannerMessageAction_1 = require("./BannerMessageAction");
var ChangeSetAction_1 = require("./ChangeSetAction");
var ChangeUserPasscodeAction_1 = require("./ChangeUserPasscodeAction");
var VerifyPasscodeAction_1 = require("./VerifyPasscodeAction");
var CheckRequiredFieldsAction_1 = require("./CheckRequiredFieldsAction");
var ClearOfflineODataAction_1 = require("./ClearOfflineODataAction");
var CloseOfflineODataAction_1 = require("./CloseOfflineODataAction");
var ClosePageAction_1 = require("./ClosePageAction");
var CreateODataEntityAction_1 = require("./CreateODataEntityAction");
var CreateODataMediaAction_1 = require("./CreateODataMediaAction");
var CreateODataServiceAction_1 = require("./CreateODataServiceAction");
var DeleteODataEntityAction_1 = require("./DeleteODataEntityAction");
var DownloadODataMediaAction_1 = require("./DownloadODataMediaAction");
var DownloadODataStreamAction_1 = require("./DownloadODataStreamAction");
var UploadODataStreamAction_1 = require("./UploadODataStreamAction");
var DownloadOfflineODataAction_1 = require("./DownloadOfflineODataAction");
var InitOfflineODataAction_1 = require("./InitOfflineODataAction");
var LogMessageAction_1 = require("./logger/LogMessageAction");
var LogoutAction_1 = require("./LogoutAction");
var LogUploadAction_1 = require("./logger/LogUploadAction");
var MessageAction_1 = require("./MessageAction");
var NavigationAction_1 = require("./NavigationAction");
var OpenDocumentAction_1 = require("./OpenDocumentAction");
var OpenODataServiceAction_1 = require("./OpenODataServiceAction");
var PopoverAction_1 = require("./PopoverAction");
var ProgressBannerAction_1 = require("./ProgressBannerAction");
var PushNotificationRegisterAction_1 = require("./PushNotificationRegisterAction");
var PushNotificationUnregisterAction_1 = require("./PushNotificationUnregisterAction");
var ReadODataServiceAction_1 = require("./ReadODataServiceAction");
var SetStateAction_1 = require("./logger/SetStateAction");
var SetLevelAction_1 = require("./logger/SetLevelAction");
var SetLanguageAction_1 = require("./SetLanguageAction");
var SetRegionAction_1 = require("./SetRegionAction");
var SetThemeAction_1 = require("./SetThemeAction");
var DeleteODataMediaAction_1 = require("./DeleteODataMediaAction");
var ToastMessageAction_1 = require("./ToastMessageAction");
var UpdateODataEntityAction_1 = require("./UpdateODataEntityAction");
var UploadOfflineODataAction_1 = require("./UploadOfflineODataAction");
var CancelUploadOfflineODataAction_1 = require("./CancelUploadOfflineODataAction");
var CancelDownloadOfflineODataAction_1 = require("./CancelDownloadOfflineODataAction");
var FilterAction_1 = require("./FilterAction");
var ActionRunner_1 = require("./runners/ActionRunner");
var ChangeSetActionRunner_1 = require("./runners/ChangeSetActionRunner");
var DownloadOfflineODataActionRunner_1 = require("./runners/DownloadOfflineODataActionRunner");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var OpenBarcodeScannerAction_1 = require("./OpenBarcodeScannerAction");
var CheckBarcodeScannerPrerequisiteAction_1 = require("./CheckBarcodeScannerPrerequisiteAction");
var CallFunctionODataAction_1 = require("./CallFunctionODataAction");
var UndoPendingChangesODataAction_1 = require("./UndoPendingChangesODataAction");
var ApplicationUpdateAction_1 = require("./ApplicationUpdateAction");
var CreateODataRelatedEntityAction_1 = require("./CreateODataRelatedEntityAction");
var CreateODataRelatedMediaAction_1 = require("./CreateODataRelatedMediaAction");
var InitializeODataAction_1 = require("./InitializeODataAction");
var SendRequestRestServiceAction_1 = require("./SendRequestRestServiceAction");
var ActionFactory = (function () {
    function ActionFactory() {
    }
    ActionFactory.Create = function (definition) {
        var action = undefined;
        switch (definition.type) {
            case BaseActionDefinition_1.BaseActionDefinition.type.BannerMessage:
                return new BannerMessageAction_1.BannerMessageAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.ChangeSet:
                return new ChangeSetAction_1.ChangeSetAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.ChangeUserPasscode:
                return new ChangeUserPasscodeAction_1.ChangeUserPasscodeAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.VerifyPasscode:
                return new VerifyPasscodeAction_1.VerifyPasscodeAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CheckBarcodeScannerPrerequisite:
                return new CheckBarcodeScannerPrerequisiteAction_1.CheckBarcodeScannerPrerequisiteAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CheckRequiredFields:
                return new CheckRequiredFieldsAction_1.CheckRequiredFieldsAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.ClearOfflineOData:
                return new ClearOfflineODataAction_1.ClearOfflineODataAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CloseOfflineOData:
                return new CloseOfflineODataAction_1.CloseOfflineODataAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.ClosePage:
                return new ClosePageAction_1.ClosePageAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataEntity:
                return new CreateODataEntityAction_1.CreateODataEntityAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataMedia:
                return new CreateODataMediaAction_1.CreateODataMediaAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataService:
                return new CreateODataServiceAction_1.CreateODataServiceAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.DeleteODataEntity:
                return new DeleteODataEntityAction_1.DeleteODataEntityAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.DeleteODataMedia:
                return new DeleteODataMediaAction_1.DeleteODataMediaAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.DownloadMediaOData:
                return new DownloadODataMediaAction_1.DownloadODataMediaAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.DownloadOfflineOData:
                return new DownloadOfflineODataAction_1.DownloadOfflineODataAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.DownloadStreamOData:
                return new DownloadODataStreamAction_1.DownloadODataStreamAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.Filter:
                return new FilterAction_1.FilterAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.InitializeOData:
                return new InitializeODataAction_1.InitializeODataAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.InitializeOfflineOData:
                action = new InitOfflineODataAction_1.InitOfflineODataAction(definition);
                action.setDefaultIndicatorText('initializing_odata');
                return action;
            case BaseActionDefinition_1.BaseActionDefinition.type.LoggingLogMessage:
                return new LogMessageAction_1.LogMessageAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.Logout:
                return new LogoutAction_1.LogoutAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.LoggingUpload:
                return new LogUploadAction_1.LogUploadAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.Message:
                return new MessageAction_1.MessageAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.Navigation:
                return new NavigationAction_1.NavigationAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.ODataCallFunction:
                return new CallFunctionODataAction_1.CallFunctionODataAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.OpenBarcodeScanner:
                return new OpenBarcodeScannerAction_1.OpenBarcodeScannerAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.OpenDocument:
                return new OpenDocumentAction_1.OpenDocumentAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.OpenODataService:
                return new OpenODataServiceAction_1.OpenODataServiceAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.PopoverMenu:
                return new PopoverAction_1.PopoverAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.ProgressBanner:
                return new ProgressBannerAction_1.ProgressBannerAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.PushNotificationRegister:
                return new PushNotificationRegisterAction_1.PushNotificationRegisterAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.PushNotificationUnregister:
                return new PushNotificationUnregisterAction_1.PushNotificationUnregisterAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.ReadODataService:
                return new ReadODataServiceAction_1.ReadODataServiceAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.LoggingSetState:
                return new SetStateAction_1.SetStateAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.LoggingSetLevel:
                return new SetLevelAction_1.SetLevelAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.SetLanguage:
                return new SetLanguageAction_1.SetLanguageAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.SetRegion:
                return new SetRegionAction_1.SetRegionAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.SetTheme:
                return new SetThemeAction_1.SetThemeAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.ToastMessage:
                return new ToastMessageAction_1.ToastMessageAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.UndoPendingChanges:
                return new UndoPendingChangesODataAction_1.UndoPendingChangesODataAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.UpdateODataEntity:
                return new UpdateODataEntityAction_1.UpdateODataEntityAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.UploadStreamOData:
                return new UploadODataStreamAction_1.UploadODataStreamAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.UploadOfflineOData:
                return new UploadOfflineODataAction_1.UploadOfflineODataAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CancelUploadOfflineOData:
                return new CancelUploadOfflineODataAction_1.CancelUploadOfflineODataAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CancelDownloadOfflineOData:
                return new CancelDownloadOfflineODataAction_1.CancelDownloadOfflineODataAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.ApplicationUpdate:
                return new ApplicationUpdateAction_1.ApplicationUpdateAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataRelatedEntity:
                return new CreateODataRelatedEntityAction_1.CreateODataRelatedEntityAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataRelatedMedia:
                return new CreateODataRelatedMediaAction_1.CreateODataRelatedMediaAction(definition);
            case BaseActionDefinition_1.BaseActionDefinition.type.SendRequest:
                return new SendRequestRestServiceAction_1.SendRequestRestServiceAction(definition);
            default:
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.UNKNOWN_ACTION_TYPE, definition.type));
        }
    };
    ActionFactory.CreateActionRunner = function (definition) {
        switch (definition.type) {
            case BaseActionDefinition_1.BaseActionDefinition.type.ChangeSet:
                return new ChangeSetActionRunner_1.ChangeSetActionRunner();
            case BaseActionDefinition_1.BaseActionDefinition.type.DownloadOfflineOData:
                return DownloadOfflineODataActionRunner_1.DownloadOfflineODataActionRunner.getInstance();
            default:
                return new ActionRunner_1.ActionRunner();
        }
    };
    return ActionFactory;
}());
exports.ActionFactory = ActionFactory;
;
exports.default = ActionFactory;
