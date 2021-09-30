"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataLinker_1 = require("./ODataLinker");
var LinkingScenario_1 = require("../odatalinks/LinkingScenario");
var BaseODataCruder_1 = require("../../BaseODataCruder");
var ErrorMessage_1 = require("../../../../ErrorHandling/ErrorMessage");
var ODataLinkCreator = (function (_super) {
    __extends(ODataLinkCreator, _super);
    function ODataLinkCreator(sourceEntitySetName, linkingParams, operation) {
        if (operation === void 0) { operation = BaseODataCruder_1.ODataCrudOperation.Create; }
        return _super.call(this, sourceEntitySetName, linkingParams, operation) || this;
    }
    ODataLinkCreator.prototype.execute = function (sourceEntity, dataService, changeSetManager, canUseCreateRelatedEntity) {
        if (canUseCreateRelatedEntity === void 0) { canUseCreateRelatedEntity = false; }
        if (dataService != null) {
            _super.prototype.execute.call(this, sourceEntity, dataService, changeSetManager);
            return this.performLinking(sourceEntity, canUseCreateRelatedEntity, dataService.getProvider().getServiceOptions().getSupportsBind());
        }
        throw new Error(ErrorMessage_1.ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE);
    };
    ODataLinkCreator.prototype.isTargetCreatedInSameChangeSet = function () {
        return this.targetReadParams.isTargetCreatedInSameChangeSet();
    };
    ODataLinkCreator.prototype.performLinking = function (sourceEntity, canUseCreateRelatedEntity, supportsBind) {
        var linkToParentEntity = null;
        for (var _i = 0, _a = this.targets; _i < _a.length; _i++) {
            var target = _a[_i];
            if (target.getReadLink() == null) {
                target.setReadLink(target.getCanonicalURL());
            }
            var scenario = new LinkingScenario_1.LinkingScenario(this.navigationProperty, sourceEntity, target, this.operation, canUseCreateRelatedEntity, supportsBind);
            var link_1 = scenario.execute();
            if (link_1 != null) {
                if (linkToParentEntity != null) {
                    throw new Error(ErrorMessage_1.ErrorMessage.ODATA_CREATE_RELATED_ENTITY_NOT_ALLOWED);
                }
                else {
                    linkToParentEntity = link_1;
                }
            }
        }
        return linkToParentEntity;
    };
    return ODataLinkCreator;
}(ODataLinker_1.ODataLinker));
exports.ODataLinkCreator = ODataLinkCreator;
