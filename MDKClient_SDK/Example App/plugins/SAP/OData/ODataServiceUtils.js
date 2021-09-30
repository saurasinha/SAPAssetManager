"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceUtils = (function () {
    function ODataServiceUtils() {
    }
    ODataServiceUtils.getServiceName = function (serviceUrl) {
        return undefined;
    };
    ODataServiceUtils.hasPathSuffix = function (serviceUrl) {
        return false;
    };
    ODataServiceUtils.convert = function (name, value, type) {
        return undefined;
    };
    ODataServiceUtils.base64StringToBinary = function (value) {
        return new Promise(function (resolve, reject) { return resolve(''); });
    };
    return ODataServiceUtils;
}());
exports.ODataServiceUtils = ODataServiceUtils;
