"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataAction_1 = require("./DataAction");
var IRestService_1 = require("../data/IRestService");
var SendRequestRestServiceActionDefinition_1 = require("../definitions/actions/SendRequestRestServiceActionDefinition");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var SendRequestRestServiceAction = (function (_super) {
    __extends(SendRequestRestServiceAction, _super);
    function SendRequestRestServiceAction(definition) {
        var _this = this;
        if (!(definition instanceof SendRequestRestServiceActionDefinition_1.SendRequestRestServiceActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_SENDREQUESTRESTSERVICEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    SendRequestRestServiceAction.prototype.execute = function () {
        return Promise.all([
            EvaluateTarget_1.asService(this.definition.data, this.context())
        ]).then(function (result) {
            var service = result[0];
            return IRestService_1.IRestService.instance().sendRequest(service).then(function (data) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        });
    };
    SendRequestRestServiceAction.prototype.publishAfterSuccess = function () {
        return Promise.resolve(true);
    };
    return SendRequestRestServiceAction;
}(DataAction_1.DataAction));
exports.SendRequestRestServiceAction = SendRequestRestServiceAction;
;
