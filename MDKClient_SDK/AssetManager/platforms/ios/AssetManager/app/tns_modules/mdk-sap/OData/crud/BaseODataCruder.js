"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CrudParamsHelper_1 = require("./CrudParamsHelper");
var ODataHelper_1 = require("../ODataHelper");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var ODataCrudOperation;
(function (ODataCrudOperation) {
    ODataCrudOperation[ODataCrudOperation["Create"] = 0] = "Create";
    ODataCrudOperation[ODataCrudOperation["Update"] = 1] = "Update";
    ODataCrudOperation[ODataCrudOperation["Delete"] = 2] = "Delete";
    ODataCrudOperation[ODataCrudOperation["Read"] = 3] = "Read";
})(ODataCrudOperation = exports.ODataCrudOperation || (exports.ODataCrudOperation = {}));
;
var BaseODataCruder = (function () {
    function BaseODataCruder(params) {
        this.params = params;
        this.setService();
        this.setServiceUrl();
        this.setHeaders();
        this.setRequestOptions();
    }
    BaseODataCruder.prototype.getServiceUrl = function () {
        return this.serviceUrl;
    };
    BaseODataCruder.prototype.setChangeSetManager = function (changeSetManager) {
        if (changeSetManager == null) {
            throw new Error(ErrorMessage_1.ErrorMessage.ODATA_CRUD_INIT_CHANGESETMANAGER_NOT_FOUND);
        }
        this.changeSetManager = changeSetManager;
    };
    BaseODataCruder.prototype.getDataContext = function (dataService) {
        if (dataService != null) {
            return ODataHelper_1.ODataHelper.createDataContext(dataService.getMetadata());
        }
        throw new Error(ErrorMessage_1.ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE);
    };
    BaseODataCruder.prototype.setService = function () {
        this.service = CrudParamsHelper_1.CrudParamsHelper.getServiceFromParams(this.params);
    };
    BaseODataCruder.prototype.setServiceUrl = function () {
        this.serviceUrl = CrudParamsHelper_1.CrudParamsHelper.getServiceUrlFromService(this.service);
    };
    BaseODataCruder.prototype.setHeaders = function () {
        var headersParm = CrudParamsHelper_1.CrudParamsHelper.getHeadersFromParams(this.params);
        if (!headersParm) {
            headersParm = CrudParamsHelper_1.CrudParamsHelper.getHeadersFromParams(this.service);
        }
        this.headers = ODataHelper_1.ODataHelper.getHttpHeaders(headersParm);
    };
    BaseODataCruder.prototype.setRequestOptions = function () {
        this.requestOptionsParm = CrudParamsHelper_1.CrudParamsHelper.getRequestOptionsFromService(this.service);
    };
    return BaseODataCruder;
}());
exports.BaseODataCruder = BaseODataCruder;
