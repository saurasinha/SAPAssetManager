"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDataService_1 = require("../data/IDataService");
var DeleteODataEntityActionDefinition_1 = require("../definitions/actions/DeleteODataEntityActionDefinition");
var ODataAction_1 = require("./ODataAction");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var DeleteODataEntityAction = (function (_super) {
    __extends(DeleteODataEntityAction, _super);
    function DeleteODataEntityAction(definition) {
        var _this = this;
        if (!(definition instanceof DeleteODataEntityActionDefinition_1.DeleteODataEntityActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_DELETEODATAENTITYACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    DeleteODataEntityAction.prototype.execute = function () {
        var _this = this;
        return EvaluateTarget_1.asService(this.definition.data, this.context()).then(function (service) {
            _this._resolvedEntitySet = service.entitySet;
            return IDataService_1.IDataService.instance().delete(service, service.headers).then(function (data) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        });
    };
    DeleteODataEntityAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return DeleteODataEntityAction;
}(ODataAction_1.ODataAction));
exports.DeleteODataEntityAction = DeleteODataEntityAction;
;
