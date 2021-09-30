"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IDataService_1 = require("./IDataService");
var mdk_sap_1 = require("mdk-sap");
var observable_array_1 = require("tns-core-modules/data/observable-array");
var ClientSettings_1 = require("../storage/ClientSettings");
var IDefinitionProvider_1 = require("../definitions/IDefinitionProvider");
var DataServiceDefinition_1 = require("../definitions/DataServiceDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var Logger_1 = require("../utils/Logger");
var DataQueryBuilder_1 = require("../builders/odata/DataQueryBuilder");
var app = require("tns-core-modules/application");
var ODataService = (function (_super) {
    __extends(ODataService, _super);
    function ODataService() {
        var _this = _super.call(this) || this;
        _this._dataReadPageSize = 50;
        _this._resolvedServiceInfo = {};
        _this._oDataBridge = new mdk_sap_1.ODataBridge();
        return _this;
    }
    ODataService.prototype.createService = function (params) {
        return this._oDataBridge.createService(params);
    };
    ODataService.prototype.count = function (service, context) {
        var _this = this;
        return this._adjustedServiceForCount(service, context).then(function (query) {
            return _this._oDataBridge.count(query).then(function (result) {
                return result;
            }).catch(function (e) {
                Logger_1.Logger.instance.odata.error(e);
                return Promise.reject(e);
            });
        });
    };
    ODataService.prototype.openService = function (params) {
        return this._oDataBridge.openService(params);
    };
    ODataService.prototype.downloadMedia = function (service) {
        return this._oDataBridge.downloadMedia(service).then(function (result) {
            Logger_1.Logger.instance.odata.log("download media succeeded");
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("download media error: " + error);
            throw error;
        });
    };
    ODataService.prototype.isMediaLocal = function (service) {
        return this._oDataBridge.isMediaLocal(service);
    };
    ODataService.prototype.downloadOfflineOData = function (params) {
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            return Promise.reject(new Error('not allowed'));
        }
        else {
            return this._oDataBridge.downloadOfflineOData(params).then(function (result) {
                Logger_1.Logger.instance.odata.log("download OfflineOData succeeded");
                return result;
            }, function (error) {
                Logger_1.Logger.instance.odata.error("download OfflineOData error: " + error);
                throw error;
            });
        }
    };
    ODataService.prototype.syncPendingODataTxnsOnUserChange = function () {
        var _this = this;
        var initializedODataDefinitionsOfPreviousUser = ClientSettings_1.ClientSettings.getODataInitializedDefinitions();
        var promiseList = [];
        var closePromiseList = [];
        for (var _i = 0, initializedODataDefinitionsOfPreviousUser_1 = initializedODataDefinitionsOfPreviousUser; _i < initializedODataDefinitionsOfPreviousUser_1.length; _i++) {
            var odataDefinitionStr = initializedODataDefinitionsOfPreviousUser_1[_i];
            var odataDefinition = JSON.parse(odataDefinitionStr);
            odataDefinition.force = true;
            closePromiseList.push(this.closeOfflineStore(odataDefinition));
            delete odataDefinition.force;
        }
        return Promise.all(closePromiseList).then(function () {
            for (var _i = 0, initializedODataDefinitionsOfPreviousUser_2 = initializedODataDefinitionsOfPreviousUser; _i < initializedODataDefinitionsOfPreviousUser_2.length; _i++) {
                var odataDefinitionStr = initializedODataDefinitionsOfPreviousUser_2[_i];
                var odataDefinition = JSON.parse(odataDefinitionStr);
                var currentUser = ClientSettings_1.ClientSettings.getUserInfo();
                odataDefinition.currentUser = currentUser;
                promiseList.push(_this.initializeOfflineStore(odataDefinition, false));
            }
            return Promise.all(promiseList);
        });
    };
    ODataService.prototype.initializeOfflineStore = function (params, addDef) {
        var _this = this;
        if (addDef === void 0) { addDef = true; }
        return this._oDataBridge.initializeOfflineStore(params).then(function (success) {
            if ((app.ios || app.android) && addDef) {
                ClientSettings_1.ClientSettings.setODataInitializedDefinition(params);
                ClientSettings_1.ClientSettings.setUserForPendingODataTxns(params.currentUser);
            }
            _this._saveHistoricalODataServicePath(params.serviceUrl);
            return success;
        }, function (initError) {
            var storeState = _this._oDataBridge.getOfflineStoreStatus(params);
            if (storeState === 'error') {
                var serviceUrl = params.serviceUrl;
                var force = true;
                return IDataService_1.IDataService.instance().clearOfflineStore({ serviceUrl: serviceUrl, force: force }).then(function (success) {
                    throw initError;
                }, function (clearError) {
                    throw clearError;
                });
            }
            else {
                throw initError;
            }
        });
    };
    ODataService.prototype.closeOfflineStore = function (params) {
        var _this = this;
        return this._oDataBridge.closeOfflineStore(params).then(function (result) {
            Logger_1.Logger.instance.odata.log("Successfully closed OfflineOData result: " + result);
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("Error closing OfflineOData: " + error);
            if (_this._oDataBridge.getOfflineStoreStatus(params) === 'initialized') {
                throw error;
            }
            else {
                return Promise.resolve();
            }
        });
    };
    ODataService.prototype.clearOfflineStore = function (params) {
        var _this = this;
        return this._oDataBridge.clearOfflineStore(params).then(function (result) {
            Logger_1.Logger.instance.odata.log("successfully cleared OfflineOData " + result);
            var serviceLanguagesMap = ClientSettings_1.ClientSettings.getODataServiceLanguageMap();
            if (serviceLanguagesMap && params.serviceUrl) {
                var serviceUrlParts = params.serviceUrl.split('?');
                if (serviceUrlParts && serviceUrlParts.length > 0) {
                    var oriServiceUrl = serviceUrlParts[0];
                    if (serviceLanguagesMap.hasOwnProperty(oriServiceUrl)) {
                        if (serviceLanguagesMap[oriServiceUrl]) {
                            delete serviceLanguagesMap[oriServiceUrl];
                            ClientSettings_1.ClientSettings.setODataServiceLanguageMap(serviceLanguagesMap);
                        }
                    }
                }
            }
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("Error clearing OfflineOData: " + error);
            var storeState = _this._oDataBridge.getOfflineStoreStatus(params);
            if (storeState === 'initialized' || storeState === 'closed') {
                throw error;
            }
            else {
                return Promise.resolve();
            }
        });
    };
    ODataService.prototype.uploadOfflineOData = function (params) {
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            return Promise.reject(new Error('not allowed'));
        }
        else {
            return this._oDataBridge.uploadOfflineOData(params).then(function (result) {
                Logger_1.Logger.instance.odata.log("successfully uploaded OfflineOData result: " + result);
                return result;
            }, function (error) {
                Logger_1.Logger.instance.odata.error("Error uploading OfflineOData: " + error);
                throw error;
            });
        }
    };
    ODataService.prototype.cancelUploadOfflineOData = function (params) {
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            return Promise.reject(new Error('not allowed'));
        }
        else {
            return this._oDataBridge.cancelUploadOfflineOData(params).then(function (result) {
                Logger_1.Logger.instance.odata.log("successfully cancels uploaded OfflineOData result: " + result);
                return result;
            }, function (error) {
                Logger_1.Logger.instance.odata.error("Error in while cancelling the upload OfflineOData: " + error);
                throw error;
            });
        }
    };
    ODataService.prototype.cancelDownloadOfflineOData = function (params) {
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            return Promise.reject(new Error('not allowed'));
        }
        else {
            return this._oDataBridge.cancelDownloadOfflineOData(params).then(function (result) {
                Logger_1.Logger.instance.odata.log("successfully cancels download OfflineOData result: " + result);
                return result;
            }, function (error) {
                Logger_1.Logger.instance.odata.error("Error in while cancelling the download OfflineOData: " + error);
                throw error;
            });
        }
    };
    ODataService.prototype.read = function (service) {
        return this._oDataBridge
            .read(this._adjustedServiceForRead(service))
            .then(function (jsonString) {
            var json = JSON.parse(jsonString || '[]');
            Logger_1.Logger.instance.odata.log("successfully read from " + service.entitySet + " queryOptions: " + service.queryOptions);
            return new observable_array_1.ObservableArray(json.value);
        }).catch(function (e) {
            Logger_1.Logger.instance.odata.error(e + " from " + service.entitySet + " queryOptions: " + service.queryOptions);
            throw (e);
        });
    };
    ODataService.prototype.readWithPageSize = function (service, pageSize) {
        var params = __assign({ PageSize: pageSize ? pageSize : this._dataReadPageSize }, this._adjustedServiceForRead(service));
        return this._oDataBridge
            .read(params)
            .then(function (oDataResultString) {
            var oDataResultJSON = JSON.parse(oDataResultString || '[]');
            Logger_1.Logger.instance.odata.log("successfully read from " + service.entitySet + " queryOptions: " + service.queryOptions + " \n      and the nextLink is " + oDataResultJSON['@odata.nextLink']);
            var result = {
                Value: new observable_array_1.ObservableArray(oDataResultJSON.value),
                nextLink: oDataResultJSON['@odata.nextLink'] ? oDataResultJSON['@odata.nextLink'] : null,
            };
            return result;
        }).catch(function (e) {
            Logger_1.Logger.instance.odata.error(e + " from " + service.entitySet + " queryOptions: " + service.queryOptions);
            throw (e);
        });
    };
    ODataService.prototype.update = function (service, createLinks, updateLinks, deleteLinks, headers) {
        var params = { service: service, createLinks: createLinks, updateLinks: updateLinks, deleteLinks: deleteLinks, headers: headers };
        return this._oDataBridge.update(params).then(function (entity) {
            Logger_1.Logger.instance.odata.log(Date() + " Update service succeeded\n \n      Params: " + JSON.stringify(params) + "\n\n      Result: " + JSON.stringify(entity));
            return entity;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("update entity error: " + error);
            throw (error);
        });
    };
    ODataService.prototype.create = function (service, createLinks, headers) {
        var params = { service: service, createLinks: createLinks, headers: headers };
        return this._oDataBridge.create(params).then(function (result) {
            Logger_1.Logger.instance.odata.log(Date() + " create entity succeeded\n \n      Params: " + JSON.stringify(params) + "\n\n      Result: " + JSON.stringify(result));
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("create entity error: " + error);
            throw (error);
        });
    };
    ODataService.prototype.createRelated = function (service, parent, headers) {
        var params = { service: service, parent: parent, headers: headers };
        return this._oDataBridge.createRelated(params).then(function (result) {
            Logger_1.Logger.instance.odata.log(Date() + " create related entity succeeded\n \n      Params: " + JSON.stringify(params) + "\n\n      Result: " + JSON.stringify(result));
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("create related entity error: " + error);
            throw (error);
        });
    };
    ODataService.prototype.delete = function (service, headers) {
        var params = { service: service, headers: headers };
        return this._oDataBridge.delete(params).then(function (result) {
            Logger_1.Logger.instance.odata.log(Date() + " delete entity succeeded\n \n      Params: " + JSON.stringify(params) + "\n\n      Result: " + JSON.stringify(result));
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("delete entity error: " + error);
            throw (error);
        });
    };
    ODataService.prototype.createMedia = function (service, headers, media) {
        var params = {
            entitySet: service.entitySet,
            offlineEnabled: service.offlineEnabled,
            properties: service.properties,
            requestOptions: service.requestOptions,
            serviceUrl: service.serviceUrl,
            headers: headers,
            media: media,
        };
        return this._oDataBridge.createMedia(params).then(function (result) {
            Logger_1.Logger.instance.odata.log("create media succeeded " + result);
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("create media entity error: " + error);
            throw error;
        });
    };
    ODataService.prototype.createRelatedMedia = function (service, parent, headers, media) {
        var params = {
            entitySet: service.entitySet,
            offlineEnabled: service.offlineEnabled,
            properties: service.properties,
            requestOptions: service.requestOptions,
            serviceUrl: service.serviceUrl,
            parent: parent,
            headers: headers,
            media: media,
        };
        return this._oDataBridge.createRelatedMedia(params).then(function (result) {
            Logger_1.Logger.instance.odata.log("createMedia succeeded " + result);
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("create media entity error: " + error);
            throw error;
        });
    };
    ODataService.prototype.beginChangeSet = function (service) {
        var params = { serviceUrl: service.serviceUrl, offlineEnabled: service.offlineEnabled };
        return this._oDataBridge.beginChangeSet(params).then(function (result) {
            Logger_1.Logger.instance.odata.log('begin change set success');
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("begin change set error: " + error);
            throw error;
        });
    };
    ODataService.prototype.cancelChangeSet = function (service) {
        var params = { serviceUrl: service.serviceUrl, offlineEnabled: service.offlineEnabled };
        return this._oDataBridge.cancelChangeSet(params).then(function (result) {
            Logger_1.Logger.instance.odata.log("cancel change set success result: " + result);
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("cancel change set error: " + error);
            throw error;
        });
    };
    ODataService.prototype.commitChangeSet = function (service) {
        var params = { serviceUrl: service.serviceUrl, offlineEnabled: service.offlineEnabled };
        return this._oDataBridge.commitChangeSet(params).then(function (result) {
            Logger_1.Logger.instance.odata.log("commit change set success result: " + result);
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("commit change set error: " + error);
            throw error;
        });
    };
    ODataService.prototype.isOnChangeSet = function () {
        return this._oDataBridge.isOnChangeSet();
    };
    ODataService.prototype.deleteMedia = function (service) {
        return Promise.resolve(this._oDataBridge.deleteMedia(service)).then(function (result) {
            Logger_1.Logger.instance.odata.log("delete media succeeded " + result);
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("delete media error: " + error);
            throw (error);
        });
    };
    ODataService.prototype.urlForServiceName = function (serviceName) {
        try {
            this.validateServiceName(serviceName);
            var serviceDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(serviceName);
            var urlSuffix = void 0;
            var destinationName = serviceDefinition.destinationName;
            if (destinationName) {
                urlSuffix = serviceDefinition.destinationName;
                if (serviceDefinition.pathSuffix) {
                    urlSuffix = urlSuffix + serviceDefinition.pathSuffix;
                }
                var cpmsUrl = ClientSettings_1.ClientSettings.getCpmsUrl();
                return cpmsUrl + '/' + urlSuffix;
            }
            else {
                var serviceUrl = serviceDefinition.serviceURL;
                if (!serviceUrl || serviceUrl.indexOf('/') === -1) {
                    throw new Error(ErrorMessage_1.ErrorMessage.NO_VALID_DESTINATIONNAME_SEVICEURL);
                }
                if (serviceDefinition.isOnline) {
                    return serviceUrl;
                }
                if (serviceUrl[serviceUrl.length - 1] === '/') {
                    serviceUrl = serviceUrl.substr(0, serviceUrl.length - 1);
                }
                var serviceURLPathComponents = serviceUrl.split('/');
                urlSuffix = serviceURLPathComponents[serviceURLPathComponents.length - 1];
            }
            var fullUrl = ClientSettings_1.ClientSettings.getCpmsUrl() + '/' + urlSuffix;
            Logger_1.Logger.instance.odata.log("Service URL: " + fullUrl);
            return fullUrl;
        }
        catch (e) {
            Logger_1.Logger.instance.odata.error("Failed to get URL for service name " + serviceName);
            throw e;
        }
    };
    ODataService.prototype.applicationIDForServiceName = function (serviceName) {
        return ClientSettings_1.ClientSettings.getAppId();
    };
    ODataService.prototype.offlineEnabled = function (serviceName) {
        try {
            this.validateServiceName(serviceName);
            if (this._resolvedServiceInfo[serviceName]) {
                return DataServiceDefinition_1.DataServiceDefinition.isOffline(this._resolvedServiceInfo[serviceName].offlineEnabled);
            }
            var serviceDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(serviceName);
            return serviceDefinition.isOffline;
        }
        catch (e) {
            Logger_1.Logger.instance.odata.error("Failed to get offline for service name " + serviceName);
            throw e;
        }
    };
    ODataService.prototype.callFunction = function (service, headers) {
        var params = { functionName: service.function.Name, functionParameters: service.function.Parameters, serviceUrl: service.serviceUrl, functionHeaders: headers, functionOptions: service.requestOptions, offlineEnabled: service.offlineEnabled };
        return this._oDataBridge.callFunction(params)
            .then(function (result) {
            Logger_1.Logger.instance.odata.log(Date() + " " + params.functionName + " executed succeeded\n \n        Params: " + JSON.stringify(params) + "\n\n        Result: " + JSON.stringify(result));
            var json = JSON.parse(result || '[]');
            if (json.value instanceof Array || json instanceof Array) {
                return new observable_array_1.ObservableArray(json.value || json);
            }
            return json;
        }, function (error) {
            throw error;
        }).catch(function (e) {
            Logger_1.Logger.instance.odata.error(params.functionName + " execute error: " + e);
            throw (e);
        });
    };
    ODataService.prototype.undoPendingChanges = function (service) {
        return this._oDataBridge.undoPendingChanges(service).then(function (result) {
            Logger_1.Logger.instance.odata.log("undoPendingChanges succeeded " + result);
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("undoPendingChanges failed: " + error);
            throw error;
        });
    };
    ODataService.prototype.base64StringToBinary = function (base64) {
        return this._oDataBridge.base64StringToBinary(base64);
    };
    ODataService.prototype.getPropertyType = function (serviceName, entitySet, propertyName) {
        if (serviceName === undefined || serviceName === '') {
            return '';
        }
        var serviceUrl = this.urlForServiceName(serviceName);
        var offlineEnabled = this.offlineEnabled(serviceName);
        var params = { serviceUrl: serviceUrl, entitySet: entitySet, propertyName: propertyName, offlineEnabled: offlineEnabled };
        return this._oDataBridge.getPropertyType(params);
    };
    ODataService.prototype.getVersion = function (serviceName) {
        var serviceUrl = this.urlForServiceName(serviceName);
        var offlineEnabled = this.offlineEnabled(serviceName);
        var params = { serviceUrl: serviceUrl, offlineEnabled: offlineEnabled };
        return this._oDataBridge.getVersion(params);
    };
    ODataService.prototype.getOfflineStoreStatus = function (serviceName) {
        if (serviceName === undefined || serviceName === '') {
            return '';
        }
        var serviceUrl = this.urlForServiceName(serviceName);
        var offlineEnabled = this.offlineEnabled(serviceName);
        var params = { serviceUrl: serviceUrl, offlineEnabled: offlineEnabled };
        return this._oDataBridge.getOfflineStoreStatus(params);
    };
    ODataService.prototype.downloadStream = function (service, headers) {
        var params = { service: service, headers: headers };
        return this._oDataBridge.downloadStream(params).then(function (result) {
            Logger_1.Logger.instance.odata.log("downloadStream succeeded");
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("downloadStream error: " + error);
            throw error;
        });
    };
    ODataService.prototype.uploadStream = function (service, headers) {
        var params = { service: service, headers: headers };
        return this._oDataBridge.uploadStream(params).then(function (result) {
            Logger_1.Logger.instance.odata.log("uploadSteam succeeded " + result);
            return result;
        }, function (error) {
            Logger_1.Logger.instance.odata.error("uploadSteam error: " + error);
            throw error;
        });
    };
    ODataService.prototype.getServiceHeaders = function (serviceName) {
        try {
            this.validateServiceName(serviceName);
            var serviceDefinition = IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(serviceName);
            return serviceDefinition.headers;
        }
        catch (e) {
            Logger_1.Logger.instance.odata.error("Failed to get headers for service name " + serviceName);
            throw e;
        }
    };
    ODataService.prototype.getPreviousUser = function () {
        return this._oDataBridge.getPreviousUser();
    };
    ODataService.prototype.saveResolvedServiceInfo = function (serviceName, params) {
        this._resolvedServiceInfo[serviceName] = params;
    };
    ODataService.prototype.clearResolvedServiceInfo = function () {
        this._resolvedServiceInfo = {};
    };
    ODataService.prototype.getResolvedServiceInfo = function (serviceName) {
        return this._resolvedServiceInfo[serviceName];
    };
    ODataService.prototype.getOfflineParameter = function (serviceName, name) {
        var serviceUrl = this.urlForServiceName(serviceName);
        var offlineEnabled = this.offlineEnabled(serviceName);
        return this._oDataBridge.getOfflineParameter({ serviceUrl: serviceUrl, offlineEnabled: offlineEnabled, name: name });
    };
    ODataService.prototype.setOfflineParameter = function (serviceName, name, value) {
        var serviceUrl = this.urlForServiceName(serviceName);
        var offlineEnabled = this.offlineEnabled(serviceName);
        this._oDataBridge.setOfflineParameter({ serviceUrl: serviceUrl, offlineEnabled: offlineEnabled, name: name, value: value });
    };
    ODataService.prototype._adjustedServiceForCount = function (service, context) {
        var countService = Object.assign({}, service);
        countService.properties = [];
        var origQueryBuilder;
        if (!countService.queryBuilder) {
            origQueryBuilder = new DataQueryBuilder_1.DataQueryBuilder(context, countService.queryOptions);
        }
        else {
            origQueryBuilder = countService.queryBuilder;
        }
        var countQueryBuilder = new DataQueryBuilder_1.DataQueryBuilder(context);
        if (origQueryBuilder.hasFilter) {
            countQueryBuilder.filter(origQueryBuilder.filterOption);
        }
        if (origQueryBuilder.hasTop) {
            countQueryBuilder.top(origQueryBuilder.topOption);
        }
        if (origQueryBuilder.hasSkip) {
            countQueryBuilder.skip(origQueryBuilder.skipOption);
        }
        return countQueryBuilder.build().then(function (builtQuery) {
            countService.queryOptions = builtQuery;
            return countService;
        });
    };
    ODataService.prototype.validateServiceName = function (serviceName) {
        if (serviceName === undefined) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.SERVICE_NAME_NOT_DEFINED, 'serviceName'));
        }
        if (typeof serviceName !== 'string') {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.SERVICE_NAME_WITH_WRONG_PARAM_TYPE, 'serviceName'));
        }
    };
    ODataService.prototype._adjustedServiceForRead = function (service) {
        var readService = Object.assign({}, service);
        var select = '$select=';
        var queryOptions = readService.queryOptions && typeof readService.queryOptions === 'string' ? readService.queryOptions.toLowerCase() : null;
        var startIndex = queryOptions ? queryOptions.indexOf(select) : -1;
        if ((!queryOptions || startIndex === -1) && readService.properties && service.offlineEnabled) {
            var properties = readService.properties;
            if (properties.length > 0) {
                var selectOptions = select;
                for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                    var val = properties_1[_i];
                    if (selectOptions !== select) {
                        selectOptions += ',';
                    }
                    selectOptions += val;
                }
                if (readService.queryOptions) {
                    readService.queryOptions += '&';
                    readService.queryOptions += selectOptions;
                }
                else {
                    readService.queryOptions = selectOptions;
                }
            }
        }
        else if ((queryOptions && startIndex !== -1) && readService.properties && !service.offlineEnabled) {
            if (service.entitySet && service.entitySet.indexOf('/') === -1) {
                var selectOptions = readService.queryOptions.substring(startIndex + select.length);
                if (selectOptions.indexOf('&') !== -1) {
                    selectOptions = selectOptions.substring(0, selectOptions.indexOf('&'));
                }
                var decodedSelectOptions = decodeURI(selectOptions);
                var split = decodedSelectOptions.split(',');
                var properties = [];
                for (var _a = 0, split_1 = split; _a < split_1.length; _a++) {
                    var val = split_1[_a];
                    if (val.trim() !== '*') {
                        properties.push(val.trim());
                    }
                }
                readService.properties = properties;
            }
        }
        if (readService.queryBuilder) {
            readService.queryBuilder = null;
        }
        return readService;
    };
    ODataService.prototype._saveHistoricalODataServicePath = function (serviceUrl) {
        var serviceUrlParts = serviceUrl ? serviceUrl.split('?') : undefined;
        if (serviceUrlParts && serviceUrlParts.length > 0) {
            var oriServiceUrl = serviceUrlParts[0];
            var path = ClientSettings_1.ClientSettings.getHistoricalODataServicePath();
            ClientSettings_1.ClientSettings.setHistoricalODataServicePath(new Set(path).add(oriServiceUrl));
        }
    };
    return ODataService;
}(IDataService_1.IDataService));
exports.ODataService = ODataService;
