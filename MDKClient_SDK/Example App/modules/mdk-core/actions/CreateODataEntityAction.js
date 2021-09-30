"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CreateODataEntityActionDefinition_1 = require("../definitions/actions/CreateODataEntityActionDefinition");
var ODataAction_1 = require("./ODataAction");
var IDataService_1 = require("../data/IDataService");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var CreateODataEntityAction = (function (_super) {
    __extends(CreateODataEntityAction, _super);
    function CreateODataEntityAction(definition) {
        var _this = this;
        if (!(definition instanceof CreateODataEntityActionDefinition_1.CreateODataEntityActionDefinition)) {
            throw new Error('Cannot instantiate CreateODataEntityAction without CreateEntity ODataServiceActionDefinition');
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    CreateODataEntityAction.prototype.execute = function () {
        var _this = this;
        return Promise.all([
            EvaluateTarget_1.asService(this.definition.data, this.context()),
            EvaluateTarget_1.asLinks(this.definition.data.CreateLinks, this.context()),
        ]).then(function (result) {
            var service = result[0];
            _this._resolvedEntitySet = service.entitySet;
            var links = result[1];
            return IDataService_1.IDataService.instance().create(service, links, service.headers).then(function (createResult) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(createResult).build();
            });
        });
    };
    CreateODataEntityAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return CreateODataEntityAction;
}(ODataAction_1.ODataAction));
exports.CreateODataEntityAction = CreateODataEntityAction;
;
