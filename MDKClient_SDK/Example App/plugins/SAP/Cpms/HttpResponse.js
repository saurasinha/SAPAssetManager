"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpResponse = (function () {
    function HttpResponse() {
    }
    HttpResponse.getHeaders = function (responseAndData) {
    };
    HttpResponse.getMimeType = function (responseAndData) {
        return '';
    };
    HttpResponse.getStatusCode = function (responseAndData) {
        return 0;
    };
    HttpResponse.getData = function (responseAndData) {
    };
    HttpResponse.toFile = function (responseAndData, url, destinationFilePath) {
    };
    HttpResponse.toImage = function (responseAndData) {
    };
    HttpResponse.toString = function (responseAndData, encoding) {
        return '';
    };
    return HttpResponse;
}());
exports.HttpResponse = HttpResponse;
;
