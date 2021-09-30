"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var HttpHeadersUtil = (function () {
    function HttpHeadersUtil() {
    }
    HttpHeadersUtil.convertHeaders = function (headers) {
        var keyType;
        Object.keys(headers).forEach(function (headerKey) {
            keyType = typeof headers[headerKey];
            if (keyType === 'undefined') {
                headers[headerKey] = 'undefined';
            }
            else if (keyType === 'object') {
                headers[headerKey] = HttpHeadersUtil.convertHeadersPropertiesToString(headers[headerKey]);
            }
            else {
                headers[headerKey] = String(headers[headerKey]);
            }
        });
        return headers;
    };
    HttpHeadersUtil.convertHeadersPropertiesToString = function (headerProperties) {
        var header = '';
        Object.keys(headerProperties).forEach(function (key) {
            var value = '' + headerProperties[key];
            if (!value.length) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.MISSING_HEADER_VALUE_FOR_KEY, key));
            }
            if (value[0] === '<' && value[value.length - 1] === '>') {
                header = "" + header + key + "=" + value + ",";
            }
            else {
                header = "" + header + key + "=\"" + value + "\",";
            }
        });
        return header.replace(/,$/, '');
    };
    return HttpHeadersUtil;
}());
exports.HttpHeadersUtil = HttpHeadersUtil;
;
