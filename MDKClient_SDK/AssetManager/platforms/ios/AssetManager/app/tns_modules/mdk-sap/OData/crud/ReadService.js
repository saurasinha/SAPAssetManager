"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryOptionsReadParams_1 = require("./readparams/QueryOptionsReadParams");
var ReadLinkReadParams_1 = require("./readparams/ReadLinkReadParams");
var ODataHelper_1 = require("../ODataHelper");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var ReadService = (function () {
    function ReadService() {
    }
    ReadService.entityFromParams = function (readParams, dataService, changeSetManager) {
        if (readParams instanceof ReadLinkReadParams_1.ReadLinkReadParams) {
            return ReadService.entityFromReadLinkReadParams(readParams, dataService, changeSetManager);
        }
        else if (readParams instanceof QueryOptionsReadParams_1.QueryOptionsReadParams) {
            return ReadService.entityFromQueryOptions(dataService, readParams.getEntitySetName(), readParams.getQueryOptions());
        }
        else {
            return this.entityFromQueryOptions(dataService, readParams.getEntitySetName(), null);
        }
    };
    ReadService.entitiesFromParams = function (readParams, dataService, changeSetManager) {
        if (readParams instanceof ReadLinkReadParams_1.ReadLinkReadParams) {
            return ReadService.entitiesFromReadLinkReadParams(readParams, dataService, changeSetManager);
        }
        else if (readParams instanceof QueryOptionsReadParams_1.QueryOptionsReadParams) {
            return ReadService.entitiesFromQueryOptions(dataService, readParams.getEntitySetName(), readParams.getQueryOptions());
        }
        else {
            return this.entitiesFromQueryOptions(dataService, readParams.getEntitySetName(), null);
        }
    };
    ReadService.entityFromReadLinkReadParams = function (readLinkReadParams, dataService, changeSetManager) {
        if (readLinkReadParams.isTargetCreatedInSameChangeSet()) {
            var pendingEntity = changeSetManager.pendingEntityFromPendingChangeSet(readLinkReadParams.getReadLink());
            if (pendingEntity == null) {
                throw Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_ENTITY_READLINK_NOT_FOUND, readLinkReadParams.getReadLink()));
            }
            return pendingEntity;
        }
        else {
            var entitySet = dataService.getEntitySet(readLinkReadParams.getEntitySetName());
            var entityType = ODataHelper_1.ODataHelper.createEntityValue(entitySet.getEntityType());
            entityType.setEntitySet(entitySet);
            entityType.setReadLink(readLinkReadParams.getReadLink());
            this.loadEntity(dataService, entityType);
            return entityType;
        }
    };
    ReadService.loadEntity = function (dataService, entity) {
        if (dataService != null) {
            if (ODataHelper_1.ODataHelper.isOnlineProvider(dataService)) {
                var query = ODataHelper_1.ODataHelper.createDataQuery();
                query.setExpectSingle(true);
                dataService.loadEntity(entity, query);
            }
            else {
                dataService.loadEntity(entity);
            }
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.ODATA_UNKNOWN_DATASERVICE_TYPE);
        }
    };
    ReadService.entitiesFromReadLinkReadParams = function (readLinkReadParams, dataService, changeSetManager) {
        var entities = new Array(1);
        entities[0] = this.entityFromReadLinkReadParams(readLinkReadParams, dataService, changeSetManager);
        return entities;
    };
    ReadService.entityFromQueryOptions = function (dataService, entitySetName, queryOptions) {
        var entities = this.entitiesFromQueryOptions(dataService, entitySetName, queryOptions);
        if (entities.length !== 1) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_MORE_THAN_1_ENTITY_RETURNED, entities.length));
        }
        return entities[0];
    };
    ReadService.entitiesFromQueryOptions = function (dataService, entitySetName, queryOptions) {
        var entityList = this.getEntityValueList(dataService, entitySetName, queryOptions);
        var entities = new Array(entityList.length());
        for (var i = 0; i < entityList.length(); i++) {
            entities[i] = entityList.get(i);
        }
        return entities;
    };
    ReadService.getEntityValueList = function (dataService, entityName, queryOptions) {
        var query = this.createQuery(dataService, entityName, queryOptions);
        return dataService.executeQuery(query).getEntityList();
    };
    ReadService.createQuery = function (dataService, entitySetName, queryOptions) {
        var query = ODataHelper_1.ODataHelper.createDataQuery();
        if (queryOptions != null) {
            query.setUrl(entitySetName + '?' + queryOptions);
        }
        else {
            query.setUrl(entitySetName);
        }
        var entitySet = dataService.getEntitySet(entitySetName);
        query = query.from(entitySet);
        return query;
    };
    return ReadService;
}());
exports.ReadService = ReadService;
