"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IRestService_1 = require("./IRestService");
var mdk_sap_1 = require("mdk-sap");
var Logger_1 = require("../utils/Logger");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var CommonUtil_1 = require("../utils/CommonUtil");
var RestService = (function (_super) {
    __extends(RestService, _super);
    function RestService() {
        var _this = _super.call(this) || this;
        _this._restServiceBridge = new mdk_sap_1.RestServiceBridge();
        return _this;
    }
    RestService.prototype.sendRequest = function (service) {
        var newHeaders = {};
        if (service.serviceHeaders && Object.keys(service.serviceHeaders).length > 0) {
            Object.assign(newHeaders, service.serviceHeaders);
        }
        if (service.headers && Object.keys(service.headers).length > 0) {
            Object.assign(newHeaders, service.headers);
        }
        var path = this.getAdjustedPath(service.path, service.queryOptions);
        var params = { serviceUrl: service.serviceUrl, path: encodeURI(path), requestProperties: service.requestProperties, headers: newHeaders };
        return this._restServiceBridge.sendRequest(params)
            .then(function (result) {
            Logger_1.Logger.instance.restservice.log(Date() + " executed succeeded\n \n      Params: " + JSON.stringify(params) + "\n\n      Result: " + JSON.stringify(result));
            if (CommonUtil_1.CommonUtil.isJSONString(result)) {
                var json = JSON.parse(result);
                if (service.outputPath && service.outputPath.length > 1) {
                    var outputPath = service.outputPath[0] === '/' ? service.outputPath.substring(1) : service.outputPath;
                    var splitPath = outputPath.split('/');
                    var value = json;
                    for (var i = 0; i < splitPath.length; i++) {
                        if (value && value[splitPath[i]]) {
                            value = value[splitPath[i]];
                        }
                        else {
                            value = null;
                            break;
                        }
                    }
                    if (value) {
                        if (value instanceof Array) {
                            return new observable_array_1.ObservableArray(value);
                        }
                        else {
                            return value;
                        }
                    }
                    else {
                        throw new Error(service.outputPath + ' is not a valid path');
                    }
                }
                if (json instanceof Array) {
                    return new observable_array_1.ObservableArray(json);
                }
                else {
                    return json;
                }
            }
            else {
                return result;
            }
        }, function (error) {
            throw error;
        }).catch(function (e) {
            Logger_1.Logger.instance.restservice.error(e);
            throw (e);
        });
    };
    RestService.prototype.getAdjustedPath = function (path, queryOptions) {
        var adjustedPath = path;
        if (queryOptions) {
            adjustedPath = path;
            adjustedPath += path.indexOf('?') === -1 ? '?' : '&';
            adjustedPath += decodeURI(queryOptions);
        }
        return adjustedPath;
    };
    return RestService;
}(IRestService_1.IRestService));
exports.RestService = RestService;
