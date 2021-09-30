"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var CancelDownloadOfflineODataActionDefinition_1 = require("../definitions/actions/CancelDownloadOfflineODataActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ClientSettings_1 = require("../storage/ClientSettings");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var app = require("tns-core-modules/application");
var CancelDownloadOfflineODataAction = (function (_super) {
    __extends(CancelDownloadOfflineODataAction, _super);
    function CancelDownloadOfflineODataAction(definition) {
        var _this = this;
        if (!(definition instanceof CancelDownloadOfflineODataActionDefinition_1.CancelDownloadOfflineODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_CANCEL_DOWNLOADOFFLINEODATAACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    CancelDownloadOfflineODataAction.prototype.execute = function () {
        var definition = this.definition;
        var builder = new ODataActionBuilder_1.ODataActionBuilder(this.context());
        builder.setService(definition.getService());
        return builder.build().then(function (params) {
            if (ClientSettings_1.ClientSettings.isDemoMode()) {
                throw new Error(ErrorMessage_1.ErrorMessage.NOT_SUPPORTED_IN_DEMOMODE);
            }
            var serviceUrl = IDataService_1.IDataService.instance().urlForServiceName(params.service);
            return IDataService_1.IDataService.instance().cancelDownloadOfflineOData({ serviceUrl: serviceUrl }).then(function (data) {
                return app.ios || app.android ?
                    new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
            });
        });
    };
    return CancelDownloadOfflineODataAction;
}(ODataAction_1.ODataAction));
exports.CancelDownloadOfflineODataAction = CancelDownloadOfflineODataAction;
;
