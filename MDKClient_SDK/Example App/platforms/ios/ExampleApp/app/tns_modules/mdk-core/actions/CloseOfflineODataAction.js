"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var IDataService_1 = require("../data/IDataService");
var ODataAction_1 = require("./ODataAction");
var CloseOfflineODataActionDefinition_1 = require("../definitions/actions/CloseOfflineODataActionDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var TypeConverter_1 = require("../utils/TypeConverter");
var app = require("tns-core-modules/application");
var CloseOfflineODataAction = (function (_super) {
    __extends(CloseOfflineODataAction, _super);
    function CloseOfflineODataAction(definition) {
        var _this = this;
        if (!(definition instanceof CloseOfflineODataActionDefinition_1.CloseOfflineODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_CLOSEOFFLINEODATAACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    CloseOfflineODataAction.prototype.execute = function () {
        var definition = this.definition;
        var builder = new ODataActionBuilder_1.ODataActionBuilder(this.context());
        builder.setForce(definition.getForce()).setService(definition.getService());
        return builder.build().then(function (params) {
            var serviceUrl = IDataService_1.IDataService.instance().urlForServiceName(params.service);
            var force = TypeConverter_1.TypeConverter.toBoolean(params.force);
            return IDataService_1.IDataService.instance().closeOfflineStore({ serviceUrl: serviceUrl, force: force }).then(function (data) {
                return app.ios || app.android ?
                    new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
            });
        });
    };
    return CloseOfflineODataAction;
}(ODataAction_1.ODataAction));
exports.CloseOfflineODataAction = CloseOfflineODataAction;
;
