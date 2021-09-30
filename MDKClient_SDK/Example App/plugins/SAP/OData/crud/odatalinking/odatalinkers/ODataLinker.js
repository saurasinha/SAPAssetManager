"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadService_1 = require("../../ReadService");
var ReadParamsFactory_1 = require("../../ReadParamsFactory");
var CrudParamsHelper_1 = require("../../CrudParamsHelper");
var ErrorMessage_1 = require("../../../../ErrorHandling/ErrorMessage");
var ODataLinker = (function () {
    function ODataLinker(sourceEntitySetName, linkingParams, operation) {
        this.sourceEntitySetName = sourceEntitySetName;
        this.operation = operation;
        this.setNavigationPropertyName(linkingParams);
        this.setTargetReadParams(linkingParams);
    }
    ODataLinker.prototype.execute = function (sourceEntity, dataService, changeSetManager) {
        this.setNavigationProperty(dataService);
        this.acquireTargets(dataService, changeSetManager);
    };
    ODataLinker.prototype.setNavigationPropertyName = function (linkingParams) {
        var navigationPropertyName = linkingParams[ODataLinker.PROPERTYKEY];
        if (navigationPropertyName != null && navigationPropertyName.length !== 0) {
            this.navigationPropertyName = navigationPropertyName;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MALFORMED_PARAM_FOUND, CrudParamsHelper_1.CrudParamsHelper.MALFORMEDPARAM, ODataLinker.PROPERTYKEY));
        }
    };
    ODataLinker.prototype.setTargetReadParams = function (linkingParams) {
        this.targetReadParams = ReadParamsFactory_1.ReadParamsFactory.createReadParams(linkingParams);
    };
    ODataLinker.prototype.setNavigationProperty = function (dataService) {
        var entitySet = dataService.getEntitySet(this.sourceEntitySetName);
        this.navigationProperty = entitySet.getEntityType().getProperty(this.navigationPropertyName);
    };
    ODataLinker.prototype.acquireTargets = function (dataService, changeSetManager) {
        this.targets = ReadService_1.ReadService.entitiesFromParams(this.targetReadParams, dataService, changeSetManager);
        if (this.targets.length === 0) {
            throw new Error(ErrorMessage_1.ErrorMessage.ODATA_ZERO_TARGET_RETURNED);
        }
    };
    ODataLinker.PROPERTYKEY = 'property';
    return ODataLinker;
}());
exports.ODataLinker = ODataLinker;
