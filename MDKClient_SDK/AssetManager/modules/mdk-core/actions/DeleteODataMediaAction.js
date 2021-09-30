"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataAction_1 = require("./ODataAction");
var DeleteODataMediaActionDefinition_1 = require("../definitions/actions/DeleteODataMediaActionDefinition");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var IDataService_1 = require("../data/IDataService");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var DeleteODataMediaAction = (function (_super) {
    __extends(DeleteODataMediaAction, _super);
    function DeleteODataMediaAction(definition) {
        var _this = this;
        if (!(definition instanceof DeleteODataMediaActionDefinition_1.DeleteODataMediaActionDefinition)) {
            throw new Error('Cannot instantiate DeleteODataMediaActionDefinition without DeleteODataMediaActionDefinition');
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    DeleteODataMediaAction.prototype.execute = function () {
        var _this = this;
        return EvaluateTarget_1.asService(this.definition.data, this.context()).then(function (service) {
            _this._resolvedEntitySet = service.entitySet;
            return IDataService_1.IDataService.instance().deleteMedia(service).then(function (data) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        });
    };
    DeleteODataMediaAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return DeleteODataMediaAction;
}(ODataAction_1.ODataAction));
exports.DeleteODataMediaAction = DeleteODataMediaAction;
;
