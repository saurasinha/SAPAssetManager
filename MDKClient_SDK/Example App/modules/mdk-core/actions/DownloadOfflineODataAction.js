"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var DownloadOfflineODataActionDefinition_1 = require("../definitions/actions/DownloadOfflineODataActionDefinition");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var AppSettingsManager_1 = require("../utils/AppSettingsManager");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ClientSettings_1 = require("../storage/ClientSettings");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var app = require("tns-core-modules/application");
var DownloadOfflineODataAction = (function (_super) {
    __extends(DownloadOfflineODataAction, _super);
    function DownloadOfflineODataAction(definition) {
        var _this = _super.call(this, definition) || this;
        if (!(definition instanceof DownloadOfflineODataActionDefinition_1.DownloadOfflineODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_DOWNLOADOFFLINEODATAACTION_WITHOUT_DEFINITION);
        }
        var page = _this.context().element.definition.name;
        var binding = _this.context().clientAPIProps.actionBinding;
        var asyncBinding = undefined;
        if (binding) {
            asyncBinding = binding;
            if (definition.downloadKey && binding[definition.downloadKey]) {
                asyncBinding = binding[definition.downloadKey];
            }
        }
        if (asyncBinding) {
            _this._pendindReadLink = EvaluateTarget_1.asReadLink(asyncBinding);
            if (_this._pendindReadLink) {
                var value = JSON.stringify(asyncBinding);
                AppSettingsManager_1.AppSettingsManager.instance().addPendingDownload(_this._pendindReadLink, page, value);
            }
        }
        return _this;
    }
    DownloadOfflineODataAction.prototype.execute = function () {
        var _this = this;
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            throw new Error(ErrorMessage_1.ErrorMessage.NOT_SUPPORTED_IN_DEMOMODE);
        }
        var builder = new ODataActionBuilder_1.ODataActionBuilder(this.context());
        builder.setService(this.getService());
        return builder.build().then(function (params) {
            var serviceUrl = IDataService_1.IDataService.instance().urlForServiceName(params.service);
            if (_this._pendindReadLink && !_this.context().clientAPIProps.actionBinding) {
                var pendingData = AppSettingsManager_1.AppSettingsManager.instance().getPendingDataForKey(_this._pendindReadLink);
                if (pendingData && pendingData.data) {
                    _this.context().clientAPIProps.actionBinding = JSON.parse(pendingData.data);
                }
            }
            var actionBinding;
            if (_this.context().clientAPIProps.actionBinding) {
                actionBinding = __assign({}, _this.context().clientAPIProps.actionBinding);
            }
            return EvaluateTarget_1.asDefiningRequests(_this.definition.data, _this.context()).then(function (definingRequests) {
                if (_this._pendindReadLink) {
                    _this.context().resetClientAPIProps();
                }
                return IDataService_1.IDataService.instance().downloadOfflineOData({ serviceUrl: serviceUrl, definingRequests: definingRequests }).then(function (data) {
                    if (actionBinding) {
                        _this.context().clientAPIProps.actionBinding = actionBinding;
                    }
                    return app.ios || app.android ?
                        new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
                });
            });
        });
    };
    DownloadOfflineODataAction.prototype.pendingReadLink = function () {
        return this._pendindReadLink;
    };
    DownloadOfflineODataAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return DownloadOfflineODataAction;
}(ODataAction_1.ODataAction));
exports.DownloadOfflineODataAction = DownloadOfflineODataAction;
;
