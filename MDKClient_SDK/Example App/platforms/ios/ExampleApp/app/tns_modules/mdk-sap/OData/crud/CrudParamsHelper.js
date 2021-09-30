"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataLinkCreator_1 = require("./odatalinking/odatalinkers/ODataLinkCreator");
var ODataLinkDeleter_1 = require("./odatalinking/odatalinkers/ODataLinkDeleter");
var ODataLinkUpdater_1 = require("./odatalinking/odatalinkers/ODataLinkUpdater");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var CrudParamsHelper = (function () {
    function CrudParamsHelper() {
    }
    CrudParamsHelper.getHeadersFromParams = function (params) {
        var headers = params[CrudParamsHelper.HEADERSKEY];
        if (headers != null) {
            return headers;
        }
        else {
            return null;
        }
    };
    CrudParamsHelper.getServiceFromParams = function (params) {
        var service = params[CrudParamsHelper.SERVICEKEY];
        if (service != null && Object.keys(service).length > 0) {
            return service;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, this.SERVICEKEY));
        }
    };
    CrudParamsHelper.getServiceUrlFromService = function (params) {
        var serviceUrl = params[CrudParamsHelper.SERVICEURLKEY];
        if (typeof serviceUrl === 'string' && serviceUrl.length !== 0) {
            return serviceUrl;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, this.SERVICEURLKEY));
        }
    };
    CrudParamsHelper.getEntitySetNameFromService = function (params) {
        var entitySet = params[CrudParamsHelper.ENTITYSETNAMEKEY];
        if (typeof entitySet === 'string' && entitySet.length !== 0) {
            return entitySet;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, this.ENTITYSETNAMEKEY));
        }
    };
    CrudParamsHelper.getPropertiesFromService = function (params) {
        var properties = params[CrudParamsHelper.ENTITYPROPERTIESKEY];
        if (properties != null) {
            return properties;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, this.ENTITYPROPERTIESKEY));
        }
    };
    CrudParamsHelper.getLinkCreatorsFromParams = function (params) {
        var linkCreatorParams = params[CrudParamsHelper.CREATELINKS];
        if (!Array.isArray(linkCreatorParams) || linkCreatorParams.length === 0) {
            return null;
        }
        var linkCreators = new Array(linkCreatorParams.length);
        var service = this.getServiceFromParams(params);
        var entitySetName = this.getEntitySetNameFromService(service);
        for (var i = 0; i < linkCreatorParams.length; i++) {
            var linkCreator = new ODataLinkCreator_1.ODataLinkCreator(entitySetName, linkCreatorParams[i]);
            linkCreators[i] = linkCreator;
        }
        return linkCreators;
    };
    CrudParamsHelper.getLinkUpdatersFromParams = function (params) {
        var linkUpdaterParams = params[CrudParamsHelper.UPDATELINKS];
        if (!Array.isArray(linkUpdaterParams) || linkUpdaterParams.length === 0) {
            return null;
        }
        var linkUpdaters = new Array(linkUpdaterParams.length);
        var service = this.getServiceFromParams(params);
        var entitySetName = this.getEntitySetNameFromService(service);
        for (var i = 0; i < linkUpdaterParams.length; i++) {
            var linkUpdater = new ODataLinkUpdater_1.ODataLinkUpdater(entitySetName, linkUpdaterParams[i]);
            linkUpdaters[i] = linkUpdater;
        }
        return linkUpdaters;
    };
    CrudParamsHelper.getLinkDeletersFromParams = function (params) {
        var linkDeleterParams = params[CrudParamsHelper.DELETELINKS];
        if (!Array.isArray(linkDeleterParams) || linkDeleterParams.length === 0) {
            return null;
        }
        var linkDeleters = new Array(linkDeleterParams.length);
        var service = this.getServiceFromParams(params);
        var entitySetName = this.getEntitySetNameFromService(service);
        for (var i = 0; i < linkDeleterParams.length; i++) {
            var linkDeleter = new ODataLinkDeleter_1.ODataLinkDeleter(entitySetName, linkDeleterParams[i]);
            linkDeleters[i] = linkDeleter;
        }
        return linkDeleters;
    };
    CrudParamsHelper.getRequestOptionsFromService = function (params) {
        var requestOptions = params[CrudParamsHelper.REQUESTOPTIONS];
        if (requestOptions != null) {
            return requestOptions;
        }
        else {
            return null;
        }
    };
    CrudParamsHelper.getParentFromParams = function (params) {
        var parent = params[CrudParamsHelper.PARENTKEY];
        if (parent != null) {
            return parent;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, this.PARENTKEY));
        }
    };
    CrudParamsHelper.getPropertyFromParent = function (params) {
        var property = params[CrudParamsHelper.PROPERTYKEY];
        if (property != null) {
            return property;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MALFORMED_PARAMS, this.MALFORMEDPARAM, this.PROPERTYKEY));
        }
    };
    CrudParamsHelper.MALFORMEDPARAM = 'Malformed parameter:';
    CrudParamsHelper.SERVICEKEY = 'service';
    CrudParamsHelper.PROPERTYKEY = 'property';
    CrudParamsHelper.SERVICEURLKEY = 'serviceUrl';
    CrudParamsHelper.ENTITYSETNAMEKEY = 'entitySet';
    CrudParamsHelper.ENTITYPROPERTIESKEY = 'properties';
    CrudParamsHelper.CREATELINKS = 'createLinks';
    CrudParamsHelper.UPDATELINKS = 'updateLinks';
    CrudParamsHelper.DELETELINKS = 'deleteLinks';
    CrudParamsHelper.HEADERSKEY = 'headers';
    CrudParamsHelper.REQUESTOPTIONS = 'requestOptions';
    CrudParamsHelper.PARENTKEY = 'parent';
    return CrudParamsHelper;
}());
exports.CrudParamsHelper = CrudParamsHelper;
