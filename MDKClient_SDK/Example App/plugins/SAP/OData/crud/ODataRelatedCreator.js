"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseODataCruder_1 = require("./BaseODataCruder");
var CrudParamsHelper_1 = require("./CrudParamsHelper");
var ReadService_1 = require("./ReadService");
var ReadParamsFactory_1 = require("./ReadParamsFactory");
var ODataHelper_1 = require("../ODataHelper");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var ODataRelatedCreator = (function (_super) {
    __extends(ODataRelatedCreator, _super);
    function ODataRelatedCreator(params) {
        var _this = _super.call(this, params) || this;
        _this.setEntitySetName();
        _this.setProperties();
        _this.setParent();
        _this.setTargetReadParams(_this.parent);
        _this.setParentNavigationPropertyName();
        return _this;
    }
    ODataRelatedCreator.prototype.execute = function (dataService, changeSetManager) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.setChangeSetManager(changeSetManager);
            var entityToCreate = _this.initNewEntity(dataService);
            ODataHelper_1.ODataHelper.setEntityValueProperties(entityToCreate, dataService, _this.properties);
            var parentEntityValue = ReadService_1.ReadService.entityFromParams(_this.targetReadParams, dataService, changeSetManager);
            var options = ODataHelper_1.ODataHelper.getRequestOptions(_this.requestOptionsParm, dataService);
            _this.changeSetManager.createRelatedEntity(entityToCreate, parentEntityValue, parentEntityValue.getEntityType().getProperty(_this.parentNavigationPropertyName), _this.headers, options)
                .then(function () {
                resolve(ODataHelper_1.ODataHelper.entityValueToJson(entityToCreate, _this.getDataContext(dataService)));
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    ODataRelatedCreator.prototype.setEntitySetName = function () {
        this.entitySetName = CrudParamsHelper_1.CrudParamsHelper.getEntitySetNameFromService(this.service);
    };
    ODataRelatedCreator.prototype.setProperties = function () {
        var properties = CrudParamsHelper_1.CrudParamsHelper.getPropertiesFromService(this.service);
        if (properties != null) {
            this.properties = properties;
        }
    };
    ODataRelatedCreator.prototype.setParent = function () {
        this.parent = CrudParamsHelper_1.CrudParamsHelper.getParentFromParams(this.params);
    };
    ODataRelatedCreator.prototype.setParentNavigationPropertyName = function () {
        this.parentNavigationPropertyName = CrudParamsHelper_1.CrudParamsHelper.getPropertyFromParent(this.parent);
    };
    ODataRelatedCreator.prototype.setTargetReadParams = function (linkingParams) {
        this.targetReadParams = ReadParamsFactory_1.ReadParamsFactory.createReadParams(linkingParams);
    };
    ODataRelatedCreator.prototype.initNewEntity = function (dataService) {
        if (dataService != null) {
            var entitySet = dataService.getEntitySet(this.entitySetName);
            return ODataHelper_1.ODataHelper.createEntityValue(entitySet.getEntityType());
        }
        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE, this.entitySetName));
    };
    return ODataRelatedCreator;
}(BaseODataCruder_1.BaseODataCruder));
exports.ODataRelatedCreator = ODataRelatedCreator;
