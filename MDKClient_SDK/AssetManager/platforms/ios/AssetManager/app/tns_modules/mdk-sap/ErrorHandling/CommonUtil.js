"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var CommonUtil = (function () {
    function CommonUtil() {
    }
    CommonUtil.toJSError = function (code, message, error) {
        if (app.ios) {
            if (error && error instanceof NSError) {
                var jsError = new Error(error.userInfo.valueForKey('message') ? error.userInfo.valueForKey('message') : message);
                return CommonUtil.formatJSError(jsError);
            }
            else {
                return new Error(message);
            }
        }
        else {
            if (error && error instanceof java.lang.Exception) {
                return new Error(error.getMessage());
            }
            else {
                return new Error(message);
            }
        }
    };
    CommonUtil.formatJSError = function (jsError) {
        if (jsError.message && jsError.message.indexOf('Error ') >= 0) {
            var idx = jsError.message.indexOf('Error ');
            var errCode = parseInt(jsError.message.slice(idx + 6, idx + 9), 10);
            if (errCode > 0) {
                jsError['responseCode'] = errCode;
                var idx1 = jsError.message.indexOf('{');
                var idx2 = jsError.message.lastIndexOf('}');
                if (idx2 > idx1) {
                    jsError['responseBody'] = jsError.message.slice(idx1, idx2 + 1);
                }
                else {
                    idx1 = jsError.message.indexOf('<message');
                    idx2 = jsError.message.indexOf('</message>');
                    if (idx2 > idx1) {
                        var rawMessage = jsError.message.slice(idx1, idx2 + 10);
                        idx1 = rawMessage.indexOf('>');
                        idx2 = rawMessage.indexOf('</');
                        jsError['responseBody'] = 'message: ' + rawMessage.slice(idx1 + 1, idx2);
                    }
                    else {
                        jsError['responseBody'] = jsError.message;
                    }
                }
            }
        }
        return jsError;
    };
    CommonUtil.formatOfflineError = function (jsError) {
        if (jsError.message) {
            var errCode = void 0;
            var idx = jsError.message.indexOf('HTTP code, ');
            if (idx > 0) {
                errCode = parseInt(jsError.message.slice(idx + 11, idx + 14), 10);
            }
            if (errCode > 0 || jsError.message.indexOf('SERVER_SYNCHRONIZATION_ERROR') > 0) {
                jsError['responseCode'] = errCode > 0 ? errCode : 500;
                jsError['responseBody'] = jsError.message;
            }
        }
        return jsError;
    };
    return CommonUtil;
}());
exports.CommonUtil = CommonUtil;
;
