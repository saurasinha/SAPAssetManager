"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OData = (function () {
    function OData() {
        this._onChangeset = false;
    }
    OData.prototype.isOnChangeSet = function () {
        return this._onChangeset;
    };
    OData.prototype.createService = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.openService = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.downloadMedia = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.isMediaLocal = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.downloadOfflineOData = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.initializeOfflineStore = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.closeOfflineStore = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.clearOfflineStore = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.uploadOfflineOData = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.cancelUploadOfflineOData = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.cancelDownloadOfflineOData = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.read = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.update = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.create = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.createRelated = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.delete = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.createMedia = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.createRelatedMedia = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.beginChangeSet = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.cancelChangeSet = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.commitChangeSet = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.deleteMedia = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.count = function (params) {
        return new Promise(function (resolve, reject) { return resolve(0); });
    };
    OData.prototype.callFunction = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.getPropertyType = function (params) {
        return '';
    };
    OData.prototype.getVersion = function (params) {
        return 0;
    };
    OData.prototype.getOfflineStoreStatus = function (params) {
        return '';
    };
    OData.prototype.downloadStream = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.uploadStream = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.undoPendingChanges = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.base64StringToBinary = function (params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    OData.prototype.getOfflineParameter = function (params) {
        return null;
    };
    OData.prototype.setOfflineParameter = function (params) {
    };
    OData.prototype.getPreviousUser = function () {
        return '';
    };
    return OData;
}());
exports.OData = OData;
;
