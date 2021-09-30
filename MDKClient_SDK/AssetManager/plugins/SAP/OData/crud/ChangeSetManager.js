"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var ODataHelper_1 = require("../ODataHelper");
var ChangeSetManager = (function () {
    function ChangeSetManager(dataService) {
        this.service = dataService;
        this.pendingEntityReadLinkOrdinalSuffix = 0;
        this.pendingChangeSet = null;
    }
    ChangeSetManager.isPending = function (entity) {
        var readLink = entity.getReadLink();
        return readLink == null || readLink.startsWith(ChangeSetManager.UNPROCESSEDPREFIX);
    };
    ChangeSetManager.prototype.beginChangeSet = function () {
        if (this.pendingChangeSet != null) {
            throw new Error(ErrorMessage_1.ErrorMessage.ODATA_CHANGESET_ALREADY_EXISTS);
        }
        this.pendingChangeSet = ODataHelper_1.ODataHelper.createChangeSet();
        this.pendingEntityReadLinkOrdinalSuffix = 0;
    };
    ChangeSetManager.prototype.cancelChangeSet = function () {
        this.pendingChangeSet = null;
        this.pendingEntityReadLinkOrdinalSuffix = 0;
    };
    ChangeSetManager.prototype.commitChangeSet = function () {
        var changeSet = this.pendingChangeSet;
        if (changeSet == null) {
            throw new Error(ErrorMessage_1.ErrorMessage.ODATA_COMMIT_EMPTY_CHANGESET_NOT_ALLOWED);
        }
        this.pendingChangeSet = null;
        this.pendingEntityReadLinkOrdinalSuffix = 0;
        return this.processBatchWithChangeSet(changeSet).then(function () {
            var error = changeSet.getError();
            if (error !== null) {
                throw error;
            }
        });
    };
    ChangeSetManager.prototype.createEntity = function (entity, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var changeSet = _this.pendingChangeSet;
            if (changeSet != null) {
                _this.pendingEntityReadLinkOrdinalSuffix += 1;
                entity.setReadLink(ChangeSetManager.UNPROCESSEDPREFIX + _this.pendingEntityReadLinkOrdinalSuffix);
                changeSet.createEntity(entity, headers, requestOptions);
                return resolve();
            }
            else {
                _this.service.createEntityAsync(entity, ODataHelper_1.ODataHelper.createAction0({
                    call: function () { return resolve(); },
                }), ODataHelper_1.ODataHelper.createAction1({
                    call: function (error) { return reject(error); },
                }), headers, requestOptions);
            }
        });
    };
    ChangeSetManager.prototype.createRelatedEntity = function (entity, parentEntity, parentNavProp, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var changeSet = _this.pendingChangeSet;
            if (changeSet != null) {
                _this.pendingEntityReadLinkOrdinalSuffix += 1;
                entity.setReadLink(ChangeSetManager.UNPROCESSEDPREFIX + _this.pendingEntityReadLinkOrdinalSuffix);
                changeSet.createRelatedEntity(entity, parentEntity, parentNavProp, headers, requestOptions);
                return resolve();
            }
            else {
                return _this.service.createRelatedEntityAsync(entity, parentEntity, parentNavProp, ODataHelper_1.ODataHelper.createAction0({
                    call: function () { return resolve(); },
                }), ODataHelper_1.ODataHelper.createAction1({
                    call: function (error) { return reject(error); },
                }), headers, requestOptions);
            }
        });
    };
    ChangeSetManager.prototype.updateEntity = function (entity, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var changeSet = _this.pendingChangeSet;
            if (changeSet != null) {
                changeSet.updateEntity(entity, headers, requestOptions);
                return resolve();
            }
            else {
                return _this.service.updateEntityAsync(entity, ODataHelper_1.ODataHelper.createAction0({
                    call: function () { return resolve(); },
                }), ODataHelper_1.ODataHelper.createAction1({
                    call: function (error) { return reject(error); },
                }), headers, requestOptions);
            }
        });
    };
    ChangeSetManager.prototype.deleteEntity = function (entity, headers, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var changeSet = _this.pendingChangeSet;
            if (changeSet != null) {
                changeSet.deleteEntity(entity, headers, requestOptions);
                return resolve();
            }
            else {
                return _this.service.deleteEntityAsync(entity, ODataHelper_1.ODataHelper.createAction0({
                    call: function () { return resolve(); },
                }), ODataHelper_1.ODataHelper.createAction1({
                    call: function (error) { return reject(error); },
                }), headers, requestOptions);
            }
        });
    };
    ChangeSetManager.prototype.pendingEntityFromPendingChangeSet = function (readLink) {
        if (!readLink.startsWith(ChangeSetManager.UNPROCESSEDPREFIX)) {
            return null;
        }
        return ODataHelper_1.ODataHelper.entityWithReadLink(this.pendingChangeSet, readLink);
    };
    ChangeSetManager.prototype.processBatchWithChangeSet = function (changeSet) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var requestBatch = ODataHelper_1.ODataHelper.createRequestBatch();
            requestBatch.addChanges(changeSet);
            return _this.service.processBatchAsync(requestBatch, ODataHelper_1.ODataHelper.createAction0({
                call: function () {
                    resolve();
                },
            }), ODataHelper_1.ODataHelper.createAction1({
                call: function (error) { return reject(error); },
            }));
        });
    };
    ChangeSetManager.UNPROCESSEDPREFIX = 'pending_';
    return ChangeSetManager;
}());
exports.ChangeSetManager = ChangeSetManager;
