"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var trace_1 = require("tns-core-modules/trace");
var DataConverter_1 = require("../Common/DataConverter");
var RestServiceUtil_1 = require("../RestService/RestServiceUtil");
var HttpResponse = (function () {
    function HttpResponse() {
    }
    HttpResponse.getHeaders = function (responseAndData) {
        return DataConverter_1.DataConverter.toJavaScriptObject(responseAndData.headers());
    };
    HttpResponse.getMimeType = function (responseAndData) {
        return responseAndData.contentType();
    };
    HttpResponse.getStatusCode = function (responseAndData) {
        return parseInt(responseAndData.statusCode(), 10);
    };
    HttpResponse.getData = function (responseAndData) {
        var contentType = responseAndData.contentType();
        if (RestServiceUtil_1.RestServiceUtil.isTextContent(contentType)) {
            return responseAndData.getString();
        }
        else {
            return responseAndData.getBytes();
        }
    };
    HttpResponse.toFile = function (responseAndData, url, destinationFilePath) {
        var fs = require('tns-core-modules/file-system');
        var fileName = url;
        if (!destinationFilePath) {
            destinationFilePath = fs.path.join(fs.knownFolders.documents().path, fileName.substring(fileName.lastIndexOf('/') + 1));
        }
        var file = fs.File.fromPath(destinationFilePath);
        try {
            var bytes = responseAndData.getBytes();
            file.writeSync(bytes, function (err) {
                trace_1.write(err, 'mdk.trace.core', trace_1.messageType.error);
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.FILE_SAVE_FAILED, destinationFilePath));
            });
        }
        catch (err) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.FILE_SAVE_FAILED, destinationFilePath));
        }
        return file;
    };
    HttpResponse.toImage = function (responseAndData) {
        var bytes = responseAndData.getBytes();
        var imageBitmap = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
        return imageBitmap;
    };
    HttpResponse.toString = function (responseAndData) {
        return responseAndData.getString();
    };
    return HttpResponse;
}());
exports.HttpResponse = HttpResponse;
;
