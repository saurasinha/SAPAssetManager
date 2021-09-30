"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var CancelUploadOfflineODataActionDefinition_1 = require("../definitions/actions/CancelUploadOfflineODataActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ClientSettings_1 = require("../storage/ClientSettings");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var app = require("tns-core-modules/application");
var CancelUploadOfflineODataAction = (function (_super) {
    __extends(CancelUploadOfflineODataAction, _super);
    function CancelUploadOfflineODataAction(definition) {
        var _this = this;
        if (!(definition instanceof CancelUploadOfflineODataActionDefinition_1.CancelUploadOfflineODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_CANCEL_UPLOADOFFLINEODATAACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    CancelUploadOfflineODataAction.prototype.execute = function () {
        var definition = this.definition;
        var builder = new ODataActionBuilder_1.ODataActionBuilder(this.context());
        builder.setService(definition.getService());
        return builder.build().then(function (params) {
            if (ClientSettings_1.ClientSettings.isDemoMode()) {
                throw new Error(ErrorMessage_1.ErrorMessage.NOT_SUPPORTED_IN_DEMOMODE);
            }
            var serviceUrl = IDataService_1.IDataService.instance().urlForServiceName(params.service);
            return IDataService_1.IDataService.instance().cancelUploadOfflineOData({ serviceUrl: serviceUrl }).then(function (data) {
                return app.ios || app.android ?
                    new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
            });
        });
    };
    return CancelUploadOfflineODataAction;
}(ODataAction_1.ODataAction));
exports.CancelUploadOfflineODataAction = CancelUploadOfflineODataAction;
;
