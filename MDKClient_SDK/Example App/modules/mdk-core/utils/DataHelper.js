"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDataService_1 = require("../data/IDataService");
var IRestService_1 = require("../data/IRestService");
var DataHelper = (function () {
    function DataHelper() {
    }
    DataHelper.readFromService = function (service) {
        if (this.isCallFunctionTarget(service)) {
            return IDataService_1.IDataService.instance().callFunction(service, service.headers);
        }
        else if (this.isRestServiceTarget(service)) {
            return IRestService_1.IRestService.instance().sendRequest(service);
        }
        else {
            return IDataService_1.IDataService.instance().read(service);
        }
    };
    DataHelper.readWithPageSize = function (service, pageSize) {
        if (this.isCallFunctionTarget(service) || this.isRestServiceTarget(service)) {
            var result = {
                Value: null,
                nextLink: null,
            };
            return Promise.resolve(result);
        }
        else {
            return IDataService_1.IDataService.instance().readWithPageSize(service, pageSize);
        }
    };
    DataHelper.getPropertyType = function (serviceName, entitySet, propertyName) {
        if (serviceName && entitySet && propertyName) {
            return IDataService_1.IDataService.instance().getPropertyType(serviceName, entitySet, propertyName);
        }
        else {
            return '';
        }
    };
    DataHelper.isSearchableProperty = function (target, propertyName) {
        if (target && propertyName) {
            if (target.Path && target.RequestProperties) {
                return true;
            }
            else {
                return this.getPropertyType(target.Service, target.EntitySet, propertyName) === 'string';
            }
        }
        return false;
    };
    DataHelper.isCallFunctionTarget = function (service) {
        return service ? service.function && service.function.Name : false;
    };
    DataHelper.isRestServiceTarget = function (service) {
        return service ? service.path && service.requestProperties : false;
    };
    return DataHelper;
}());
exports.DataHelper = DataHelper;
