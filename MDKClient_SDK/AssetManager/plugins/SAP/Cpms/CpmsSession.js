"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CpmsSession = (function () {
    function CpmsSession() {
    }
    CpmsSession.getInstance = function () {
        return null;
    };
    CpmsSession.prototype.initialize = function (params) {
    };
    CpmsSession.prototype.updateConnectionParams = function (params) {
    };
    CpmsSession.prototype.sendRequest = function (url, params) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    return CpmsSession;
}());
exports.CpmsSession = CpmsSession;
;
