"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("tns-core-modules/application");
var DataConverter_1 = require("../Common/DataConverter");
var CommonUtil_1 = require("../ErrorHandling/CommonUtil");
var trace_1 = require("tns-core-modules/trace");
var foundationPkg = com.sap.mdk.client.foundation;
var openDocumentPkg = com.sap.mdk.client.ui.opendocument;
var OpenDocument = (function () {
    function OpenDocument() {
        this._openDocumentBridge = null;
    }
    OpenDocument.getInstance = function () {
        return OpenDocument._instance;
    };
    OpenDocument.prototype.openWithPath = function (pressedItem, path) {
        var _this = this;
        if (this._openDocumentBridge === null) {
            this._openDocumentBridge =
                new openDocumentPkg.OpenDocumentBridge(application.android.foregroundActivity);
        }
        var params = DataConverter_1.DataConverter.toJavaObject({ uri: path });
        return new Promise(function (resolve, reject) {
            var successHandler = new foundationPkg.IPromiseCallback({
                onResolve: function (result) {
                    trace_1.write('open document succeeded', 'mdk.trace.core', trace_1.messageType.log);
                    resolve(result);
                },
            });
            var failureHandler = new foundationPkg.IPromiseCallback({
                onRejected: function (code, message, error) {
                    trace_1.write("open document with path failed: " + message, 'mdk.trace.core', trace_1.messageType.error);
                    reject(CommonUtil_1.CommonUtil.toJSError(code, message, error));
                },
            });
            return _this._openDocumentBridge.openDocument(params, successHandler, failureHandler);
        });
    };
    OpenDocument.prototype.clearCache = function () {
        if (this._openDocumentBridge === null) {
            this._openDocumentBridge =
                new openDocumentPkg.OpenDocumentBridge(application.android.foregroundActivity);
        }
        this._openDocumentBridge.clearCache();
        this._openDocumentBridge = null;
    };
    OpenDocument._instance = new OpenDocument();
    return OpenDocument;
}());
exports.OpenDocument = OpenDocument;
