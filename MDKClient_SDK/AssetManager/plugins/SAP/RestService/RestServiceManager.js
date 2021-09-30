"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var CpmsSession_1 = require("../Cpms/CpmsSession");
var HttpResponse_1 = require("../Cpms/HttpResponse");
var RestServiceUtil_1 = require("./RestServiceUtil");
var RestServiceManager = (function () {
    function RestServiceManager() {
    }
    RestServiceManager.prototype.sendRequest = function (params) {
        if (!params) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'RestServiceManager.sendRequest()'));
        }
        return new Promise(function (resolve, reject) {
            var url = params.serviceUrl + params.path;
            var requestProperties = params.requestProperties;
            var method = requestProperties.Method;
            var apiHeaders = requestProperties.Headers;
            var body = requestProperties.Body;
            var serviceHeaders = params.headers;
            var header = {};
            if (apiHeaders) {
                Object.assign(header, apiHeaders);
            }
            if (serviceHeaders) {
                Object.assign(header, serviceHeaders);
            }
            return CpmsSession_1.CpmsSession.getInstance().sendRequest(url, { method: method, header: header, body: body }).then(function (responseAndData) {
                var mimeType = HttpResponse_1.HttpResponse.getMimeType(responseAndData);
                var statusCode = HttpResponse_1.HttpResponse.getStatusCode(responseAndData);
                if (statusCode >= 300) {
                    var error = new Error(HttpResponse_1.HttpResponse.toString(responseAndData));
                    error['responseCode'] = statusCode;
                    error['responseBody'] = error.message;
                    return reject(error);
                }
                else {
                    if (RestServiceUtil_1.RestServiceUtil.isTextContent(mimeType)) {
                        return resolve(HttpResponse_1.HttpResponse.toString(responseAndData));
                    }
                    else {
                        return resolve(HttpResponse_1.HttpResponse.getData(responseAndData));
                    }
                }
            }).catch(function (error) {
                return reject(error);
            });
        });
    };
    return RestServiceManager;
}());
exports.RestServiceManager = RestServiceManager;
;
