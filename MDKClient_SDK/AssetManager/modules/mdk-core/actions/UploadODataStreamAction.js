"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UploadODataStreamActionDefinition_1 = require("../definitions/actions/UploadODataStreamActionDefinition");
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var UploadODataStreamAction = (function (_super) {
    __extends(UploadODataStreamAction, _super);
    function UploadODataStreamAction(definition) {
        var _this = _super.call(this, definition) || this;
        _this.headerKeys = [];
        if (!(definition instanceof UploadODataStreamActionDefinition_1.UploadODataStreamActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_UPLOADODATASTREAMACTION_WITHOUT_DEFINITION);
        }
        return _this;
    }
    UploadODataStreamAction.prototype.execute = function () {
        var _this = this;
        var definition = this.definition;
        return EvaluateTarget_1.asService(this.definition.data, this.context()).then(function (service) {
            _this._resolvedEntitySet = service.entitySet;
            return IDataService_1.IDataService.instance().uploadStream(service, service.headers).then(function (data) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        });
    };
    UploadODataStreamAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return UploadODataStreamAction;
}(ODataAction_1.ODataAction));
exports.UploadODataStreamAction = UploadODataStreamAction;
;
