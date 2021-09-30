"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataLinker_1 = require("./ODataLinker");
var LinkingScenario_1 = require("../odatalinks/LinkingScenario");
var BaseODataCruder_1 = require("../../BaseODataCruder");
var ErrorMessage_1 = require("../../../../ErrorHandling/ErrorMessage");
var ODataLinkDeleter = (function (_super) {
    __extends(ODataLinkDeleter, _super);
    function ODataLinkDeleter(sourceEntitySetName, linkingParams) {
        return _super.call(this, sourceEntitySetName, linkingParams, BaseODataCruder_1.ODataCrudOperation.Delete) || this;
    }
    ODataLinkDeleter.prototype.execute = function (sourceEntity, dataService, changeSetManager) {
        if (dataService != null) {
            _super.prototype.execute.call(this, sourceEntity, dataService, changeSetManager);
            this.performLinking(sourceEntity, dataService.getProvider().getServiceOptions().getSupportsBind());
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE);
        }
    };
    ODataLinkDeleter.prototype.performLinking = function (sourceEntity, supportsBind) {
        for (var _i = 0, _a = this.targets; _i < _a.length; _i++) {
            var target = _a[_i];
            var scenario = new LinkingScenario_1.LinkingScenario(this.navigationProperty, sourceEntity, target, this.operation, false, supportsBind);
            scenario.execute();
        }
    };
    return ODataLinkDeleter;
}(ODataLinker_1.ODataLinker));
exports.ODataLinkDeleter = ODataLinkDeleter;
