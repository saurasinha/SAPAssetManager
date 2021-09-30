"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseODataCruder_1 = require("./BaseODataCruder");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var CrudParams = (function () {
    function CrudParams(params, operation) {
        this.setServiceUrl(params);
        this.setEntitySetName(params);
        this.setQueryString(params);
        this.setReadLink(params);
        this.setHeaders(params);
        this.setRequestOptions(params);
        if (this.serviceUrl == null) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MALFORMED_PARAMS, CrudParams.MALFORMEDPARAM, CrudParams.SERVICEURLKEY));
        }
        if (this.entitySetName == null) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MALFORMED_PARAMS, CrudParams.MALFORMEDPARAM, CrudParams.ENTITYSETNAMEKEY));
        }
        if (operation === BaseODataCruder_1.ODataCrudOperation.Create) {
            return;
        }
        if (this.readLink == null && this.queryString == null) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_READLINK_MISSING, operation.toString()));
        }
    }
    CrudParams.prototype.getServiceUrl = function () {
        return this.serviceUrl;
    };
    CrudParams.prototype.getEntitySetName = function () {
        return this.entitySetName;
    };
    CrudParams.prototype.getQueryString = function () {
        return this.queryString;
    };
    CrudParams.prototype.getReadLink = function () {
        return this.readLink;
    };
    CrudParams.prototype.getHeaders = function () {
        return this.headers;
    };
    CrudParams.prototype.getRequestOptions = function () {
        return this.requestOptions;
    };
    CrudParams.prototype.setServiceUrl = function (params) {
        var value = params[CrudParams.SERVICEURLKEY];
        if (typeof value === 'string' && value !== '' && this.serviceUrl == null) {
            this.serviceUrl = value;
        }
    };
    CrudParams.prototype.setEntitySetName = function (params) {
        var value = params[CrudParams.ENTITYSETNAMEKEY];
        if (typeof value === 'string' && value !== '') {
            this.entitySetName = value;
        }
    };
    CrudParams.prototype.setQueryString = function (params) {
        var value = params[CrudParams.QUERYOPTIONSKEY];
        if (typeof value === 'string' && value !== '') {
            this.queryString = value;
        }
    };
    CrudParams.prototype.setReadLink = function (params) {
        var value = params[CrudParams.READLINKKEY];
        if (typeof value === 'string' && value !== '') {
            this.readLink = value;
        }
    };
    CrudParams.prototype.setHeaders = function (params) {
        this.headers = params[CrudParams.HEADERS];
    };
    CrudParams.prototype.setRequestOptions = function (params) {
        this.requestOptions = params[CrudParams.REQUESTOPTIONS];
    };
    CrudParams.ENTITYSETNAMEKEY = 'entitySet';
    CrudParams.QUERYOPTIONSKEY = 'queryOptions';
    CrudParams.READLINKKEY = 'readLink';
    CrudParams.MALFORMEDPARAM = 'Malformed parameter:';
    CrudParams.SERVICEURLKEY = 'serviceUrl';
    CrudParams.HEADERS = 'headers';
    CrudParams.REQUESTOPTIONS = 'requestOptions';
    return CrudParams;
}());
exports.CrudParams = CrudParams;
