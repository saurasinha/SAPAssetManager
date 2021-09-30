"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDataService_1 = require("../data/IDataService");
var ODataAction_1 = require("./ODataAction");
var ReadODataServiceActionDefinition_1 = require("../definitions/actions/ReadODataServiceActionDefinition");
var EvaluateTarget_1 = require("../data/EvaluateTarget");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ReadODataServiceAction = (function (_super) {
    __extends(ReadODataServiceAction, _super);
    function ReadODataServiceAction(definition) {
        var _this = this;
        if (!(definition instanceof ReadODataServiceActionDefinition_1.ReadODataServiceActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_READODATASERVICEACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    ReadODataServiceAction.prototype.execute = function () {
        return EvaluateTarget_1.asService(this.definition.data, this.context()).then(function (service) {
            return IDataService_1.IDataService.instance().read(service).then(function (data) {
                return new ActionResultBuilder_1.ActionResultBuilder().data(data).build();
            });
        });
    };
    return ReadODataServiceAction;
}(ODataAction_1.ODataAction));
exports.ReadODataServiceAction = ReadODataServiceAction;
;
