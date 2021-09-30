"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceProvider = (function () {
    function ODataServiceProvider() {
    }
    ODataServiceProvider.getServiceTimeZoneAbbreviation = function () {
        return '';
    };
    ODataServiceProvider.clear = function (context, name) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ODataServiceProvider.prototype.download = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.initOfflineStore = function (context, params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.upload = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.close = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.clear = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.create = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.open = function (context, params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.read = function (entitySet, properties, queryString, headers, requestOptions, pageSize) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.createEntity = function (odataCreator) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.updateEntity = function (odataUpdater) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.deleteEntity = function (odataDeleter) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.deleteMediaEntity = function (entitySetName, queryString, readLink, headers, requestOptions) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.createMediaEntity = function (entitySetName, properties, headers, requestOptions, media) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.createRelatedMediaEntity = function (entitySetName, properties, parent, headers, requestOptions, media) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.downloadMedia = function (entitySet, queryString, readLink, headers, requestOptions) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.isMediaLocal = function (entitySet, readLink) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.beginChangeSet = function () {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.cancelChangeSet = function () {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.commitChangeSet = function () {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.count = function (entitySet, properties, queryString) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.callFunction = function (functionName, functionParameters, functionOptions) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.getPropertyType = function (params) {
        return '';
    };
    ;
    ODataServiceProvider.prototype.getVersion = function (params) {
        return 0;
    };
    ;
    ODataServiceProvider.prototype.getOfflineStoreStatus = function () {
        return '';
    };
    ;
    ODataServiceProvider.prototype.downloadStream = function (entitySetName, properties, query, readLink, headers, requestOptions) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.uploadStream = function (entitySetName, properties, query, readLink, headers, requestOptions) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ;
    ODataServiceProvider.prototype.undoPendingChanges = function (entitySetName, queryOptions, readLink) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    ODataServiceProvider.prototype.getOfflineParameter = function (name) {
        return null;
    };
    ;
    ODataServiceProvider.prototype.setOfflineParameter = function (name, value) {
    };
    ;
    ODataServiceProvider.prototype.getPreviousUser = function () {
        return '';
    };
    return ODataServiceProvider;
}());
exports.ODataServiceProvider = ODataServiceProvider;
