"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var UploadOfflineODataActionDefinition_1 = require("../definitions/actions/UploadOfflineODataActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ClientSettings_1 = require("../storage/ClientSettings");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var app = require("tns-core-modules/application");
var UploadOfflineODataAction = (function (_super) {
    __extends(UploadOfflineODataAction, _super);
    function UploadOfflineODataAction(definition) {
        var _this = this;
        if (!(definition instanceof UploadOfflineODataActionDefinition_1.UploadOfflineODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_UPLOADOFFLINEODATAACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    UploadOfflineODataAction.prototype.execute = function () {
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            throw new Error(ErrorMessage_1.ErrorMessage.NOT_SUPPORTED_IN_DEMOMODE);
        }
        var builder = new ODataActionBuilder_1.ODataActionBuilder(this.context());
        builder.setService(this.getService())
            .setUploadCategories(this.getUploadCategories());
        return builder.build().then(function (params) {
            var uploadParams = {
                serviceUrl: IDataService_1.IDataService.instance().urlForServiceName(params.service)
            };
            var uploadCategories = params.uploadCategories;
            if (uploadCategories && uploadCategories.length > 0) {
                uploadParams.uploadCategories = uploadCategories;
            }
            return IDataService_1.IDataService.instance().uploadOfflineOData(uploadParams).then(function (data) {
                return app.ios || app.android ?
                    new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
            });
        });
    };
    UploadOfflineODataAction.prototype.getUploadCategories = function () {
        var definition = this.definition;
        return definition.getUploadCategories();
    };
    UploadOfflineODataAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return UploadOfflineODataAction;
}(ODataAction_1.ODataAction));
exports.UploadOfflineODataAction = UploadOfflineODataAction;
;
