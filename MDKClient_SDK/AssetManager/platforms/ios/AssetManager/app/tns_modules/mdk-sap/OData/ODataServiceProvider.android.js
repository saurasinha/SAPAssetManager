"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var ODataServiceUtils_1 = require("./ODataServiceUtils");
var ODataConverter_1 = require("./ODataConverter");
var ODataHelper_1 = require("./ODataHelper");
var ChangeSetManager_1 = require("./crud/ChangeSetManager");
var trace_1 = require("tns-core-modules/trace");
var DataConverter_1 = require("../Common/DataConverter");
var SharedLoggerManager_1 = require("../Foundation/Common/SharedLogger/SharedLoggerManager");
var CommonUtil_1 = require("../ErrorHandling/CommonUtil");
var application = require("tns-core-modules/application");
var WelcomeScreen_1 = require("../Onboarding/WelcomeScreen");
var clientODataPkg = com.sap.mdk.client.odata;
var foundationPkg = com.sap.cloud.mobile.foundation;
var oDataPkg = com.sap.cloud.mobile.odata;
var offlineODataPkg = com.sap.cloud.mobile.odata.offline;
var UploadCategory = oDataPkg.offline.OfflineODataRequestOptions.UploadCategory;
var clientFoundationPkg = com.sap.mdk.client.foundation;
var StateChangeOperation;
(function (StateChangeOperation) {
    StateChangeOperation["Close"] = "Close";
    StateChangeOperation["Clear"] = "Clear";
})(StateChangeOperation || (StateChangeOperation = {}));
var StoreStates;
(function (StoreStates) {
    StoreStates["Uninitialized"] = "Uninitialized";
    StoreStates["Initialized"] = "Initialized";
    StoreStates["Closed"] = "Closed";
    StoreStates["Error"] = "Error";
})(StoreStates || (StoreStates = {}));
;
var ODataServiceProvider = (function () {
    function ODataServiceProvider() {
        this.storeStates = StoreStates.Uninitialized;
        var logger = org.slf4j.LoggerFactory.getLogger('com.sap.cloud.mobile.odata.offline');
        logger.setLevel(ch.qos.logback.classic.Level.OFF);
    }
    ODataServiceProvider.clear = function (context, serviceUrl) {
        return new Promise(function (resolve, reject) {
            try {
                oDataPkg.core.AndroidSystem.setContext(context);
                var serviceName = ODataServiceUtils_1.ODataServiceUtils.getServiceName(serviceUrl);
                offlineODataPkg.OfflineODataProvider.clear(new java.net.URL('file:/' +
                    ODataServiceProvider.offlineODataDirectory(context)), serviceName);
                resolve(null);
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.getServiceTimeZoneAbbreviation = function () {
        return ODataServiceProvider.serviceTimeZoneAbbreviation;
    };
    ODataServiceProvider.offlineODataDirectory = function (context) {
        if (!context) {
            return null;
        }
        var workingODataDir = context.getExternalFilesDir(null).getAbsolutePath();
        return workingODataDir;
    };
    ODataServiceProvider.toJSError = function (error) {
        if (error == null) {
            return error;
        }
        if (error instanceof Error) {
            return CommonUtil_1.CommonUtil.formatJSError(error);
        }
        else if (error instanceof java.lang.Exception) {
            var jsError = new Error(error.getMessage());
            return CommonUtil_1.CommonUtil.formatJSError(jsError);
        }
        else {
            return new Error('Invalid Error Object');
        }
    };
    ODataServiceProvider.releaseWakeLock = function () {
        if (ODataServiceProvider._wakeLock) {
            try {
                if (ODataServiceProvider._wakeLock.isHeld()) {
                    ODataServiceProvider._wakeLock.release();
                }
            }
            catch (error) {
                trace_1.write(ODataServiceProvider.toJSError(error).message, 'mdk.trace.odata', trace_1.messageType.error);
            }
            ODataServiceProvider._wakeLock = null;
        }
    };
    ODataServiceProvider.prototype.download = function (params) {
        var _this = this;
        if (this.dataService == null) {
            return Promise.reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_DOWNLOAD_NOT_INITIALIZED));
        }
        return new Promise(function (resolve, reject) {
            var provider = _this.getOfflineODataProvider();
            var successHandler = new oDataPkg.core.Action0({
                call: function () { return resolve(null); },
            });
            var failureHandler = new oDataPkg.core.Action1({
                call: function (error) {
                    var jsError = ODataServiceProvider.toJSError(error);
                    reject(CommonUtil_1.CommonUtil.formatOfflineError(jsError));
                },
            });
            if (params.definingRequests) {
                var subset = new java.util.ArrayList();
                for (var _i = 0, _a = params.definingRequests; _i < _a.length; _i++) {
                    var req = _a[_i];
                    var name_1 = req.Name;
                    var query = req.Query;
                    if (typeof name_1 === 'string' && typeof query === 'string') {
                        var autoRetrieveStreams = typeof (req.AutomaticallyRetrievesStreams) === 'boolean' ?
                            req.AutomaticallyRetrievesStreams : false;
                        var defQuery = new offlineODataPkg.OfflineODataDefiningQuery(name_1, query, autoRetrieveStreams);
                        try {
                            provider.addDefiningQuery(defQuery);
                        }
                        catch (error) {
                        }
                        subset.add(defQuery);
                    }
                }
                provider.download(subset, successHandler, failureHandler);
            }
            else {
                provider.download(successHandler, failureHandler);
            }
        });
    };
    ODataServiceProvider.prototype.initOfflineStore = function (context, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var storeParams = new offlineODataPkg.OfflineODataParameters();
            storeParams.setEnableRepeatableRequests(true);
            var inDemoMode = typeof params.inDemoMode === 'boolean' ? params.inDemoMode : false;
            ODataServiceProvider.demoDBPath = null;
            if (inDemoMode) {
                var paramDbPath = params.dbPath ? params.dbPath : '';
                var dPath = paramDbPath;
                if (dPath.endsWith('.udb')) {
                    if (!dPath.startsWith('/')) {
                        dPath = '/' + dPath;
                    }
                    var dbRelativeFolder = dPath.substring(0, dPath.lastIndexOf('/'));
                    ODataServiceProvider.demoDBPath = dbRelativeFolder;
                }
            }
            if (typeof params.serviceTimeZoneAbbreviation === 'string' && params.serviceTimeZoneAbbreviation.length !== 0) {
                ODataServiceProvider.serviceTimeZoneAbbreviation = params.serviceTimeZoneAbbreviation;
            }
            if (typeof params.storeEncryptionKey === 'string') {
                storeParams.setStoreEncryptionKey(params.storeEncryptionKey);
            }
            if (params.serviceHeaders) {
                storeParams.setCustomHeaders(_this.getHeadersMap(params.serviceHeaders));
            }
            if (params.currentUser) {
                storeParams.setCurrentUser(params.currentUser);
            }
            var isAppInMultiUserMode = WelcomeScreen_1.WelcomeScreen.getInstance().isAppInMultiUserMode();
            if (isAppInMultiUserMode) {
                storeParams.setForceUploadOnUserSwitch(isAppInMultiUserMode);
            }
            var storeParameters = params.storeParameters;
            if (storeParameters) {
                if (storeParameters.EnableIndividualErrorArchiveDeletion === true) {
                    storeParams.setEnableIndividualErrorArchiveDeletion(true);
                }
                if (storeParameters.StoreName) {
                    storeParams.setStoreName(storeParameters.StoreName);
                }
                if (storeParameters.EnableRepeatableRequests === false) {
                    storeParams.setEnableRepeatableRequests(false);
                }
                if (storeParameters.Timeout && !isNaN(Number(storeParameters.Timeout.toString()))) {
                    storeParams.setTimeout(java.lang.Integer.valueOf(storeParameters.Timeout.toString()));
                }
                if (storeParameters.EnableUndoLocalCreation) {
                    storeParams.setEnableUndoLocalCreation(storeParameters.EnableUndoLocalCreation);
                }
                if (storeParameters.EnableRequestQueueOptimization) {
                    storeParams.setEnableRequestQueueOptimization(storeParameters.EnableRequestQueueOptimization);
                }
            }
            var serviceURL = params.serviceUrl;
            if (serviceURL != null) {
                var powerManager = context.getSystemService(android.content.Context.POWER_SERVICE);
                ODataServiceProvider.releaseWakeLock();
                ODataServiceProvider._wakeLock = powerManager.newWakeLock(android.os.PowerManager.FULL_WAKE_LOCK, 'MyApp::MyWakelockTag');
                try {
                    if (!storeParams.getStoreName()) {
                        if (ODataServiceUtils_1.ODataServiceUtils.hasPathSuffix(serviceURL)) {
                            reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_STORENAME_NOT_DEFINED));
                            return;
                        }
                        var storeName = ODataServiceUtils_1.ODataServiceUtils.getServiceName(serviceURL);
                        if (storeName != null) {
                            storeParams.setStoreName(storeName);
                        }
                    }
                    storeParams.setStorePath(new java.net.URL('file:/' + ODataServiceProvider.offlineODataDirectory(context)));
                    storeParams.setExtraStreamParameters(ODataServiceProvider.extraStreamParameters);
                    var udbFileExists_1 = false;
                    if (storeParams.getStoreName() != null) {
                        if (inDemoMode) {
                            _this.initDemoDatabase(context, storeParams.getStoreName());
                            var builder = new okhttp3.OkHttpClient.Builder();
                            foundationPkg.common.ClientProvider.set(builder.build());
                        }
                        else {
                            var odataDir = ODataServiceProvider.offlineODataDirectory(context);
                            var udbFilename = storeParams.getStoreName() + '.udb';
                            var udbFile = new java.io.File(odataDir + '/' + udbFilename);
                            udbFileExists_1 = udbFile.exists();
                        }
                    }
                    var okHttpClient = foundationPkg.common.ClientProvider.get();
                    oDataPkg.core.AndroidSystem.setContext(context);
                    var progressTextObj = DataConverter_1.DataConverter.toJavaObject(params.progressText);
                    var provider_1 = new offlineODataPkg.OfflineODataProvider(new java.net.URL(serviceURL), storeParams, okHttpClient, null, new oDataPkg.mdk.MDKOfflineODataDelegate(context, progressTextObj));
                    provider_1 = _this.applyOfflineServiceOptions(params, provider_1);
                    provider_1 = _this.applyCsdlOptions(params, provider_1);
                    ODataServiceProvider.prevUser = provider_1.getPreviousUser();
                    var debugODataProvider = params.debugODataProvider;
                    if (debugODataProvider) {
                        var logger = org.slf4j.LoggerFactory.getLogger('com.sap.cloud.mobile.odata.offline');
                        logger.setLevel(ch.qos.logback.classic.Level.DEBUG);
                    }
                    if (params.definingRequests) {
                        for (var _i = 0, _a = params.definingRequests; _i < _a.length; _i++) {
                            var req = _a[_i];
                            var name_2 = req.Name;
                            var query = req.Query;
                            if (typeof name_2 === 'string' && typeof query === 'string') {
                                var autoRetrieveStreams = typeof (req.AutomaticallyRetrievesStreams) === 'boolean' ?
                                    req.AutomaticallyRetrievesStreams : false;
                                var defQuery = new offlineODataPkg.OfflineODataDefiningQuery(name_2, query, autoRetrieveStreams);
                                provider_1.addDefiningQuery(defQuery);
                            }
                        }
                    }
                    ODataServiceProvider._wakeLock.acquire();
                    provider_1.open(new oDataPkg.core.Action0({
                        call: function () {
                            ODataServiceProvider.releaseWakeLock();
                            _this.storeStates = StoreStates.Initialized;
                            _this.dataService = new oDataPkg.DataService(provider_1);
                            resolve(null);
                        },
                    }), new oDataPkg.core.Action1({
                        call: function (error) {
                            ODataServiceProvider.releaseWakeLock();
                            if (!udbFileExists_1) {
                                _this.storeStates = StoreStates.Error;
                            }
                            var jsError = ODataServiceProvider.toJSError(error);
                            reject(CommonUtil_1.CommonUtil.formatOfflineError(jsError));
                        },
                    }));
                }
                catch (error) {
                    ODataServiceProvider.releaseWakeLock();
                    reject(ODataServiceProvider.toJSError(error));
                }
            }
            else {
                reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_INIT_OFFLINE_DATA_PROVIDER_FAILED));
            }
        });
    };
    ODataServiceProvider.prototype.upload = function (params) {
        var _this = this;
        if (this.dataService == null) {
            return Promise.reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_UPLOAD_NOT_INITIALIZED));
        }
        return new Promise(function (resolve, reject) {
            var provider = _this.getOfflineODataProvider();
            try {
                if (_this.getOfflineODataProvider().isRequestQueueEmpty()) {
                    resolve(null);
                    return;
                }
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
                return;
            }
            var successHandler = new oDataPkg.core.Action0({
                call: function () { return resolve(null); },
            });
            var failureHandler = new oDataPkg.core.Action1({
                call: function (error) {
                    var jsError = ODataServiceProvider.toJSError(error);
                    reject(CommonUtil_1.CommonUtil.formatOfflineError(jsError));
                },
            });
            if (params.uploadCategories) {
                var uploadCategoryArr = [];
                for (var _i = 0, _a = params.uploadCategories; _i < _a.length; _i++) {
                    var category = _a[_i];
                    uploadCategoryArr.push(new UploadCategory(category));
                }
                provider.upload(uploadCategoryArr, successHandler, failureHandler);
            }
            else {
                provider.upload(successHandler, failureHandler);
            }
        });
    };
    ODataServiceProvider.prototype.clear = function (params) {
        return this.offlineStateChange(params, StateChangeOperation.Clear);
    };
    ODataServiceProvider.prototype.close = function (params) {
        return this.offlineStateChange(params, StateChangeOperation.Close);
    };
    ODataServiceProvider.prototype.cancelUpload = function (params) {
        var _this = this;
        if (this.dataService == null) {
            return Promise.reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_UPLOAD_NOT_INITIALIZED));
        }
        return new Promise(function (resolve, reject) {
            try {
                _this.getOfflineODataProvider().cancelUpload();
                resolve(null);
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.cancelDownload = function (params) {
        var _this = this;
        if (this.dataService == null) {
            return Promise.reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_DOWNLOAD_NOT_INITIALIZED));
        }
        return new Promise(function (resolve, reject) {
            try {
                _this.getOfflineODataProvider().cancelDownload();
                resolve(null);
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.create = function (params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var onlineServiceName = null;
            var serviceURL = params.serviceUrl;
            if (serviceURL && typeof serviceURL === 'string') {
                onlineServiceName = ODataServiceUtils_1.ODataServiceUtils.getServiceName(serviceURL);
                var okHttpClient = foundationPkg.common.ClientProvider.get();
                okHttpClient = clientFoundationPkg.OkHttpClientConfigurator.addLanguageInterceptor(application.android.context, okHttpClient);
                var provider = new oDataPkg.mdk.MDKOnlineODataProvider(onlineServiceName, serviceURL, okHttpClient);
                provider.setTraceRequests(true);
                provider.setTraceWithData(true);
                provider.setPrettyTracing(true);
                if (params.serviceHeaders && Object.keys(params.serviceHeaders).length !== 0) {
                    var serviceHeader = _this.getHttpHeaders(params.serviceHeaders);
                    provider.getHttpHeaders().addAll(serviceHeader);
                }
                provider = _this.applyServiceOptions(params, provider);
                provider = _this.applyCsdlOptions(params, provider);
                _this.dataService = new oDataPkg.DataService(provider);
                try {
                    provider.acquireTokenAsync(_this.dataService, new oDataPkg.core.Action0({
                        call: function () {
                            resolve(null);
                        },
                    }), new oDataPkg.core.Action1({
                        call: function (error) { return reject(ODataServiceProvider.toJSError(error)); },
                    }));
                    resolve(null);
                }
                catch (error) {
                    reject(ODataServiceProvider.toJSError(error));
                }
            }
            else {
                reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_CREATE_SERVICE_INCORRECT_PARAMETERS));
            }
        });
    };
    ODataServiceProvider.prototype.open = function (context, params) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.dataService != null && _this.isOnline()) {
                try {
                    oDataPkg.core.AndroidSystem.setContext(context);
                    _this.dataService.loadMetadataAsync(new oDataPkg.core.Action0({
                        call: function () {
                            _this.isOnlineServiceOpen = true;
                            resolve(null);
                        },
                    }), new oDataPkg.core.Action1({
                        call: function (error) { return reject(ODataServiceProvider.toJSError(error)); },
                    }));
                }
                catch (error) {
                    reject(ODataServiceProvider.toJSError(error));
                }
            }
            else {
                reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_SERVICE_PROVIDER_NOT_FOUND));
            }
        });
    };
    ODataServiceProvider.prototype.read = function (entitySet, properties, queryString, headers, requestOptions, pageSize) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var filteredQueryString = _this.filterQueryOptions(entitySet, queryString);
                var query = _this.getQuery(entitySet, properties, filteredQueryString, false);
                if (pageSize) {
                    query.page(pageSize);
                }
                var successHandler = new oDataPkg.core.Action1({
                    call: function (queryResult) {
                        var entityList = queryResult.getEntityList();
                        if (entitySet === 'ErrorArchive' && !_this.isOnline()) {
                            for (var i = 0; i < entityList.length(); i++) {
                                var entityValue = entityList.get(i);
                                if (entityValue) {
                                    try {
                                        var affectedEntityNavProp = entityValue.getEntityType().getProperty('AffectedEntity');
                                        _this.dataService.loadProperty(affectedEntityNavProp, entityValue);
                                    }
                                    catch (error) {
                                        trace_1.write(ODataServiceProvider.toJSError(error).message, 'mdk.trace.odata', trace_1.messageType.error);
                                    }
                                }
                            }
                        }
                        for (var i = 0; i < entityList.length(); i++) {
                            var entity = entityList.get(i);
                            if (entity.getReadLink() == null) {
                                entity.setReadLink(entity.getCanonicalURL());
                            }
                        }
                        var isErrorArchive = false;
                        if (entitySet === 'ErrorArchive') {
                            isErrorArchive = true;
                        }
                        var dataContext = new oDataPkg.DataContext(_this.dataService.getMetadata());
                        resolve(ODataHelper_1.ODataHelper.entityValueListToJson(entityList, dataContext, isErrorArchive));
                    },
                });
                var failureHandler = new oDataPkg.core.Action1({
                    call: function (error) { return reject(ODataServiceProvider.toJSError(error)); },
                });
                _this.dataService.executeQueryAsync(query, successHandler, failureHandler, _this.getHttpHeaders(headers), _this.getRequestOptions(requestOptions));
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.createEntity = function (odataCreator) {
        try {
            return odataCreator.execute(this.dataService, this.getChangeSetManager()).catch(function (error) {
                throw ODataServiceProvider.toJSError(error);
            });
        }
        catch (error) {
            throw ODataServiceProvider.toJSError(error);
        }
    };
    ODataServiceProvider.prototype.createRelatedEntity = function (odataCreator) {
        try {
            return odataCreator.execute(this.dataService, this.getChangeSetManager()).catch(function (error) {
                throw ODataServiceProvider.toJSError(error);
            });
        }
        catch (error) {
            throw ODataServiceProvider.toJSError(error);
        }
    };
    ODataServiceProvider.prototype.updateEntity = function (odataUpdater) {
        try {
            return odataUpdater.execute(this.dataService, this.getChangeSetManager()).catch(function (error) {
                throw ODataServiceProvider.toJSError(error);
            });
        }
        catch (error) {
            throw ODataServiceProvider.toJSError(error);
        }
    };
    ODataServiceProvider.prototype.deleteEntity = function (odataDeleter) {
        try {
            return odataDeleter.execute(this.dataService, this.getChangeSetManager()).catch(function (error) {
                throw ODataServiceProvider.toJSError(error);
            });
        }
        catch (error) {
            throw ODataServiceProvider.toJSError(error);
        }
    };
    ODataServiceProvider.prototype.deleteMediaEntity = function (entitySetName, queryString, readLink, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var entity_1 = null;
                if (queryString) {
                    var entities = _this.getEntityUsingQueryOptions(queryString, entitySetName);
                    if (entities === null || entities.length() !== 1) {
                        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MORE_THAN_1_ENTITY_RETURNED, entities.length()));
                    }
                    entity_1 = entities.get(0);
                }
                else if (readLink) {
                    entity_1 = _this.getEntityUsingReadLink(readLink, entitySetName);
                }
                if (entity_1) {
                    _this.dataService.deleteEntityAsync(entity_1, new oDataPkg.core.Action0({
                        call: function () {
                            var dataContext = new oDataPkg.DataContext(_this.dataService.getMetadata());
                            resolve(ODataHelper_1.ODataHelper.entityValueToJson(entity_1, dataContext));
                        },
                    }), new oDataPkg.core.Action1({
                        call: function (error) { return reject(error); },
                    }), _this.getHttpHeaders(headers), _this.getRequestOptions(requestOptions));
                }
                else {
                    reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_DELETE_MEDIA_LOADENTITY_FAILURE));
                }
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.createMediaEntity = function (entitySetName, properties, headers, requestOptions, media) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var entitySet = _this.dataService.getEntitySet(entitySetName);
                var entityType = entitySet.getEntityType();
                var converter = new ODataConverter_1.ODataConverter(_this.dataService);
                var entities_1 = [];
                var errors_1 = [];
                var mediaCount_1 = 0;
                var _loop_1 = function (mediaContent) {
                    if (!mediaContent.content || !mediaContent.contentType) {
                        throw new Error(ErrorMessage_1.ErrorMessage.ODATA_CREATE_MEDIA_INVALID_MEDIA_CONTENT);
                    }
                    var content = void 0;
                    if (typeof mediaContent.content === 'string') {
                        content = android.util.Base64.decode(mediaContent.content, android.util.Base64.DEFAULT);
                    }
                    else {
                        content = mediaContent.content;
                    }
                    var mediaStream = oDataPkg.ByteStream.fromBinary(content);
                    mediaStream.setMediaType(mediaContent.contentType);
                    var entity = oDataPkg.EntityValue.ofType(entityType);
                    for (var key in properties) {
                        if (key) {
                            var property = entityType.getProperty(key);
                            entity.setDataValue(property, converter.convert(key, properties[key], property.getDataType().getCode(), property.getDataType().getName()));
                        }
                    }
                    try {
                        _this.dataService.createMediaAsync(entity, mediaStream, new oDataPkg.core.Action0({
                            call: function () {
                                var dataContext = new oDataPkg.DataContext(_this.dataService.getMetadata());
                                entities_1.push(ODataHelper_1.ODataHelper.entityValueToJson(entity, dataContext));
                                mediaCount_1++;
                                if (media.length === mediaCount_1) {
                                    _this.endCreateMediaEntity(media.length, entities_1, errors_1, resolve, reject);
                                }
                            },
                        }), new oDataPkg.core.Action1({
                            call: function (error) {
                                var err = ODataServiceProvider.toJSError(error);
                                errors_1.push(err.message);
                                mediaCount_1++;
                                if (media.length === mediaCount_1) {
                                    _this.endCreateMediaEntity(media.length, entities_1, errors_1, resolve, reject);
                                }
                            },
                        }), _this.getHttpHeaders(headers), _this.getRequestOptions(requestOptions));
                    }
                    catch (error) {
                        reject(ODataServiceProvider.toJSError(error));
                    }
                };
                for (var _i = 0, media_1 = media; _i < media_1.length; _i++) {
                    var mediaContent = media_1[_i];
                    _loop_1(mediaContent);
                }
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.createRelatedMediaEntity = function (entitySetName, properties, parent, headers, requestOptions, media) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var entitySet = _this.dataService.getEntitySet(entitySetName);
                var entityType = entitySet.getEntityType();
                var parentEntityVal = _this.getEntityValue(parent.entitySet, parent.queryOptions, parent.readLink);
                var parentProperty = parentEntityVal.getEntityType().getProperty(parent.property);
                var converter = new ODataConverter_1.ODataConverter(_this.dataService);
                var entities_2 = [];
                var errors_2 = [];
                var mediaCount_2 = 0;
                var _loop_2 = function (mediaContent) {
                    if (!mediaContent.content || !mediaContent.contentType) {
                        throw new Error(ErrorMessage_1.ErrorMessage.ODATA_CREATE_MEDIA_INVALID_MEDIA_CONTENT);
                    }
                    var content = void 0;
                    if (typeof mediaContent.content === 'string') {
                        content = android.util.Base64.decode(mediaContent.content, android.util.Base64.DEFAULT);
                    }
                    else {
                        content = mediaContent.content;
                    }
                    var mediaStream = oDataPkg.ByteStream.fromBinary(content);
                    mediaStream.setMediaType(mediaContent.contentType);
                    var entityVal = oDataPkg.EntityValue.ofType(entityType);
                    for (var key in properties) {
                        if (key) {
                            var property = entityType.getProperty(key);
                            entityVal.setDataValue(property, converter.convert(key, properties[key], property.getDataType().getCode(), property.getDataType().getName()));
                        }
                    }
                    try {
                        clientODataPkg.DataServiceUtils.createRelatedMediaAsync(_this.dataService, entityVal, mediaStream, parentEntityVal, parentProperty, new oDataPkg.core.Action0({ call: function () {
                                var dataContext = new oDataPkg.DataContext(_this.dataService.getMetadata());
                                entities_2.push(ODataHelper_1.ODataHelper.entityValueToJson(entityVal, dataContext));
                                mediaCount_2++;
                                if (media.length === mediaCount_2) {
                                    _this.endCreateMediaEntity(media.length, entities_2, errors_2, resolve, reject);
                                }
                            },
                        }), new oDataPkg.core.Action1({
                            call: function (error) {
                                var err = ODataServiceProvider.toJSError(error);
                                errors_2.push(err.message);
                                mediaCount_2++;
                                if (media.length === mediaCount_2) {
                                    _this.endCreateMediaEntity(media.length, entities_2, errors_2, resolve, reject);
                                }
                            },
                        }), _this.getHttpHeaders(headers), _this.getRequestOptions(requestOptions));
                    }
                    catch (error) {
                        reject(ODataServiceProvider.toJSError(error));
                    }
                };
                for (var _i = 0, media_2 = media; _i < media_2.length; _i++) {
                    var mediaContent = media_2[_i];
                    _loop_2(mediaContent);
                }
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.createMediaEntity1 = function (entitySetName, properties, headers, media) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var entitySet = _this.dataService.getEntitySet(entitySetName);
                var entityType = entitySet.getEntityType();
                var entity_2 = oDataPkg.EntityValue.ofType(entityType);
                for (var key in properties) {
                    if (key) {
                        var property = entityType.getProperty(key);
                        entity_2.setDataValue(property, ODataServiceUtils_1.ODataServiceUtils.convert(key, properties[key], property.getDataType().getCode()));
                    }
                }
                try {
                    entityType.setMedia(false);
                    _this.dataService.createEntity(entity_2);
                    var entityID = entity_2.getEntityID();
                    var regExp = /\(([^)]+)\)/;
                    var match = regExp.exec(entityID);
                    var key = 'slug';
                    headers[key] = match[1];
                }
                catch (error) {
                    reject(ODataServiceProvider.toJSError(error));
                }
                finally {
                    entityType.setMedia(true);
                }
                var entities_3 = [];
                var errors_3 = [];
                var mediaCount_3 = 0;
                for (var _i = 0, media_3 = media; _i < media_3.length; _i++) {
                    var mediaContent = media_3[_i];
                    if (!mediaContent.content || !mediaContent.contentType) {
                        throw new Error(ErrorMessage_1.ErrorMessage.ODATA_CREATE_MEDIA_INVALID_MEDIA_CONTENT);
                    }
                    var content = void 0;
                    if (typeof mediaContent.content === 'string') {
                        content = android.util.Base64.decode(mediaContent.content, android.util.Base64.DEFAULT);
                    }
                    else {
                        content = mediaContent.content;
                    }
                    var mediaStream = oDataPkg.ByteStream.fromBinary(content);
                    mediaStream.setMediaType(mediaContent.contentType);
                    try {
                        _this.dataService.createMediaAsync(entity_2, mediaStream, new oDataPkg.core.Action0({
                            call: function () {
                                var dataContext = new oDataPkg.DataContext(_this.dataService.getMetadata());
                                entities_3.push(ODataHelper_1.ODataHelper.entityValueToJson(entity_2, dataContext));
                                mediaCount_3++;
                                if (media.length === mediaCount_3) {
                                    _this.endCreateMediaEntity(media.length, entities_3, errors_3, resolve, reject);
                                }
                            },
                        }), new oDataPkg.core.Action1({
                            call: function (error) {
                                var err = ODataServiceProvider.toJSError(error);
                                errors_3.push(err.message);
                                mediaCount_3++;
                                if (media.length === mediaCount_3) {
                                    _this.endCreateMediaEntity(media.length, entities_3, errors_3, resolve, reject);
                                }
                            },
                        }), _this.getHttpHeaders(headers));
                    }
                    catch (error) {
                        reject(ODataServiceProvider.toJSError(error));
                    }
                }
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.downloadMedia = function (entitySet, queryString, readLink, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var entity = _this.getEntityValue(entitySet, queryString, readLink);
                if (entity != null) {
                    _this.dataService.downloadMediaAsync(entity, new oDataPkg.core.Action1({
                        call: function (data) {
                            resolve(data);
                        },
                    }), new oDataPkg.core.Action1({
                        call: function (error) { return reject(ODataServiceProvider.toJSError(error)); },
                    }), _this.getHttpHeaders(headers), _this.getRequestOptions(requestOptions));
                }
                else {
                    reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_DOWNLOADMEDIA_FAILED));
                }
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.isMediaLocal = function (entitySet, readLink) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var fixedEntitySet = entitySet;
            if (fixedEntitySet.indexOf('/') === 0) {
                fixedEntitySet = fixedEntitySet.substring(1);
            }
            try {
                var entityValue = oDataPkg.EntityValue.ofType(_this.dataService.getEntitySet(fixedEntitySet).getEntityType());
                entityValue.setReadLink(readLink);
                if (!_this.isOnline()) {
                    _this.dataService.loadEntity(entityValue);
                }
                var isLocal = entityValue.getMediaStream().isOffline();
                resolve(isLocal);
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.uploadStream = function (entitySetName, properties, query, readLink, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var entitySet = _this.dataService.getEntitySet(entitySetName);
                var entityType = entitySet.getEntityType();
                var entityValue_1 = _this.getEntityValue(entitySetName, query, readLink);
                var count_1 = 0;
                var propertiesLength_1 = Object.keys(properties).length;
                if (entityValue_1 != null) {
                    for (var key in properties) {
                        if (key && properties[key]) {
                            var media = Array.isArray(properties[key]) ? properties[key][0] : properties[key];
                            if (!media.content || !media.contentType) {
                                throw new Error(ErrorMessage_1.ErrorMessage.ODATA_UPLOAD_STREAM_INVALID_STREAM_DATA);
                            }
                            var content = void 0;
                            if (typeof media.content === 'string') {
                                content = android.util.Base64.decode(media.content, android.util.Base64.DEFAULT);
                            }
                            else {
                                content = media.content;
                            }
                            var mediaStream = oDataPkg.ByteStream.fromBinary(content);
                            mediaStream.setMediaType(media.contentType);
                            var streamlink = entityValue_1.getStreamLink(entityType.getProperty(key));
                            count_1++;
                            _this.dataService.uploadStreamAsync(entityValue_1, streamlink, mediaStream, new oDataPkg.core.Action0({
                                call: function () {
                                    if (count_1 === propertiesLength_1) {
                                        var dataContext = new oDataPkg.DataContext(_this.dataService.getMetadata());
                                        resolve(ODataHelper_1.ODataHelper.entityValueToJson(entityValue_1, dataContext));
                                    }
                                },
                            }), new oDataPkg.core.Action1({
                                call: function (error) {
                                    reject(ODataServiceProvider.toJSError(error));
                                },
                            }), _this.getHttpHeaders(headers), _this.getRequestOptions(requestOptions));
                        }
                    }
                }
                else {
                    reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_UPLOADSTREAM_FAILED));
                }
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.downloadStream = function (entitySetName, properties, query, readLink, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var entitySet = _this.dataService.getEntitySet(entitySetName);
                var entityType = entitySet.getEntityType();
                var entityValue = _this.getEntityValue(entitySetName, query, readLink);
                if (entityValue != null) {
                    var promises = [];
                    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
                        var prop = properties_1[_i];
                        if (prop) {
                            var streamlink = entityType.getProperty(prop).getStreamLink(entityValue);
                            promises.push(_this.downloadStreamData(entityValue, streamlink, _this.getHttpHeaders(headers), _this.getRequestOptions(requestOptions)));
                        }
                    }
                    return Promise.all(promises).then(function (datas) {
                        resolve(datas);
                    }).catch(function (err) {
                        reject(err);
                    });
                }
                else {
                    reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_DOWNLOADSTREAM_FAILED));
                }
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.beginChangeSet = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.getChangeSetManager().beginChangeSet();
                resolve(true);
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.cancelChangeSet = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.getChangeSetManager().cancelChangeSet();
                resolve(true);
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.commitChangeSet = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.getChangeSetManager().commitChangeSet().then(function () {
                    resolve(true);
                }).catch(function (error) {
                    reject(ODataServiceProvider.toJSError(error));
                });
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.count = function (entitySet, properties, queryString, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var query = _this.getQuery(entitySet, properties, queryString, true);
                query.setCountOnly(true);
                var successHandler = new oDataPkg.core.Action1({
                    call: function (queryResult) {
                        var count = queryResult.getCount();
                        resolve(count);
                    },
                });
                var failureHandler = new oDataPkg.core.Action1({
                    call: function (error) { return reject(ODataServiceProvider.toJSError(error)); },
                });
                _this.dataService.executeQueryAsync(query, successHandler, failureHandler, _this.getHttpHeaders(headers), _this.getRequestOptions(requestOptions));
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.callFunction = function (functionName, functionParameters, functionHeaders, functionOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.dataService != null) {
                try {
                    var method_1 = _this.dataService.getDataMethod(functionName);
                    var query = new oDataPkg.DataQuery();
                    var converter = new ODataConverter_1.ODataConverter(_this.dataService);
                    var inputParams = new oDataPkg.ParameterList();
                    var methodParameters = method_1.getParameters();
                    if (methodParameters !== null) {
                        for (var i = 0; i < methodParameters.length(); i++) {
                            var parameter = methodParameters.get(i);
                            if (functionParameters != null) {
                                var parameterValue = functionParameters[parameter.getName()];
                                if (parameterValue === undefined) {
                                    if (!parameter.isNullable()) {
                                        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.PROPERTY_VALUE_REQUIRED, parameter.getName(), parameter.getType().toString()));
                                    }
                                    continue;
                                }
                                var inputParam = new oDataPkg.Parameter();
                                inputParam.setType(parameter.getType());
                                inputParam.setName(parameter.getName());
                                inputParam.setValue(converter.convert(parameter.getName(), parameterValue, parameter.getType().getCode(), parameter.getType().getName()));
                                inputParams.add(inputParam);
                            }
                        }
                    }
                    var inputHeaders = _this.getHttpHeaders(functionHeaders);
                    var inputOptions = _this.getRequestOptions(functionOptions);
                    var successHandler = new oDataPkg.core.Action1({
                        call: function (queryResult) {
                            var result = '';
                            if (queryResult) {
                                try {
                                    var dataContext = new oDataPkg.DataContext(_this.dataService.getMetadata());
                                    if (method_1.getReturnType().isEntityList()) {
                                        var entityValueList = queryResult.getEntityList();
                                        if (entityValueList !== null) {
                                            result = ODataHelper_1.ODataHelper.entityValueListToJson(entityValueList, dataContext);
                                        }
                                    }
                                    else if (method_1.getReturnType().isComplexList()) {
                                        var complexList = queryResult.getComplexList();
                                        if (complexList !== null) {
                                            result = ODataHelper_1.ODataHelper.complexValueListToJson(complexList, dataContext).toString();
                                        }
                                    }
                                    else if (method_1.getReturnType().isEntity()) {
                                        var entityValue = queryResult.getOptionalEntity();
                                        if (entityValue !== null) {
                                            result = ODataHelper_1.ODataHelper.entityValueToJson(entityValue, dataContext).toString();
                                        }
                                    }
                                    else if (method_1.getReturnType().isComplex()) {
                                        var complexValue = queryResult.getOptionalComplex();
                                        if (complexValue !== null) {
                                            result = ODataHelper_1.ODataHelper.complexValueToJson(complexValue, dataContext).toString();
                                        }
                                    }
                                    else if (method_1.getReturnType().isBasic()) {
                                        var basicValue = queryResult.getOptionalBasic();
                                        if (basicValue !== null) {
                                            result = ODataHelper_1.ODataHelper.dataValueToJson(basicValue, dataContext).toString();
                                        }
                                    }
                                    else if (method_1.getReturnType().isBasicList()) {
                                        var basicList = queryResult.getBasicList();
                                        if (basicList !== null) {
                                            result = ODataHelper_1.ODataHelper.dataListValueToJson(basicList, dataContext).toString();
                                        }
                                    }
                                }
                                catch (error) {
                                    trace_1.write(ODataServiceProvider.toJSError(error).message, 'mdk.trace.odata', trace_1.messageType.error);
                                }
                            }
                            resolve(result);
                        },
                    });
                    var failureHandler = new oDataPkg.core.Action1({
                        call: function (error) { return reject(ODataServiceProvider.toJSError(error)); },
                    });
                    _this.dataService.executeQueryAsync(query.invoke(method_1, inputParams), successHandler, failureHandler, inputHeaders, inputOptions);
                }
                catch (error) {
                    reject(ODataServiceProvider.toJSError(error));
                }
            }
            else {
                reject(new Error(ErrorMessage_1.ErrorMessage.OPEN_SERVICE_NOT_INITIALIZED));
            }
        });
    };
    ODataServiceProvider.prototype.undoPendingChanges = function (entitySetName, queryOptions, editLink) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var entityValue = _this.getEntityValueWithQueryOptionOrEditLink(entitySetName, queryOptions, editLink);
                if (entityValue) {
                    _this.getOfflineODataProvider().undoPendingChanges(entityValue);
                    var newEntityVal = void 0;
                    try {
                        if (queryOptions && queryOptions.length !== 0) {
                            var entities = _this.getEntityUsingQueryOptions(queryOptions, entitySetName);
                            if (entities && entities.length() > 0) {
                                newEntityVal = entities.get(0);
                            }
                        }
                        else {
                            _this.dataService.loadEntity(entityValue);
                            newEntityVal = entityValue;
                        }
                    }
                    catch (_a) {
                        newEntityVal = null;
                    }
                    if (newEntityVal) {
                        var dataContext = new oDataPkg.DataContext(_this.dataService.getMetadata());
                        resolve(ODataHelper_1.ODataHelper.entityValueToJson(newEntityVal, dataContext));
                    }
                    else {
                        resolve('');
                    }
                }
                else {
                    reject(new Error(ErrorMessage_1.ErrorMessage.ODATA_UNDO_PENDING_CHANGES_LOADENTITY_FAILURE));
                }
            }
            catch (error) {
                reject(ODataServiceProvider.toJSError(error));
            }
        });
    };
    ODataServiceProvider.prototype.getOfflineStoreStatus = function () {
        return this.storeStates.toString().toLowerCase();
    };
    ODataServiceProvider.prototype.getPreviousUser = function () {
        return ODataServiceProvider.prevUser;
    };
    ODataServiceProvider.prototype.getPropertyType = function (entitySetName, propertyName) {
        try {
            var finalEntityType = null;
            if (entitySetName.indexOf('/') !== -1) {
                var splitEntitySet = entitySetName.split('/');
                var sourceEntitySetName = splitEntitySet[0].split('(')[0];
                var navigationPropertyName = splitEntitySet[splitEntitySet.length - 1];
                var navEntitySet = this.dataService.getEntitySet(sourceEntitySetName);
                if (navEntitySet != null) {
                    var navEntityType = navEntitySet.getEntityType();
                    var navProperty = this.getOptionalProperty(navEntityType, navigationPropertyName);
                    if (navProperty != null) {
                        finalEntityType = navProperty.getDataType().getItemType();
                    }
                }
            }
            else {
                var entity = this.dataService.getMetadata().getLookupSets().get(entitySetName);
                if (entity != null) {
                    finalEntityType = entity.getEntityType();
                }
            }
            if (finalEntityType != null) {
                var property = this.getOptionalProperty(finalEntityType, propertyName);
                if (property != null) {
                    return property.getType().toString();
                }
            }
        }
        catch (error) {
            trace_1.write(ODataServiceProvider.toJSError(error).message, 'mdk.trace.odata', trace_1.messageType.error);
        }
        return '';
    };
    ODataServiceProvider.prototype.getVersion = function () {
        return this.dataService.getMetadata().getVersionCode();
    };
    ODataServiceProvider.prototype.getOfflineParameter = function (name) {
        var provider = this.getOfflineODataProvider();
        if (!provider) {
            return null;
        }
        var storeParams = provider.getStoreParameters();
        if (name === 'CustomHeaders') {
            return storeParams.getCustomHeaders();
        }
        else {
            return null;
        }
    };
    ODataServiceProvider.prototype.setOfflineParameter = function (name, value) {
        var provider = this.getOfflineODataProvider();
        if (!provider) {
            return;
        }
        var storeParams = provider.getStoreParameters();
        if (name === 'CustomHeaders') {
            storeParams.setCustomHeaders(this.getHeadersMap(value));
        }
    };
    ODataServiceProvider.prototype.downloadStreamData = function (entityValue, streamlink, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.dataService.downloadStreamAsync(entityValue, streamlink, new oDataPkg.core.Action1({
                call: function (data) {
                    resolve(data);
                },
            }), new oDataPkg.core.Action1({
                call: function (error) {
                    reject(ODataServiceProvider.toJSError(error));
                },
            }), headers, requestOptions);
        });
    };
    ODataServiceProvider.prototype.getOptionalProperty = function (entityType, propertyName) {
        var propertyNames = propertyName.split('/');
        var currentPropertyName = propertyNames[0];
        var property = entityType.getPropertyMap().get(currentPropertyName);
        if (property != null) {
            if (propertyNames.length > 1) {
                var propertyType = property.getType();
                if (propertyType.isList()) {
                    propertyType = propertyType.getItemType();
                }
                if (propertyType instanceof oDataPkg.StructureType) {
                    propertyNames.splice(0, 1);
                    var path = propertyNames.join('/');
                    return propertyType.getProperty(path);
                }
            }
            else {
                return property;
            }
        }
    };
    ODataServiceProvider.prototype.getChangeSetManager = function () {
        if (this.changeSetManager == null) {
            this.changeSetManager = new ChangeSetManager_1.ChangeSetManager(this.dataService);
            return this.changeSetManager;
        }
        else {
            return this.changeSetManager;
        }
    };
    ODataServiceProvider.prototype.initDemoDatabase = function (context, name) {
        var odataDir = ODataServiceProvider.offlineODataDirectory(context);
        var sourceDir = 'app/branding';
        var rqUdbFilename = name + '.rq.udb';
        var udbFilename = name + '.udb';
        trace_1.write("Init Demo DB Source: " + sourceDir + " | ODataDir " + odataDir, 'mdk.trace.odata', trace_1.messageType.log);
        var rqUdbFile = new java.io.File(odataDir + '/' + rqUdbFilename);
        var udbFile = new java.io.File(odataDir + '/' + udbFilename);
        if (rqUdbFile.exists() && udbFile.exists()) {
            return;
        }
        if (ODataServiceProvider.demoDBPath != null && ODataServiceProvider.demoDBPath.length !== 0) {
            sourceDir = context.getExternalFilesDir(null).getAbsolutePath() + ODataServiceProvider.demoDBPath;
            clientODataPkg.DataServiceUtils.copyExternalStorageFile(context, sourceDir, odataDir, rqUdbFilename);
            clientODataPkg.DataServiceUtils.copyExternalStorageFile(context, sourceDir, odataDir, udbFilename);
        }
        else {
            clientODataPkg.DataServiceUtils.copyAssetFile(context, sourceDir, odataDir, rqUdbFilename);
            clientODataPkg.DataServiceUtils.copyAssetFile(context, sourceDir, odataDir, udbFilename);
        }
    };
    ODataServiceProvider.prototype.filterQueryOptions = function (entitySetName, queryOptions) {
        var stringToFilter = entitySetName;
        if (stringToFilter.startsWith('/')) {
            stringToFilter = stringToFilter.substring(1);
        }
        if (stringToFilter.indexOf('/') !== -1) {
            var splitEntitySet = stringToFilter.split('/');
            var sourceEntitySetName = splitEntitySet[0].split('(')[0];
            var navigationPropertyName = splitEntitySet[splitEntitySet.length - 1];
            var entitySet = this.dataService.getEntitySet(sourceEntitySetName);
            if (entitySet != null && queryOptions != null) {
                var propertyList = entitySet.getEntityType().getNavigationProperties();
                var navigationProperty = null;
                var iterator = propertyList.iterator();
                while (iterator.hasNext()) {
                    var property = iterator.next();
                    if (property.getName() === navigationPropertyName) {
                        navigationProperty = property;
                        break;
                    }
                }
                if (navigationProperty != null && !navigationProperty.getType().isEntityList()) {
                    var queryParams = queryOptions.split('&');
                    var sb = [];
                    for (var _i = 0, queryParams_1 = queryParams; _i < queryParams_1.length; _i++) {
                        var param = queryParams_1[_i];
                        if (param.indexOf('$top') === -1) {
                            if (sb.length > 0) {
                                sb.push('&');
                            }
                            sb.push(param);
                        }
                    }
                    return sb.length > 0 ? sb.join('') : null;
                }
            }
        }
        return queryOptions;
    };
    ODataServiceProvider.prototype.getQuery = function (entitySetName, properties, originalQueryString, forCount) {
        var containsLeadingAndTrailingBracketPattern = '.*\\(.*\\).*';
        var pattern = java.util.regex.Pattern.compile(containsLeadingAndTrailingBracketPattern);
        var matcher = pattern.matcher(entitySetName);
        var isReadLink = matcher.matches();
        var query = new oDataPkg.DataQuery();
        var queryString = originalQueryString;
        var queryUrl = forCount ? entitySetName + '/$count' : entitySetName;
        if (queryString == null || queryString.length === 0) {
            query.setUrl(queryUrl);
        }
        else {
            query.setUrl(queryUrl + '?' + queryString);
        }
        var entitySet;
        if (isReadLink) {
            query.setEntityKey(new oDataPkg.EntityKey());
            var bracket = '(';
            var token = entitySetName.split(bracket);
            var entitySetNameFromReadLink = token[0];
            if (entitySetNameFromReadLink.startsWith('/')) {
                entitySetNameFromReadLink = oDataPkg.core.StringFunction.removePrefix(entitySetNameFromReadLink, '/');
            }
            entitySet = this.dataService.getEntitySet(entitySetNameFromReadLink);
            if (this.isOnline()) {
                var splitEntitySet = entitySetName.split('/');
                if (splitEntitySet.length > 1) {
                    var navigationPropertyName = void 0, navigationProperty = void 0;
                    for (var i = 1; i < splitEntitySet.length - 1; i++) {
                        navigationPropertyName = splitEntitySet[i];
                        navigationProperty = entitySet.getEntityType().getProperty(navigationPropertyName);
                        entitySet = this.dataService.getEntitySet(navigationProperty.getType().getName());
                    }
                    navigationPropertyName = splitEntitySet[splitEntitySet.length - 1];
                    query.property(entitySet.getEntityType().getProperty(navigationPropertyName));
                }
            }
        }
        else {
            entitySet = this.dataService.getEntitySet(entitySetName);
        }
        query.from(entitySet);
        if (this.isOnline()) {
            var entityType = entitySet.getEntityType();
            if (properties && properties.length > 0) {
                for (var _i = 0, properties_2 = properties; _i < properties_2.length; _i++) {
                    var property = properties_2[_i];
                    query = query.select([entityType.getProperty(property)]);
                }
            }
        }
        return query;
    };
    ODataServiceProvider.prototype.getEntityUsingQueryOptions = function (queryString, entitySetName) {
        var query = this.getQuery(entitySetName, null, queryString, false);
        return this.dataService.executeQuery(query).getEntityList();
    };
    ODataServiceProvider.prototype.getEntityUsingReadLink = function (readLink, entitySetName) {
        var entitySet = this.dataService.getEntitySet(entitySetName);
        var entity = oDataPkg.EntityValue.ofType(entitySet.getEntityType());
        entity.setReadLink(readLink);
        if (this.isOnline()) {
            var query = new oDataPkg.DataQuery();
            query.setExpectSingle(true);
            this.dataService.loadEntity(entity, query);
        }
        else {
            this.dataService.loadEntity(entity);
        }
        return entity;
    };
    ODataServiceProvider.prototype.isOnline = function () {
        return (this.dataService.getProvider() instanceof oDataPkg.OnlineODataProvider);
    };
    ODataServiceProvider.prototype.getOfflineODataProvider = function () {
        return (this.dataService.getProvider() instanceof offlineODataPkg.OfflineODataProvider) ?
            this.dataService.getProvider() : null;
    };
    ODataServiceProvider.prototype.offlineStateChange = function (params, stateChangeOperation) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var operationType = stateChangeOperation.toString();
            if (_this.isOnline()) {
                Promise.reject(new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_INVALID_OP_TYPE, operationType)));
                return;
            }
            var isForce = (typeof params.force === 'boolean') ? params.force : false;
            if (_this.dataService != null) {
                var isPending = false;
                var isQueueEmpty = false;
                if (!isForce) {
                    try {
                        isPending = _this.getOfflineODataProvider().hasPendingUpload();
                        isQueueEmpty = _this.getOfflineODataProvider().isRequestQueueEmpty();
                    }
                    catch (error) {
                        reject(ODataServiceProvider.toJSError(error));
                        return;
                    }
                }
                if ((!isPending && isQueueEmpty) || isForce) {
                    try {
                        switch (stateChangeOperation) {
                            case StateChangeOperation.Close:
                                _this.getOfflineODataProvider().close();
                                _this.storeStates = StoreStates.Closed;
                                break;
                            case StateChangeOperation.Clear:
                                _this.getOfflineODataProvider().clear();
                                break;
                            default:
                                break;
                        }
                        resolve(null);
                    }
                    catch (error) {
                        reject(ODataServiceProvider.toJSError(error));
                    }
                }
                else {
                    reject(new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_SERVICE_OP_PENDING_UPLOADS, operationType)));
                }
            }
            else {
                reject(new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_SERVICE_OP_NOT_INITIALIZED, operationType)));
            }
        });
    };
    ODataServiceProvider.prototype.endCreateMediaEntity = function (count, entities, errors, resolve, reject) {
        if (errors.length > 0) {
            var errMessage = '';
            for (var _i = 0, errors_4 = errors; _i < errors_4.length; _i++) {
                var error = errors_4[_i];
                if (errMessage) {
                    errMessage += ', ';
                }
                errMessage += error;
            }
            reject(new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_CREATE_MEDIA_ERROR, errors.length, count, errMessage)));
        }
        else {
            resolve(entities);
        }
    };
    ODataServiceProvider.prototype.getEntityValue = function (entitySetName, query, readLink) {
        var entityValue;
        if (query != null && query.length !== 0) {
            var entities = this.getEntityUsingQueryOptions(query, entitySetName);
            if (entities == null || entities.length() !== 1) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MORE_THAN_1_ENTITY_RETURNED, entities.length()));
            }
            entityValue = entities.get(0);
        }
        else if (readLink != null && readLink.length !== 0) {
            entityValue = this.getEntityUsingReadLink(readLink, entitySetName);
        }
        return entityValue;
    };
    ODataServiceProvider.prototype.getEntityValueWithQueryOptionOrEditLink = function (entitySetName, query, editLink) {
        var entityValue;
        if (query != null && query.length !== 0) {
            var entities = this.getEntityUsingQueryOptions(query, entitySetName);
            if (entities == null || entities.length() !== 1) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MORE_THAN_1_ENTITY_RETURNED, entities.length()));
            }
            entityValue = entities.get(0);
        }
        else if (editLink && editLink.length > 0) {
            var entitySet = this.dataService.getEntitySet(entitySetName);
            entityValue = oDataPkg.EntityValue.ofType(entitySet.getEntityType());
            entityValue.setEditLink(editLink);
        }
        return entityValue;
    };
    ODataServiceProvider.prototype.getHttpHeaders = function (headers) {
        return ODataHelper_1.ODataHelper.getHttpHeaders(headers);
    };
    ODataServiceProvider.prototype.getRequestOptions = function (requestOptions) {
        return ODataHelper_1.ODataHelper.getRequestOptions(requestOptions, this.dataService);
    };
    ODataServiceProvider.prototype.getHeadersMap = function (headers) {
        var headersMap = new java.util.HashMap();
        if (!headers) {
            return headersMap;
        }
        for (var key in headers) {
            if (key) {
                if (headers[key].indexOf('\r') !== -1 || headers[key].indexOf('\n') !== -1) {
                    throw new Error(ErrorMessage_1.ErrorMessage.ODATA_INVALID_CHARS_IN_HTTP_HEADERS);
                }
                headersMap.put(key, headers[key]);
            }
        }
        return headersMap;
    };
    ODataServiceProvider.prototype.applyServiceOptions = function (params, provider) {
        provider.getServiceOptions().setPingMethod('GET');
        provider.getServiceOptions().setCheckVersion(false);
        if (params.serviceOptions) {
            var options_1 = params.serviceOptions;
            var value_1 = null;
            Object.keys(options_1).forEach(function (key) {
                SharedLoggerManager_1.SharedLoggerManager.pluginDebug(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_SET_SERVICE_OPTIONS, key));
                switch (key) {
                    case ODataServiceOptions.avoidInPaths: {
                        value_1 = options_1[key];
                        if (value_1) {
                            provider.getServiceOptions().setAvoidInPaths(value_1.toString());
                        }
                        break;
                    }
                    case ODataServiceOptions.cacheMetadata: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setCacheMetadata((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.checkQueries: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setCheckQueries((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.checkResults: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setCheckResults((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.checkVersion: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setCheckVersion((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.clientID: {
                        value_1 = options_1[key];
                        if (value_1) {
                            provider.getServiceOptions().setClientID(value_1.toString());
                        }
                        break;
                    }
                    case ODataServiceOptions.createReturnsContent: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setCreateReturnsContent((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.dataFormat: {
                        value_1 = options_1[key];
                        if (!isNaN(Number(value_1.toString()))) {
                            provider.getServiceOptions().setDataFormat(Number(value_1.toString()));
                        }
                        break;
                    }
                    case ODataServiceOptions.dataVersion: {
                        value_1 = options_1[key];
                        if (!isNaN(Number(value_1.toString()))) {
                            provider.getServiceOptions().setDataVersion(Number(value_1.toString()));
                        }
                        break;
                    }
                    case ODataServiceOptions.databaseOnly: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setDatabaseOnly((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.fixMissingEmptyLists: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setFixMissingEmptyLists((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.fixMissingNullValues: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setFixMissingNullValues((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.logErrors: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setLogErrors((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.logWarnings: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setLogWarnings((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.metadataFile: {
                        value_1 = options_1[key];
                        if (value_1) {
                            provider.getServiceOptions().setMetadataFile(value_1.toString());
                        }
                        break;
                    }
                    case ODataServiceOptions.metadataText: {
                        value_1 = options_1[key];
                        if (value_1) {
                            provider.getServiceOptions().setMetadataText(value_1.toString());
                        }
                        break;
                    }
                    case ODataServiceOptions.metadataURL: {
                        value_1 = options_1[key];
                        if (value_1) {
                            provider.getServiceOptions().setMetadataURL(value_1.toString());
                        }
                        break;
                    }
                    case ODataServiceOptions.pingAccept: {
                        value_1 = options_1[key];
                        if (value_1) {
                            provider.getServiceOptions().setPingAccept(value_1.toString());
                        }
                        break;
                    }
                    case ODataServiceOptions.pingMethod: {
                        value_1 = options_1[key];
                        if (value_1) {
                            provider.getServiceOptions().setPingMethod(value_1.toString());
                        }
                        break;
                    }
                    case ODataServiceOptions.pingResource: {
                        value_1 = options_1[key];
                        if (value_1) {
                            provider.getServiceOptions().setPingResource(value_1.toString());
                        }
                        break;
                    }
                    case ODataServiceOptions.requiresToken: {
                        value_1 = options_1[key];
                        if (value_1) {
                            provider.getServiceOptions().setRequiresToken(value_1.toString());
                        }
                        break;
                    }
                    case ODataServiceOptions.requiresType: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setRequiresType((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.supportsAlias: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setSupportsAlias((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.supportsBatch: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setSupportsBatch((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.supportsBind: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setSupportsBind((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.supportsDelta: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setSupportsDelta((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.supportsNext: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setSupportsNext((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.supportsPatch: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setSupportsPatch((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.supportsUnbind: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setSupportsUnbind((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.updateReturnsContent: {
                        value_1 = options_1[key];
                        if (value_1 != null) {
                            provider.getServiceOptions().setUpdateReturnsContent((value_1.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    default: {
                        SharedLoggerManager_1.SharedLoggerManager.pluginError(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_UNSUPPORTED_SERVICE_OPTIONS, key));
                        break;
                    }
                }
            });
        }
        return provider;
    };
    ODataServiceProvider.prototype.applyOfflineServiceOptions = function (params, provider) {
        provider.getServiceOptions().setSupportsBind(false);
        if (params.serviceOptions) {
            var options_2 = params.serviceOptions;
            var value_2 = null;
            Object.keys(options_2).forEach(function (key) {
                SharedLoggerManager_1.SharedLoggerManager.pluginDebug(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_SET_SERVICE_OPTIONS, key));
                switch (key) {
                    case ODataServiceOptions.supportsBind: {
                        value_2 = options_2[key];
                        if (value_2 != null) {
                            provider.getServiceOptions().setSupportsBind((value_2.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    case ODataServiceOptions.supportsPatch: {
                        value_2 = options_2[key];
                        if (value_2 != null) {
                            provider.getServiceOptions().setSupportsPatch((value_2.toString().toLowerCase() === 'true'));
                        }
                        break;
                    }
                    default: {
                        SharedLoggerManager_1.SharedLoggerManager.pluginError(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_UNSUPPORTED_SERVICE_OPTIONS, key));
                        break;
                    }
                }
            });
        }
        return provider;
    };
    ODataServiceProvider.prototype.applyCsdlOptions = function (params, provider) {
        var csdlOptionsBitmap = 0;
        SharedLoggerManager_1.SharedLoggerManager.pluginDebug(ErrorMessage_1.ErrorMessage.ODATA_BELOW_ARE_CSDL_OPTIONS);
        if (params.csdlOptions) {
            var optString_1 = '';
            params.csdlOptions.forEach(function (option) {
                optString_1 = option.toString();
                SharedLoggerManager_1.SharedLoggerManager.pluginDebug(optString_1);
                switch (optString_1) {
                    case ODataCDSLOptions.allowCaseConflicts: {
                        csdlOptionsBitmap |= CSDLOption.allowCaseConflicts;
                        break;
                    }
                    case ODataCDSLOptions.defaultVariableScale: {
                        csdlOptionsBitmap |= CSDLOption.defaultVariableScale;
                        break;
                    }
                    case ODataCDSLOptions.defaultVariableSrid: {
                        csdlOptionsBitmap |= CSDLOption.defaultVariableSrid;
                        break;
                    }
                    case ODataCDSLOptions.disableFacetWarnings: {
                        csdlOptionsBitmap |= CSDLOption.disableFacetWarnings;
                        break;
                    }
                    case ODataCDSLOptions.disableLoggingOfErrors: {
                        csdlOptionsBitmap |= CSDLOption.disableLoggingOfErrors;
                        break;
                    }
                    case ODataCDSLOptions.disableLoggingOfWarnings: {
                        csdlOptionsBitmap |= CSDLOption.disableLoggingOfWarnings;
                        break;
                    }
                    case ODataCDSLOptions.disableNameValidation: {
                        csdlOptionsBitmap |= CSDLOption.disableNameValidation;
                        break;
                    }
                    case ODataCDSLOptions.excludeServerOnlyElements: {
                        csdlOptionsBitmap |= CSDLOption.excludeServerOnlyElements;
                        break;
                    }
                    case ODataCDSLOptions.failIfProviderIncompatible: {
                        csdlOptionsBitmap |= CSDLOption.failIfProviderIncompatible;
                        break;
                    }
                    case ODataCDSLOptions.ignoreAllAnnotations: {
                        csdlOptionsBitmap |= CSDLOption.ignoreAllAnnotations;
                        break;
                    }
                    case ODataCDSLOptions.ignoreAllReferences: {
                        csdlOptionsBitmap |= CSDLOption.ignoreAllReferences;
                        break;
                    }
                    case ODataCDSLOptions.ignoreEdmAnnotations: {
                        csdlOptionsBitmap |= CSDLOption.ignoreEdmAnnotations;
                        break;
                    }
                    case ODataCDSLOptions.ignoreExternalReferences: {
                        csdlOptionsBitmap |= CSDLOption.ignoreExternalReferences;
                        break;
                    }
                    case ODataCDSLOptions.ignoreInternalReferences: {
                        csdlOptionsBitmap |= CSDLOption.ignoreInternalReferences;
                        break;
                    }
                    case ODataCDSLOptions.ignoreStandardReferences: {
                        csdlOptionsBitmap |= CSDLOption.ignoreStandardReferences;
                        break;
                    }
                    case ODataCDSLOptions.ignoreUndefinedTerms: {
                        csdlOptionsBitmap |= CSDLOption.ignoreUndefinedTerms;
                        break;
                    }
                    case ODataCDSLOptions.ignoreXmlAnnotations: {
                        csdlOptionsBitmap |= CSDLOption.ignoreXmlAnnotations;
                        break;
                    }
                    case ODataCDSLOptions.logWithUnqualifiedFileNames: {
                        csdlOptionsBitmap |= CSDLOption.logWithUnqualifiedFileNames;
                        break;
                    }
                    case ODataCDSLOptions.processMixedVersions: {
                        csdlOptionsBitmap |= CSDLOption.processMixedVersions;
                        break;
                    }
                    case ODataCDSLOptions.resolveUndefinedTerms: {
                        csdlOptionsBitmap |= CSDLOption.resolveUndefinedTerms;
                        break;
                    }
                    case ODataCDSLOptions.retainOriginalText: {
                        csdlOptionsBitmap |= CSDLOption.retainOriginalText;
                        break;
                    }
                    case ODataCDSLOptions.retainResolvedText: {
                        csdlOptionsBitmap |= CSDLOption.retainResolvedText;
                        break;
                    }
                    case ODataCDSLOptions.strictFacetWarnings: {
                        csdlOptionsBitmap |= CSDLOption.strictFacetWarnings;
                        break;
                    }
                    case ODataCDSLOptions.traceParsingOfElements: {
                        csdlOptionsBitmap |= CSDLOption.traceParsingOfElements;
                        break;
                    }
                    case ODataCDSLOptions.warnAboutUndefinedTerms: {
                        csdlOptionsBitmap |= CSDLOption.warnAboutUndefinedTerms;
                        break;
                    }
                    case ODataCDSLOptions.warnIfProviderIncompatible: {
                        csdlOptionsBitmap |= CSDLOption.warnIfProviderIncompatible;
                        break;
                    }
                    default: {
                        SharedLoggerManager_1.SharedLoggerManager.pluginError(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_UNSUPPORTED_CSDL_OPTIONS, optString_1));
                        break;
                    }
                }
            });
        }
        provider.getServiceOptions().setCsdlOptions(csdlOptionsBitmap);
        SharedLoggerManager_1.SharedLoggerManager.pluginDebug(ErrorMessage_1.ErrorMessage.ODATA_CSDL_OPTIONS_VALUE_AFTER_SET + csdlOptionsBitmap);
        return provider;
    };
    ODataServiceProvider._wakeLock = null;
    ODataServiceProvider.serviceTimeZoneAbbreviation = 'UTC';
    ODataServiceProvider.extraStreamParameters = '__transaction_merge;__create_delete_merge;';
    ODataServiceProvider.prevUser = '';
    return ODataServiceProvider;
}());
exports.ODataServiceProvider = ODataServiceProvider;
var ODataServiceOptions;
(function (ODataServiceOptions) {
    ODataServiceOptions["avoidInPaths"] = "avoidInPaths";
    ODataServiceOptions["cacheMetadata"] = "cacheMetadata";
    ODataServiceOptions["checkQueries"] = "checkQueries";
    ODataServiceOptions["checkResults"] = "checkResults";
    ODataServiceOptions["checkVersion"] = "checkVersion";
    ODataServiceOptions["clientID"] = "clientID";
    ODataServiceOptions["createReturnsContent"] = "createReturnsContent";
    ODataServiceOptions["dataFormat"] = "dataFormat";
    ODataServiceOptions["dataVersion"] = "dataVersion";
    ODataServiceOptions["databaseOnly"] = "databaseOnly";
    ODataServiceOptions["fixMissingEmptyLists"] = "fixMissingEmptyLists";
    ODataServiceOptions["fixMissingNullValues"] = "fixMissingNullValues";
    ODataServiceOptions["logErrors"] = "logErrors";
    ODataServiceOptions["logWarnings"] = "logWarnings";
    ODataServiceOptions["metadataFile"] = "metadataFile";
    ODataServiceOptions["metadataText"] = "metadataText";
    ODataServiceOptions["metadataURL"] = "metadataURL";
    ODataServiceOptions["pingAccept"] = "pingAccept";
    ODataServiceOptions["pingMethod"] = "pingMethod";
    ODataServiceOptions["pingResource"] = "pingResource";
    ODataServiceOptions["requiresToken"] = "requiresToken";
    ODataServiceOptions["requiresType"] = "requiresType";
    ODataServiceOptions["supportsAlias"] = "supportsAlias";
    ODataServiceOptions["supportsBatch"] = "supportsBatch";
    ODataServiceOptions["supportsBind"] = "supportsBind";
    ODataServiceOptions["supportsDelta"] = "supportsDelta";
    ODataServiceOptions["supportsNext"] = "supportsNext";
    ODataServiceOptions["supportsPatch"] = "supportsPatch";
    ODataServiceOptions["supportsUnbind"] = "supportsUnbind";
    ODataServiceOptions["updateReturnsContent"] = "updateReturnsContent";
})(ODataServiceOptions || (ODataServiceOptions = {}));
var ODataCDSLOptions;
(function (ODataCDSLOptions) {
    ODataCDSLOptions["allowCaseConflicts"] = "allowCaseConflicts";
    ODataCDSLOptions["defaultVariableScale"] = "defaultVariableScale";
    ODataCDSLOptions["defaultVariableSrid"] = "defaultVariableSrid";
    ODataCDSLOptions["disableFacetWarnings"] = "disableFacetWarnings";
    ODataCDSLOptions["disableLoggingOfErrors"] = "disableLoggingOfErrors";
    ODataCDSLOptions["disableLoggingOfWarnings"] = "disableLoggingOfWarnings";
    ODataCDSLOptions["disableNameValidation"] = "disableNameValidation";
    ODataCDSLOptions["excludeServerOnlyElements"] = "excludeServerOnlyElements";
    ODataCDSLOptions["failIfProviderIncompatible"] = "failIfProviderIncompatible";
    ODataCDSLOptions["ignoreAllAnnotations"] = "ignoreAllAnnotations";
    ODataCDSLOptions["ignoreAllReferences"] = "ignoreAllReferences";
    ODataCDSLOptions["ignoreEdmAnnotations"] = "ignoreEdmAnnotations";
    ODataCDSLOptions["ignoreExternalReferences"] = "ignoreExternalReferences";
    ODataCDSLOptions["ignoreInternalReferences"] = "ignoreInternalReferences";
    ODataCDSLOptions["ignoreStandardReferences"] = "ignoreStandardReferences";
    ODataCDSLOptions["ignoreUndefinedTerms"] = "ignoreUndefinedTerms";
    ODataCDSLOptions["ignoreXmlAnnotations"] = "ignoreXmlAnnotations";
    ODataCDSLOptions["logWithUnqualifiedFileNames"] = "logWithUnqualifiedFileNames";
    ODataCDSLOptions["processMixedVersions"] = "processMixedVersions";
    ODataCDSLOptions["resolveUndefinedTerms"] = "resolveUndefinedTerms";
    ODataCDSLOptions["retainOriginalText"] = "retainOriginalText";
    ODataCDSLOptions["retainResolvedText"] = "retainResolvedText";
    ODataCDSLOptions["strictFacetWarnings"] = "strictFacetWarnings";
    ODataCDSLOptions["traceParsingOfElements"] = "traceParsingOfElements";
    ODataCDSLOptions["warnAboutUndefinedTerms"] = "warnAboutUndefinedTerms";
    ODataCDSLOptions["warnIfProviderIncompatible"] = "warnIfProviderIncompatible";
})(ODataCDSLOptions || (ODataCDSLOptions = {}));
var CSDLOption;
(function (CSDLOption) {
    CSDLOption[CSDLOption["processMixedVersions"] = 1] = "processMixedVersions";
    CSDLOption[CSDLOption["retainOriginalText"] = 2] = "retainOriginalText";
    CSDLOption[CSDLOption["retainResolvedText"] = 4] = "retainResolvedText";
    CSDLOption[CSDLOption["ignoreExternalReferences"] = 8] = "ignoreExternalReferences";
    CSDLOption[CSDLOption["ignoreInternalReferences"] = 16] = "ignoreInternalReferences";
    CSDLOption[CSDLOption["ignoreStandardReferences"] = 32] = "ignoreStandardReferences";
    CSDLOption[CSDLOption["ignoreAllReferences"] = 56] = "ignoreAllReferences";
    CSDLOption[CSDLOption["ignoreEdmAnnotations"] = 64] = "ignoreEdmAnnotations";
    CSDLOption[CSDLOption["ignoreXmlAnnotations"] = 128] = "ignoreXmlAnnotations";
    CSDLOption[CSDLOption["ignoreAllAnnotations"] = 192] = "ignoreAllAnnotations";
    CSDLOption[CSDLOption["ignoreUndefinedTerms"] = 256] = "ignoreUndefinedTerms";
    CSDLOption[CSDLOption["resolveUndefinedTerms"] = 512] = "resolveUndefinedTerms";
    CSDLOption[CSDLOption["warnAboutUndefinedTerms"] = 1024] = "warnAboutUndefinedTerms";
    CSDLOption[CSDLOption["traceParsingOfElements"] = 2048] = "traceParsingOfElements";
    CSDLOption[CSDLOption["disableNameValidation"] = 4096] = "disableNameValidation";
    CSDLOption[CSDLOption["allowCaseConflicts"] = 8192] = "allowCaseConflicts";
    CSDLOption[CSDLOption["defaultVariableScale"] = 32768] = "defaultVariableScale";
    CSDLOption[CSDLOption["defaultVariableSrid"] = 65536] = "defaultVariableSrid";
    CSDLOption[CSDLOption["disableFacetWarnings"] = 131072] = "disableFacetWarnings";
    CSDLOption[CSDLOption["strictFacetWarnings"] = 262144] = "strictFacetWarnings";
    CSDLOption[CSDLOption["disableLoggingOfErrors"] = 524288] = "disableLoggingOfErrors";
    CSDLOption[CSDLOption["disableLoggingOfWarnings"] = 1048576] = "disableLoggingOfWarnings";
    CSDLOption[CSDLOption["failIfProviderIncompatible"] = 2097152] = "failIfProviderIncompatible";
    CSDLOption[CSDLOption["warnIfProviderIncompatible"] = 4194304] = "warnIfProviderIncompatible";
    CSDLOption[CSDLOption["logWithUnqualifiedFileNames"] = 8388608] = "logWithUnqualifiedFileNames";
    CSDLOption[CSDLOption["excludeServerOnlyElements"] = 16777216] = "excludeServerOnlyElements";
})(CSDLOption || (CSDLOption = {}));
