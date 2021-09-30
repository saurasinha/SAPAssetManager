"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonUtil_1 = require("../ErrorHandling/CommonUtil");
var RestServiceUtil_1 = require("../RestService/RestServiceUtil");
var CpmsSession = (function () {
    function CpmsSession() {
        this._bridge = CpmsSessionSwift.sharedInstance;
    }
    CpmsSession.getInstance = function () {
        if (!CpmsSession._instance) {
            CpmsSession._instance = new CpmsSession();
        }
        return CpmsSession._instance;
    };
    CpmsSession.prototype.initialize = function (params) {
        return this._bridge.initializeWithParams(params);
    };
    CpmsSession.prototype.updateConnectionParams = function (params) {
        return this._bridge.updateWithParams(params);
    };
    CpmsSession.prototype.sendRequest = function (url, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var urlKey = 'url';
            var methodKey = 'method';
            var bodyKey = 'body';
            var headerKey = 'header';
            var reqParams = {};
            reqParams[urlKey] = url;
            var header = {};
            var isFormData = false;
            if (params) {
                if (params.hasOwnProperty(methodKey)) {
                    reqParams[methodKey] = params[methodKey];
                }
                if (params.hasOwnProperty(headerKey)) {
                    for (var key in params[headerKey]) {
                        if (key.toLowerCase() === 'content-type' && params[headerKey][key] === 'multipart/form-data') {
                            isFormData = true;
                        }
                        else {
                            header[key] = params[headerKey][key];
                        }
                    }
                }
                if (params.hasOwnProperty(bodyKey)) {
                    var body = params[bodyKey];
                    if (Array.isArray(body) && isFormData) {
                        var boundry = 'R_' + NSUUID.alloc().init().UUIDString;
                        header['Content-Type'] = 'multipart/form-data; boundary=' + boundry;
                        body = RestServiceUtil_1.RestServiceUtil.getIOSFormData(boundry, body);
                    }
                    else if (body && body.constructor === Object) {
                        header['Content-Type'] = 'application/json';
                        body = JSON.stringify(body);
                    }
                    reqParams[bodyKey] = body;
                }
            }
            reqParams[headerKey] = header;
            return _this._bridge.sendRequestWithParamsResolveReject(reqParams, function (responseAndData) {
                resolve(responseAndData);
            }, function (code, message, error) {
                reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
            });
        });
    };
    return CpmsSession;
}());
exports.CpmsSession = CpmsSession;
;
