"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CommonUtil_1 = require("../ErrorHandling/CommonUtil");
var trace_1 = require("tns-core-modules/trace");
var OpenDocument = (function () {
    function OpenDocument() {
        this._openDocumentBridge = OpenDocumentBridge.new();
    }
    OpenDocument.getInstance = function () {
        return OpenDocument._instance;
    };
    OpenDocument.prototype.openWithPath = function (pressedItem, path) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return _this._openDocumentBridge.openDocumentResolveReject(path, function (result) {
                trace_1.write('open document succeeded', 'mdk.trace.core', trace_1.messageType.log);
                resolve(result);
            }, function (code, message, error) {
                trace_1.write("open document with path failed: " + message, 'mdk.trace.core', trace_1.messageType.error);
                reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
            });
        });
    };
    OpenDocument.prototype.clearCache = function () {
        this._openDocumentBridge.clearCache();
    };
    OpenDocument._instance = new OpenDocument();
    return OpenDocument;
}());
exports.OpenDocument = OpenDocument;
