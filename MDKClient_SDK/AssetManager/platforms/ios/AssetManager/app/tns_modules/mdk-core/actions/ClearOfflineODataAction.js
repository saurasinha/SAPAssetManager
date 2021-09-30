"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDataService_1 = require("../data/IDataService");
var ODataAction_1 = require("./ODataAction");
var ClearOfflineODataActionDefinition_1 = require("../definitions/actions/ClearOfflineODataActionDefinition");
var ActionResultBuilder_1 = require("../builders/actions/ActionResultBuilder");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var ODataActionBuilder_1 = require("../builders/odata/ODataActionBuilder");
var TypeConverter_1 = require("../utils/TypeConverter");
var app = require("tns-core-modules/application");
var ClearOfflineODataAction = (function (_super) {
    __extends(ClearOfflineODataAction, _super);
    function ClearOfflineODataAction(definition) {
        var _this = this;
        if (!(definition instanceof ClearOfflineODataActionDefinition_1.ClearOfflineODataActionDefinition)) {
            throw new Error(ErrorMessage_1.ErrorMessage.CANNOT_INIT_CLEAROFFLINEDATAACTION_WITHOUT_DEFINITION);
        }
        _this = _super.call(this, definition) || this;
        return _this;
    }
    ClearOfflineODataAction.prototype.execute = function () {
        var definition = this.definition;
        var builder = new ODataActionBuilder_1.ODataActionBuilder(this.context());
        builder.setForce(definition.getForce()).setService(definition.getService());
        return builder.build().then(function (params) {
            var serviceUrl = IDataService_1.IDataService.instance().urlForServiceName(params.service);
            var force = TypeConverter_1.TypeConverter.toBoolean(params.force);
            return IDataService_1.IDataService.instance().clearOfflineStore({ serviceUrl: serviceUrl, force: force }).then(function (data) {
                return app.ios || app.android ?
                    new ActionResultBuilder_1.ActionResultBuilder().data(data).build() : new ActionResultBuilder_1.ActionResultBuilder().data(data).failed().build();
            });
        });
    };
    return ClearOfflineODataAction;
}(ODataAction_1.ODataAction));
exports.ClearOfflineODataAction = ClearOfflineODataAction;
;
