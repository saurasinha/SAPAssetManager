"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseODataCruder_1 = require("./BaseODataCruder");
var ReadParamsFactory_1 = require("./ReadParamsFactory");
var CrudParamsHelper_1 = require("./CrudParamsHelper");
var ReadService_1 = require("./ReadService");
var ODataHelper_1 = require("../ODataHelper");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var ODataUpdater = (function (_super) {
    __extends(ODataUpdater, _super);
    function ODataUpdater(params) {
        var _this = _super.call(this, params) || this;
        _this.setTargetReadParams();
        _this.setProperties();
        _this.setLinkCreators();
        _this.setLinkUpdaters();
        _this.setLinkDeleters();
        return _this;
    }
    ODataUpdater.prototype.execute = function (dataService, changeSetManager) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.setChangeSetManager(changeSetManager);
            var entityToUpdate = ReadService_1.ReadService.entityFromParams(_this.targetReadParams, dataService, _this.changeSetManager);
            ODataHelper_1.ODataHelper.setEntityValueProperties(entityToUpdate, dataService, _this.properties);
            _this.executeLinkers(dataService, entityToUpdate);
            var options = ODataHelper_1.ODataHelper.getRequestOptions(_this.requestOptionsParm, dataService);
            _this.changeSetManager.updateEntity(entityToUpdate, _this.headers, options).then(function () {
                resolve(ODataHelper_1.ODataHelper.entityValueToJson(entityToUpdate, _this.getDataContext(dataService)));
            }).catch(function (error) {
                reject(error);
            });
        });
    };
    ODataUpdater.prototype.setTargetReadParams = function () {
        this.targetReadParams = ReadParamsFactory_1.ReadParamsFactory.createReadParams(this.service);
    };
    ODataUpdater.prototype.setProperties = function () {
        this.properties = CrudParamsHelper_1.CrudParamsHelper.getPropertiesFromService(this.service);
    };
    ODataUpdater.prototype.setLinkCreators = function () {
        this.linkCreators = CrudParamsHelper_1.CrudParamsHelper.getLinkCreatorsFromParams(this.params);
    };
    ODataUpdater.prototype.setLinkUpdaters = function () {
        this.linkUpdaters = CrudParamsHelper_1.CrudParamsHelper.getLinkUpdatersFromParams(this.params);
    };
    ODataUpdater.prototype.setLinkDeleters = function () {
        this.linkDeleters = CrudParamsHelper_1.CrudParamsHelper.getLinkDeletersFromParams(this.params);
    };
    ODataUpdater.prototype.executeLinkers = function (dataService, sourceEntity) {
        this.executeLinkCreators(dataService, sourceEntity);
        this.executeLinkUpdaters(dataService, sourceEntity);
        this.executeLinkDeleters(dataService, sourceEntity);
    };
    ODataUpdater.prototype.executeLinkCreators = function (dataService, sourceEntity) {
        if (this.linkCreators != null) {
            for (var _i = 0, _a = this.linkCreators; _i < _a.length; _i++) {
                var linkCreator = _a[_i];
                if (linkCreator.execute(sourceEntity, dataService, this.changeSetManager) != null) {
                    throw new Error(ErrorMessage_1.ErrorMessage.ODATA_UPDATE_MANDATORY_PARENT_NOT_ALLOWED);
                }
            }
        }
    };
    ODataUpdater.prototype.executeLinkUpdaters = function (dataService, sourceEntity) {
        if (this.linkUpdaters != null) {
            for (var _i = 0, _a = this.linkUpdaters; _i < _a.length; _i++) {
                var linkUpdater = _a[_i];
                if (linkUpdater.execute(sourceEntity, dataService, this.changeSetManager) != null) {
                    throw new Error(ErrorMessage_1.ErrorMessage.ODATA_UPDATE_MANDATORY_PARENT_NOT_ALLOWED);
                }
            }
        }
    };
    ODataUpdater.prototype.executeLinkDeleters = function (dataService, sourceEntity) {
        if (this.linkDeleters != null) {
            for (var _i = 0, _a = this.linkDeleters; _i < _a.length; _i++) {
                var linkDeleter = _a[_i];
                linkDeleter.execute(sourceEntity, dataService, this.changeSetManager);
            }
        }
    };
    return ODataUpdater;
}(BaseODataCruder_1.BaseODataCruder));
exports.ODataUpdater = ODataUpdater;
