"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseAction_1 = require("./BaseAction");
var ApplicationUpdateActionDefinition_1 = require("../definitions/actions/ApplicationUpdateActionDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var LifecycleManager_1 = require("../lifecycleManagement/LifecycleManager");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ApplicationUpdateAction = (function (_super) {
    __extends(ApplicationUpdateAction, _super);
    function ApplicationUpdateAction(definition) {
        var _this = this;
        if (!(definition instanceof ApplicationUpdateActionDefinition_1.ApplicationUpdateActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_APPLICATIONUPDATE_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    ApplicationUpdateAction.prototype.execute = function () {
        return LifecycleManager_1.LifecycleManager.getInstance().executeAppUpdateCheck().then(function (data) {
            if (!ActionResultBuilder_1.ActionResultBuilder.implementsIActionResult(data)) {
                data = new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            }
            return data;
        }).catch(function (error) {
            throw (error);
        });
    };
    ApplicationUpdateAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return ApplicationUpdateAction;
}(BaseAction_1.BaseAction));
exports.ApplicationUpdateAction = ApplicationUpdateAction;
