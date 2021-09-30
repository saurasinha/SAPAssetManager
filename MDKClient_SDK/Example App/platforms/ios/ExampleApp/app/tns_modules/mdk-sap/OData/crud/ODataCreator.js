"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseODataCruder_1 = require("./BaseODataCruder");
var CrudParamsHelper_1 = require("./CrudParamsHelper");
var ODataHelper_1 = require("../ODataHelper");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var ODataCreator = (function (_super) {
    __extends(ODataCreator, _super);
    function ODataCreator(params) {
        var _this = _super.call(this, params) || this;
        _this.setEntitySetName();
        _this.setProperties();
        _this.setLinkCreators();
        return _this;
    }
    ODataCreator.prototype.execute = function (dataService, changeSetManager) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.setChangeSetManager(changeSetManager);
            var options = ODataHelper_1.ODataHelper.getRequestOptions(_this.requestOptionsParm, dataService);
            var entityToCreate = _this.initNewEntity(dataService);
            ODataHelper_1.ODataHelper.setEntityValueProperties(entityToCreate, dataService, _this.properties);
            var linkToParentEntity = _this.executeLinkCreators(dataService, entityToCreate);
            if (linkToParentEntity != null) {
                var relatedParent = linkToParentEntity.getPrincipalEntity();
                var navigationPropertyFromRelatedParent = ODataHelper_1.ODataHelper.partnerPropertyFromEntity(linkToParentEntity.getDependantNavigationProperty(), relatedParent);
                _this.changeSetManager.createRelatedEntity(entityToCreate, relatedParent, navigationPropertyFromRelatedParent, _this.headers, options).then(function () {
                    resolve(ODataHelper_1.ODataHelper.entityValueToJson(entityToCreate, _this.getDataContext(dataService)));
                }).catch(function (error) {
                    reject(error);
                });
            }
            else {
                changeSetManager.createEntity(entityToCreate, _this.headers, options).then(function () {
                    resolve(ODataHelper_1.ODataHelper.entityValueToJson(entityToCreate, _this.getDataContext(dataService)));
                }).catch(function (error) {
                    reject(error);
                });
            }
        });
    };
    ODataCreator.prototype.setEntitySetName = function () {
        this.entitySetName = CrudParamsHelper_1.CrudParamsHelper.getEntitySetNameFromService(this.service);
    };
    ODataCreator.prototype.setProperties = function () {
        var properties = CrudParamsHelper_1.CrudParamsHelper.getPropertiesFromService(this.service);
        if (properties != null) {
            this.properties = properties;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_CREATE_OPERATION_EMPTY_PROPERTY_NOT_ALLOWED, CrudParamsHelper_1.CrudParamsHelper.MALFORMEDPARAM));
        }
    };
    ODataCreator.prototype.setLinkCreators = function () {
        this.linkCreators = CrudParamsHelper_1.CrudParamsHelper.getLinkCreatorsFromParams(this.params);
    };
    ODataCreator.prototype.initNewEntity = function (dataService) {
        if (dataService != null) {
            var entitySet = dataService.getEntitySet(this.entitySetName);
            var entityValue = ODataHelper_1.ODataHelper.createEntityValue(entitySet.getEntityType());
            entityValue.setEntitySet(entitySet);
            return entityValue;
        }
        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE, this.entitySetName));
    };
    ODataCreator.prototype.executeLinkCreators = function (dataService, sourceEntity) {
        var linkToParentEntity = null;
        if (this.linkCreators != null) {
            for (var _i = 0, _a = this.linkCreators; _i < _a.length; _i++) {
                var linkCreator = _a[_i];
                var canUseCreateRelatedEntity = (linkToParentEntity == null);
                var link_1 = linkCreator.execute(sourceEntity, dataService, this.changeSetManager, canUseCreateRelatedEntity);
                if (link_1 != null) {
                    if (linkToParentEntity != null) {
                        throw new Error(ErrorMessage_1.ErrorMessage.ODATA_CREATE_RELATED_ENTITY_NOT_ALLOWED);
                    }
                    else {
                        linkToParentEntity = link_1;
                    }
                }
            }
        }
        return linkToParentEntity;
    };
    return ODataCreator;
}(BaseODataCruder_1.BaseODataCruder));
exports.ODataCreator = ODataCreator;
