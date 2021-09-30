"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataConverter_1 = require("./ODataConverter");
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var SharedLoggerManager_1 = require("../Foundation/Common/SharedLogger/SharedLoggerManager");
var oDataPkg = com.sap.cloud.mobile.odata;
var TransactionID = oDataPkg.offline.OfflineODataRequestOptions.TransactionID;
var UploadCategory = oDataPkg.offline.OfflineODataRequestOptions.UploadCategory;
var GlobalDateTime = oDataPkg.GlobalDateTime;
var ODataHelper = (function () {
    function ODataHelper() {
    }
    ODataHelper.createEntityValueList = function () {
        return new oDataPkg.EntityValueList();
    };
    ODataHelper.entityValueListToJson = function (entityValueList, dataContext, isErrorArchive) {
        var bindOptions = oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS;
        if (!isErrorArchive) {
            bindOptions |= oDataPkg.DataContext.FULL_METADATA;
        }
        dataContext.setBindOptions(bindOptions);
        dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
        return oDataPkg.json.JsonValue.fromEntityList(entityValueList, dataContext).toString();
    };
    ODataHelper.complexValueListToJson = function (complexList, dataContext) {
        var bindOptions = oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
            oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS;
        dataContext.setBindOptions(bindOptions);
        dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
        return oDataPkg.json.JsonValue.fromComplexList(complexList, dataContext).toString();
    };
    ODataHelper.dataValueToJson = function (dataValue, dataContext) {
        dataContext.setBindOptions(oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
            oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS);
        dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
        return oDataPkg.json.JsonValue.fromDataValue(dataValue, dataContext).toString();
    };
    ODataHelper.dataListValueToJson = function (dataListValue, dataContext) {
        var bindOptions = oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
            oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS;
        dataContext.setBindOptions(bindOptions);
        dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
        return oDataPkg.json.JsonValue.fromBasicList(dataListValue, dataContext).toString();
    };
    ODataHelper.createEntityValue = function (entityType) {
        return oDataPkg.EntityValue.ofType(entityType);
    };
    ODataHelper.entityValueToJson = function (entityValue, dataContext) {
        dataContext.setBindOptions(oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
            oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS);
        dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
        return oDataPkg.json.JsonValue.fromEntityValue(entityValue, dataContext).toString();
    };
    ODataHelper.setEntityValueProperties = function (entityValue, dataService, properties) {
        var converter = new ODataConverter_1.ODataConverter(dataService);
        for (var key in properties) {
            if (key) {
                var prop = entityValue.getEntityType().getProperty(key);
                entityValue.setDataValue(prop, converter.convert(key, properties[key], prop.getDataType().getCode(), prop.getDataType().getName()));
            }
        }
    };
    ODataHelper.isEntityValueKnownToBackend = function (entityValue) {
        return entityValue.getReadLink() != null && entityValue.getReadLink().indexOf('lodata_sys_eid') === -1;
    };
    ODataHelper.entityWithReadLink = function (changeSet, readLink) {
        for (var i = 0; i < changeSet.size(); i++) {
            if (changeSet.isEntity(i)) {
                var entity = changeSet.getEntity(i);
                if (entity.getReadLink() === readLink) {
                    return entity;
                }
            }
        }
        return null;
    };
    ODataHelper.complexValueToJson = function (complexValue, dataContext) {
        dataContext.setBindOptions(oDataPkg.DataContext.SEND_TO_CLIENT | oDataPkg.DataContext.FULL_METADATA |
            oDataPkg.DataContext.SAP_ENTITY_STATE_ANNOTATIONS);
        dataContext.setVersionCode(oDataPkg.DataVersion.ODATA_V4);
        return oDataPkg.json.JsonValue.fromComplexValue(complexValue, dataContext).toString();
    };
    ODataHelper.partnerPropertyFromEntity = function (property, entity) {
        var odataAssociationPartnerPropName = property.getPartnerPath();
        if (odataAssociationPartnerPropName == null) {
            return null;
        }
        var entityType = entity.getEntityType();
        if (entityType.getPropertyMap().get(odataAssociationPartnerPropName)) {
            return entity.getEntityType().getProperty(odataAssociationPartnerPropName);
        }
        else {
            return null;
        }
    };
    ODataHelper.createHttpHeaders = function () {
        return new oDataPkg.http.HttpHeaders();
    };
    ODataHelper.createDataContext = function (dataService) {
        return new oDataPkg.DataContext(dataService);
    };
    ODataHelper.createDataQuery = function () {
        return new oDataPkg.DataQuery();
    };
    ODataHelper.createChangeSet = function () {
        return new oDataPkg.ChangeSet();
    };
    ODataHelper.createRequestBatch = function () {
        return new oDataPkg.RequestBatch();
    };
    ODataHelper.isOnlineProvider = function (dataService) {
        return (dataService.getProvider() instanceof oDataPkg.OnlineODataProvider);
    };
    ODataHelper.getRequestOptions = function (requestOptions, dataService) {
        SharedLoggerManager_1.SharedLoggerManager.pluginDebug('!!!RequestOptions!!!');
        if (!requestOptions) {
            return oDataPkg.RequestOptions.none;
        }
        var requestOptionsLog = {};
        var logKey;
        var options;
        var isOnline = this.isOnlineProvider(dataService);
        if (isOnline) {
            options = new oDataPkg.RequestOptions();
        }
        else {
            options = new oDataPkg.offline.OfflineODataRequestOptions();
        }
        if (requestOptions.UpdateMode) {
            logKey = 'updateMode';
            if (requestOptions.UpdateMode.toLocaleLowerCase() === 'replace') {
                options.setUpdateMode(oDataPkg.UpdateMode.REPLACE);
                requestOptionsLog[logKey] = 'Replace';
            }
        }
        logKey = 'preferNoContent';
        if (requestOptions.PreferNoContent === true) {
            options.setPreferNoContent(true);
            requestOptionsLog[logKey] = true;
        }
        else if (requestOptions.PreferNoContent === false) {
            options.setPreferNoContent(false);
            requestOptionsLog[logKey] = false;
        }
        logKey = 'sendEmptyUpdate';
        if (requestOptions.SendEmptyUpdate === true) {
            options.setSendEmptyUpdate(true);
            requestOptionsLog[logKey] = true;
        }
        else if (requestOptions.SendEmptyUpdate === false) {
            options.setSendEmptyUpdate(false);
            requestOptionsLog[logKey] = false;
        }
        if (!isOnline) {
            if (requestOptions.CustomHeaderFormatTemplate) {
                logKey = 'customHeaderFormatTemplate';
                options.setCustomHeaderFormatTemplate(requestOptions.CustomHeaderFormatTemplate);
                requestOptionsLog[logKey] = requestOptions.CustomHeaderFormatTemplate;
            }
            logKey = 'removeCreatedEntityAfterUpload';
            if (requestOptions.RemoveCreatedEntityAfterUpload === true) {
                options.setRemoveCreatedEntityAfterUpload(true);
                requestOptionsLog[logKey] = true;
            }
            else if (requestOptions.RemoveCreatedEntityAfterUpload === false) {
                options.setRemoveCreatedEntityAfterUpload(false);
                requestOptionsLog[logKey] = false;
            }
            logKey = 'unmodifiableRequest';
            if (requestOptions.UnmodifiableRequest === true) {
                options.setUnmodifiableRequest(true);
                requestOptionsLog[logKey] = true;
            }
            else if (requestOptions.UnmodifiableRequest === false) {
                options.setUnmodifiableRequest(false);
                requestOptionsLog[logKey] = false;
            }
            if (requestOptions.UploadCategory) {
                logKey = 'uploadCategory';
                if (requestOptions.UploadCategory.toLocaleLowerCase() === 'usegeneratedid') {
                    options.setUploadCategory(UploadCategory.useGeneratedIDForUploadCategory);
                    requestOptionsLog[logKey] = 'UseGeneratedID';
                }
                else {
                    options.setUploadCategory(new UploadCategory(requestOptions.UploadCategory));
                    requestOptionsLog[logKey] = requestOptions.UploadCategory;
                }
            }
            if (requestOptions.TransactionID) {
                logKey = 'transactionID';
                if (requestOptions.TransactionID.toLocaleLowerCase() === 'usegeneratedid') {
                    options.setTransactionID(TransactionID.UseGeneratedIDForTransactionID);
                    requestOptionsLog[logKey] = 'UseGeneratedID';
                }
                else {
                    options.setTransactionID(new TransactionID(requestOptions.TransactionID));
                    requestOptionsLog[logKey] = requestOptions.TransactionID;
                }
            }
        }
        SharedLoggerManager_1.SharedLoggerManager.pluginDebug(JSON.stringify(requestOptionsLog));
        return options;
    };
    ODataHelper.getHttpHeaders = function (headers) {
        SharedLoggerManager_1.SharedLoggerManager.pluginDebug('!!!HttpHeaders!!!');
        if (!headers) {
            return oDataPkg.http.HttpHeaders.empty;
        }
        var httpHeader = this.createHttpHeaders();
        for (var key in headers) {
            if (key) {
                if (headers[key].indexOf('\r') !== -1 || headers[key].indexOf('\n') !== -1) {
                    throw new Error(ErrorMessage_1.ErrorMessage.ODATA_INVALID_CHARS_IN_HTTP_HEADERS);
                }
                httpHeader.set(key, headers[key]);
            }
        }
        SharedLoggerManager_1.SharedLoggerManager.pluginDebug(JSON.stringify(headers));
        return httpHeader;
    };
    ODataHelper.createAction0 = function (args) {
        return new oDataPkg.core.Action0(args);
    };
    ODataHelper.createAction1 = function (args) {
        return new oDataPkg.core.Action1(args);
    };
    return ODataHelper;
}());
exports.ODataHelper = ODataHelper;
