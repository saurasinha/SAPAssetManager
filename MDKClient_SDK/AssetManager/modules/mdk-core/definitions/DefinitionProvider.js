"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDefinitionProvider_1 = require("./IDefinitionProvider");
var ApplicationDefinition_1 = require("./ApplicationDefinition");
var PageDefinition_1 = require("./PageDefinition");
var GlobalDefinition_1 = require("./GlobalDefinition");
var BaseActionDefinition_1 = require("./actions/BaseActionDefinition");
var NavigationActionDefinition_1 = require("./actions/NavigationActionDefinition");
var ChangeSetActionDefinition_1 = require("./actions/ChangeSetActionDefinition");
var ChangeUserPasscodeActionDefinition_1 = require("./actions/ChangeUserPasscodeActionDefinition");
var VerifyPasscodeActionDefinition_1 = require("./actions/VerifyPasscodeActionDefinition");
var SetLanguageActionDefinition_1 = require("./actions/SetLanguageActionDefinition");
var SetRegionActionDefinition_1 = require("./actions/SetRegionActionDefinition");
var SetThemeActionDefinition_1 = require("./actions/SetThemeActionDefinition");
var CheckRequiredFieldsActionDefinition_1 = require("./actions/CheckRequiredFieldsActionDefinition");
var MessageActionDefinition_1 = require("./actions/MessageActionDefinition");
var ToastMessageActionDefinition_1 = require("./actions/ToastMessageActionDefinition");
var BannerMessageActionDefinition_1 = require("./actions/BannerMessageActionDefinition");
var OpenODataServiceActionDefinition_1 = require("./actions/OpenODataServiceActionDefinition");
var CreateODataServiceActionDefinition_1 = require("./actions/CreateODataServiceActionDefinition");
var DataServiceDefinition_1 = require("./DataServiceDefinition");
var ReadODataServiceActionDefinition_1 = require("./actions/ReadODataServiceActionDefinition");
var UpdateODataEntityActionDefinition_1 = require("./actions/UpdateODataEntityActionDefinition");
var InitializeODataActionDefinition_1 = require("./actions/InitializeODataActionDefinition");
var InitOfflineODataActionDefinition_1 = require("./actions/InitOfflineODataActionDefinition");
var CloseOfflineODataActionDefinition_1 = require("./actions/CloseOfflineODataActionDefinition");
var ClearOfflineODataActionDefinition_1 = require("./actions/ClearOfflineODataActionDefinition");
var DownloadODataMediaActionDefinition_1 = require("./actions/DownloadODataMediaActionDefinition");
var DownloadOfflineODataActionDefinition_1 = require("./actions/DownloadOfflineODataActionDefinition");
var UploadOfflineODataActionDefinition_1 = require("./actions/UploadOfflineODataActionDefinition");
var CancelUploadOfflineODataActionDefinition_1 = require("./actions/CancelUploadOfflineODataActionDefinition");
var CancelDownloadOfflineODataActionDefinition_1 = require("./actions/CancelDownloadOfflineODataActionDefinition");
var CreateODataEntityActionDefinition_1 = require("./actions/CreateODataEntityActionDefinition");
var OpenDocumentActionDefinition_1 = require("./actions/OpenDocumentActionDefinition");
var LogMessageActionDefinition_1 = require("./actions/logger/LogMessageActionDefinition");
var LogoutActionDefinition_1 = require("./actions/LogoutActionDefinition");
var LogUploadActionDefinition_1 = require("./actions/logger/LogUploadActionDefinition");
var PopoverActionDefinition_1 = require("./actions/PopoverActionDefinition");
var ProgressBannerActionDefinition_1 = require("./actions/ProgressBannerActionDefinition");
var PushNotificationRegisterActionDefinition_1 = require("./actions/PushNotificationRegisterActionDefinition");
var PushNotificationUnregisterActionDefinition_1 = require("./actions/PushNotificationUnregisterActionDefinition");
var SetLevelActionDefinition_1 = require("./actions/logger/SetLevelActionDefinition");
var SetStateActionDefinition_1 = require("./actions/logger/SetStateActionDefinition");
var RuleDefinition_1 = require("./RuleDefinition");
var DefinitionPath_1 = require("./DefinitionPath");
var ClosePageActionDefinition_1 = require("./actions/ClosePageActionDefinition");
var DeleteODataEntityActionDefinition_1 = require("./actions/DeleteODataEntityActionDefinition");
var CreateODataMediaActionDefinition_1 = require("./actions/CreateODataMediaActionDefinition");
var DeleteODataMediaActionDefinition_1 = require("./actions/DeleteODataMediaActionDefinition");
var FilterActionDefinition_1 = require("./actions/FilterActionDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var OpenBarcodeScannerActionDefinition_1 = require("./actions/OpenBarcodeScannerActionDefinition");
var CheckBarcodeScannerPrerequisiteActionDefinition_1 = require("./actions/CheckBarcodeScannerPrerequisiteActionDefinition");
var CallFunctionODataActionDefinition_1 = require("./actions/CallFunctionODataActionDefinition");
var DownloadODataStreamActionDefinition_1 = require("./actions/DownloadODataStreamActionDefinition");
var UploadODataStreamActionDefinition_1 = require("./actions/UploadODataStreamActionDefinition");
var UndoPendingChangesODataActionDefinition_1 = require("./actions/UndoPendingChangesODataActionDefinition");
var ApplicationUpdateActionDefinition_1 = require("./actions/ApplicationUpdateActionDefinition");
var CreateODataRelatedEntityActionDefinition_1 = require("./actions/CreateODataRelatedEntityActionDefinition");
var CreateODataRelatedMediaActionDefinition_1 = require("./actions/CreateODataRelatedMediaActionDefinition");
var SendRequestRestServiceActionDefinition_1 = require("./actions/SendRequestRestServiceActionDefinition");
var DefinitionProvider = (function (_super) {
    __extends(DefinitionProvider, _super);
    function DefinitionProvider(defLoader) {
        var _this = _super.call(this) || this;
        _this._defLoader = defLoader;
        return _this;
    }
    DefinitionProvider.prototype.getApplicationDefinition = function () {
        var oApplicationData = this._defLoader.loadDefinition(null) || {};
        return new ApplicationDefinition_1.ApplicationDefinition('', oApplicationData);
    };
    DefinitionProvider.prototype.getDefinition = function (oPathObject) {
        var _this = this;
        if (!oPathObject) {
            var reason = ErrorMessage_1.ErrorMessage.INVALID_CALL_DEFINITIONPROVIDER_AS_SPATH_UNDEFINED;
            throw new Error(reason);
        }
        if (typeof oPathObject === "string") {
            var oPath_1 = new DefinitionPath_1.DefinitionPath(oPathObject);
            if (oPath_1.type === DefinitionPath_1.DefinitionPath.types.Actions) {
                return this._defLoader.loadJsonDefinition(oPathObject).then(function (oDefinitionData) {
                    return _this.getActionDefinition(oPath_1, oDefinitionData);
                }).catch(function () { });
            }
            if (oPath_1.type === DefinitionPath_1.DefinitionPath.types.Pages) {
                return this._defLoader.loadJsonDefinition(oPathObject).then(function (oDefinitionData) {
                    return _this.getJSONDefinition(oPath_1, oDefinitionData);
                }).catch(function () { });
            }
            if (oPath_1.type === DefinitionPath_1.DefinitionPath.types.Rules) {
                return this._defLoader.loadJsDefinition(oPathObject).then(function (oDefinitionData) {
                    return _this.getRuleDefinition(oPath_1, oDefinitionData);
                }).catch(function () { });
            }
            var oDefinitionData = this._defLoader.loadDefinition(oPathObject);
            if (!oDefinitionData) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_DEFINITION_PATH, oPathObject));
            }
            if (oPath_1.type === DefinitionPath_1.DefinitionPath.types.Images || oPath_1.type === DefinitionPath_1.DefinitionPath.types.Styles
                || oPath_1.type === DefinitionPath_1.DefinitionPath.types.SDKStyles || oPath_1.type === DefinitionPath_1.DefinitionPath.types.i18n
                || oPath_1.type === DefinitionPath_1.DefinitionPath.types.Extensions) {
                if (oPath_1.type === DefinitionPath_1.DefinitionPath.types.Styles) {
                    var defData = oDefinitionData;
                    if (defData && defData.hasOwnProperty('__esModule') && defData.__esModule &&
                        defData.hasOwnProperty('default') && defData.default &&
                        defData[Symbol.toStringTag] === 'Module') {
                        return defData.default;
                    }
                }
                return oDefinitionData;
            }
            else {
                return this.getJSONDefinition(oPath_1, oDefinitionData);
            }
        }
        else if (oPathObject.constructor === Object) {
            return this._defLoader.loadJsonDefinition(oPathObject.Name).then(function (oOriginalDefinitionData) {
                if (!oOriginalDefinitionData) {
                    throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_DEFINITION_PATH, oPathObject));
                }
                var oDefinitionData = JSON.parse(JSON.stringify(oOriginalDefinitionData));
                var oOverrideData = oPathObject.Properties;
                for (var name in oOverrideData) {
                    if (oOverrideData.hasOwnProperty(name)) {
                        if (name === '_Type') {
                            continue;
                        }
                        if (oOverrideData[name].constructor === Object) {
                            if (!oDefinitionData[name]) {
                                oDefinitionData[name] = oOverrideData[name];
                            }
                            else if (oDefinitionData[name].constructor === Object) {
                                _this.copyValue(oDefinitionData[name], oOverrideData[name]);
                            }
                        }
                        else {
                            oDefinitionData[name] = oOverrideData[name];
                        }
                    }
                }
                var oPath = new DefinitionPath_1.DefinitionPath(oPathObject.Name);
                var oJSONDefinition = _this.getJSONDefinition(oPath, oDefinitionData);
                return oJSONDefinition;
            });
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_DEFINITION_PATH, oPathObject));
        }
    };
    DefinitionProvider.prototype.getDefinitionSync = function (oPathObject) {
        if (!oPathObject) {
            var reason = ErrorMessage_1.ErrorMessage.INVALID_CALL_DEFINITIONPROVIDER_AS_SPATH_UNDEFINED;
            throw new Error(reason);
        }
        if (typeof oPathObject === 'string') {
            var oPath = new DefinitionPath_1.DefinitionPath(oPathObject);
            var oDefinitionData = this._defLoader.loadDefinition(oPathObject);
            if (!oDefinitionData) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_DEFINITION_PATH, oPathObject));
            }
            if (oPath.type === DefinitionPath_1.DefinitionPath.types.Rules) {
                return this.getRuleDefinition(oPath, oDefinitionData);
            }
            if (oPath.type === DefinitionPath_1.DefinitionPath.types.Images || oPath.type === DefinitionPath_1.DefinitionPath.types.Styles
                || oPath.type === DefinitionPath_1.DefinitionPath.types.SDKStyles || oPath.type === DefinitionPath_1.DefinitionPath.types.i18n
                || oPath.type === DefinitionPath_1.DefinitionPath.types.Extensions) {
                return oDefinitionData;
            }
            else {
                return this.getJSONDefinition(oPath, oDefinitionData);
            }
        }
        else if (oPathObject.constructor === Object) {
            var oOriginalDefinitionData = this._defLoader.loadDefinition(oPathObject.Name);
            if (!oOriginalDefinitionData) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_DEFINITION_PATH, oPathObject));
            }
            var oDefinitionData = JSON.parse(JSON.stringify(oOriginalDefinitionData));
            var oOverrideData = oPathObject.Properties;
            for (var name in oOverrideData) {
                if (oOverrideData.hasOwnProperty(name)) {
                    if (name === '_Type') {
                        continue;
                    }
                    if (oOverrideData[name].constructor === Object) {
                        if (!oDefinitionData[name]) {
                            oDefinitionData[name] = oOverrideData[name];
                        }
                        else if (oDefinitionData[name].constructor === Object) {
                            this.copyValue(oDefinitionData[name], oOverrideData[name]);
                        }
                    }
                    else {
                        oDefinitionData[name] = oOverrideData[name];
                    }
                }
            }
            var oPath = new DefinitionPath_1.DefinitionPath(oPathObject.Name);
            var oJSONDefinition = this.getJSONDefinition(oPath, oDefinitionData);
            return oJSONDefinition;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_DEFINITION_PATH, oPathObject));
        }
    };
    DefinitionProvider.prototype.getExtensionDefinition = function (sPath) {
        if (!sPath) {
            var reason = ErrorMessage_1.ErrorMessage.INVALID_CALL_DEFINITIONPROVIDER_AS_SPATH_UNDEFINED;
            throw new Error(reason);
        }
        var oDefinitionExtension = this._defLoader.loadDefinition(sPath);
        return oDefinitionExtension;
    };
    DefinitionProvider.prototype.getRuleDefinition = function (oPath, oRuleDefinitionData) {
        return new RuleDefinition_1.RuleDefinition(oPath.path, oRuleDefinitionData);
    };
    DefinitionProvider.prototype.getJSONDefinition = function (oPath, oDefinitionData) {
        switch (oPath.type) {
            case DefinitionPath_1.DefinitionPath.types.Pages:
                return new PageDefinition_1.PageDefinition(oPath.path, oDefinitionData);
            case DefinitionPath_1.DefinitionPath.types.Actions:
                return this.getActionDefinition(oPath, oDefinitionData);
            case DefinitionPath_1.DefinitionPath.types.Globals:
                return new GlobalDefinition_1.GlobalDefinition(oPath.path, oDefinitionData);
            case DefinitionPath_1.DefinitionPath.types.Services:
                return new DataServiceDefinition_1.DataServiceDefinition(oPath.path, oDefinitionData);
            default:
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.UNKNOWN_DEFINITION_TYPE, oPath.type));
        }
    };
    DefinitionProvider.prototype.getActionDefinition = function (oPath, oDefinitionData) {
        switch (oDefinitionData._Type) {
            case BaseActionDefinition_1.BaseActionDefinition.type.Navigation:
                return new NavigationActionDefinition_1.NavigationActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CheckRequiredFields:
                return new CheckRequiredFieldsActionDefinition_1.CheckRequiredFieldsActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.Message:
                return new MessageActionDefinition_1.MessageActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.ToastMessage:
                return new ToastMessageActionDefinition_1.ToastMessageActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.BannerMessage:
                return new BannerMessageActionDefinition_1.BannerMessageActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.OpenODataService:
                return new OpenODataServiceActionDefinition_1.OpenODataServiceActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataService:
                return new CreateODataServiceActionDefinition_1.CreateODataServiceActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.ReadODataService:
                return new ReadODataServiceActionDefinition_1.ReadODataServiceActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.UpdateODataEntity:
                return new UpdateODataEntityActionDefinition_1.UpdateODataEntityActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.InitializeOData:
                return new InitializeODataActionDefinition_1.InitializeODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.InitializeOfflineOData:
                return new InitOfflineODataActionDefinition_1.InitOfflineODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CloseOfflineOData:
                return new CloseOfflineODataActionDefinition_1.CloseOfflineODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.ClearOfflineOData:
                return new ClearOfflineODataActionDefinition_1.ClearOfflineODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.DownloadMediaOData:
                return new DownloadODataMediaActionDefinition_1.DownloadODataMediaActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.DownloadOfflineOData:
                return new DownloadOfflineODataActionDefinition_1.DownloadOfflineODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.UploadOfflineOData:
                return new UploadOfflineODataActionDefinition_1.UploadOfflineODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CancelUploadOfflineOData:
                return new CancelUploadOfflineODataActionDefinition_1.CancelUploadOfflineODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CancelDownloadOfflineOData:
                return new CancelDownloadOfflineODataActionDefinition_1.CancelDownloadOfflineODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataEntity:
                return new CreateODataEntityActionDefinition_1.CreateODataEntityActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataMedia:
                return new CreateODataMediaActionDefinition_1.CreateODataMediaActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.OpenDocument:
                return new OpenDocumentActionDefinition_1.OpenDocumentActionDefinition(oPath, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.PopoverMenu:
                return new PopoverActionDefinition_1.PopoverActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.ProgressBanner:
                return new ProgressBannerActionDefinition_1.ProgressBannerActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.PushNotificationRegister:
                return new PushNotificationRegisterActionDefinition_1.PushNotificationRegisterActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.PushNotificationUnregister:
                return new PushNotificationUnregisterActionDefinition_1.PushNotificationUnregisterActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.ClosePage:
                return new ClosePageActionDefinition_1.ClosePageActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.DeleteODataEntity:
                return new DeleteODataEntityActionDefinition_1.DeleteODataEntityActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.LoggingLogMessage:
                return new LogMessageActionDefinition_1.LogMessageActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.LoggingSetState:
                return new SetStateActionDefinition_1.SetStateActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.LoggingSetLevel:
                return new SetLevelActionDefinition_1.SetLevelActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.LoggingUpload:
                return new LogUploadActionDefinition_1.LogUploadActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.ChangeSet:
                return new ChangeSetActionDefinition_1.ChangeSetActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.Filter:
                return new FilterActionDefinition_1.FilterActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.DeleteODataMedia:
                return new DeleteODataMediaActionDefinition_1.DeleteODataMediaActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.ChangeUserPasscode:
                return new ChangeUserPasscodeActionDefinition_1.ChangeUserPasscodeActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.VerifyPasscode:
                return new VerifyPasscodeActionDefinition_1.VerifyPasscodeActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.SetLanguage:
                return new SetLanguageActionDefinition_1.SetLanguageActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.SetRegion:
                return new SetRegionActionDefinition_1.SetRegionActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.SetTheme:
                return new SetThemeActionDefinition_1.SetThemeActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.Logout:
                return new LogoutActionDefinition_1.LogoutActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.OpenBarcodeScanner:
                return new OpenBarcodeScannerActionDefinition_1.OpenBarcodeScannerActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CheckBarcodeScannerPrerequisite:
                return new CheckBarcodeScannerPrerequisiteActionDefinition_1.CheckBarcodeScannerPrerequisiteActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.ODataCallFunction:
                return new CallFunctionODataActionDefinition_1.CallFunctionODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.DownloadStreamOData:
                return new DownloadODataStreamActionDefinition_1.DownloadODataStreamActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.UploadStreamOData:
                return new UploadODataStreamActionDefinition_1.UploadODataStreamActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.UndoPendingChanges:
                return new UndoPendingChangesODataActionDefinition_1.UndoPendingChangesODataActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.ApplicationUpdate:
                return new ApplicationUpdateActionDefinition_1.ApplicationUpdateActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataRelatedEntity:
                return new CreateODataRelatedEntityActionDefinition_1.CreateODataRelatedEntityActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.CreateODataRelatedMedia:
                return new CreateODataRelatedMediaActionDefinition_1.CreateODataRelatedMediaActionDefinition(oPath.path, oDefinitionData);
            case BaseActionDefinition_1.BaseActionDefinition.type.SendRequest:
                return new SendRequestRestServiceActionDefinition_1.SendRequestRestServiceActionDefinition(oPath.path, oDefinitionData);
            default:
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.UNKNOWN_ACTION_TYPE, oDefinitionData._Type));
        }
    };
    DefinitionProvider.prototype.getLocalizationResourceList = function () {
        return this._defLoader.getLocalizationResourceList();
    };
    DefinitionProvider.prototype.isDefinitionPathValid = function (oPathObject) {
        if (!oPathObject) {
            return false;
        }
        if (typeof oPathObject === "string") {
            var oDefinitionData = this._defLoader.loadDefinition(oPathObject);
            if (oDefinitionData) {
                return true;
            }
        }
        else if (oPathObject.constructor === Object) {
            var oDefinitionData = this._defLoader.loadDefinition(oPathObject.Name);
            if (oDefinitionData) {
                return true;
            }
        }
        return false;
    };
    DefinitionProvider.prototype.copyValue = function (oDefinitionData, oOverrideData) {
        for (var name in oOverrideData) {
            if (oOverrideData.hasOwnProperty(name)) {
                if (oOverrideData[name].constructor === Object) {
                    this.copyValue(oDefinitionData[name], oOverrideData[name]);
                }
                else {
                    oDefinitionData[name] = oOverrideData[name];
                }
            }
        }
    };
    DefinitionProvider.prototype.setDefintionLoader = function (definitionLoader) {
        this._defLoader = definitionLoader;
    };
    return DefinitionProvider;
}(IDefinitionProvider_1.IDefinitionProvider));
exports.DefinitionProvider = DefinitionProvider;
;
