"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataConverter_1 = require("../Common/DataConverter");
var OAuthRequestor = (function () {
    function OAuthRequestor() {
        this._bridge = null;
    }
    OAuthRequestor.getInstance = function () {
        if (!OAuthRequestor._instance) {
            OAuthRequestor._instance = new OAuthRequestor();
        }
        return OAuthRequestor._instance;
    };
    OAuthRequestor.prototype.initialize = function (params) {
        var javaParams = DataConverter_1.DataConverter.toJavaObject(params);
    };
    OAuthRequestor.prototype.updateConnectionParams = function (params) {
        var javaParams = DataConverter_1.DataConverter.toJavaObject(params);
    };
    OAuthRequestor.prototype.sendRequest = function (url) {
        return Promise.resolve();
    };
    return OAuthRequestor;
}());
exports.OAuthRequestor = OAuthRequestor;
;
