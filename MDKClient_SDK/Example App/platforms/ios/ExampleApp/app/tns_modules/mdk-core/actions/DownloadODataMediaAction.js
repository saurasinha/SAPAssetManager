"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDataService_1 = require("../data/IDataService");
var ODataAction_1 = require("./ODataAction");
var DownloadODataMediaActionDefinition_1 = require("../definitions/actions/DownloadODataMediaActionDefinition");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var AppSettingsManager_1 = require("../utils/AppSettingsManager");
var IContext_1 = require("../context/IContext");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var DownloadODataMediaAction = (function (_super) {
    __extends(DownloadODataMediaAction, _super);
    function DownloadODataMediaAction(definition) {
        var _this = _super.call(this, definition) || this;
        _this._hasPendindData = false;
        if (!(definition instanceof DownloadODataMediaActionDefinition_1.DownloadODataMediaActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_DOWNLOADODATAMEDIAACTION_WITHOUT_DEFINITION);
        }
        var pageContext = IContext_1.fromPage();
        if (pageContext && pageContext.element && pageContext.element.definition) {
            var page = pageContext.element.definition.name;
            var pendingData = AppSettingsManager_1.AppSettingsManager.instance().getPendingDataForPage(page);
            if (pendingData) {
                _this.context().clientAPIProps.actionBinding = JSON.parse(pendingData.data);
                _this._hasPendindData = true;
            }
        }
        return _this;
    }
    DownloadODataMediaAction.prototype.execute = function () {
        var _this = this;
        return EvaluateTarget_1.asService(this.definition.data, this.context()).then(function (service) {
            _this._resolvedEntitySet = service.entitySet;
            var builder = new ODataActionBuilder_1.ODataActionBuilder(_this.context());
            builder.setActionResult(_this.definition.actionResult);
            return builder.build().then(function (params) {
                return IDataService_1.IDataService.instance().downloadMedia(service).then(function (data) {
                    if (!params.actionResult) {
                        _this.context().clientData[service.readLink] = data;
                    }
                    return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
                });
            });
        });
    };
    DownloadODataMediaAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(this._hasPendindData);
    };
    return DownloadODataMediaAction;
}(ODataAction_1.ODataAction));
exports.DownloadODataMediaAction = DownloadODataMediaAction;
;
