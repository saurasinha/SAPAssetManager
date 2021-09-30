"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateODataRelatedEntityActionDefinition_1 = require("../definitions/actions/CreateODataRelatedEntityActionDefinition");
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var CreateODataRelatedEntityAction = (function (_super) {
    __extends(CreateODataRelatedEntityAction, _super);
    function CreateODataRelatedEntityAction(definition) {
        var _this = this;
        if (!(definition instanceof CreateODataRelatedEntityActionDefinition_1.CreateODataRelatedEntityActionDefinition)) {
            throw new Error('Cannot instantiate CreateODataRelatedEntityAction without CreateODataRelatedEntityActionDefinition');
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    CreateODataRelatedEntityAction.prototype.execute = function () {
        var _this = this;
        return Promise.all([
            EvaluateTarget_1.asService(this.definition.data, this.context()),
            EvaluateTarget_1.asParent(this.definition.data, this.context())
        ]).then(function (result) {
            var service = result[0];
            _this.setEmptyProperties(service);
            _this._resolvedEntitySet = service.entitySet;
            var parent = result[1];
            return IDataService_1.IDataService.instance().createRelated(service, parent, service.headers).then(function (createResult) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(createResult).build();
            });
        });
    };
    CreateODataRelatedEntityAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return CreateODataRelatedEntityAction;
}(ODataAction_1.ODataAction));
exports.CreateODataRelatedEntityAction = CreateODataRelatedEntityAction;
;
