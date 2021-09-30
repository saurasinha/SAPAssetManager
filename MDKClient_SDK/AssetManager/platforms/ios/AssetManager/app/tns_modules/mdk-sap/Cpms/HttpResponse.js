"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var http = require("tns-core-modules/http");
var DataConverter_1 = require("../Common/DataConverter");
var HttpResponse = (function () {
    function HttpResponse() {
    }
    HttpResponse.getHeaders = function (responseAndData) {
        return DataConverter_1.DataConverter.fromNSDictToJavascriptObject(responseAndData.valueForKey('headers'));
    };
    HttpResponse.getMimeType = function (responseAndData) {
        var response = responseAndData.valueForKey('response');
        return response.MIMEType;
    };
    HttpResponse.getStatusCode = function (responseAndData) {
        var response = responseAndData.valueForKey('response');
        return response.statusCode;
    };
    HttpResponse.getData = function (responseAndData) {
        return responseAndData.valueForKey('data');
    };
    HttpResponse.toFile = function (responseAndData, url, destinationFilePath) {
        var fs = require('tns-core-modules/file-system');
        var fileName = url;
        if (!destinationFilePath) {
            destinationFilePath = fs.path.join(fs.knownFolders.documents().path, fileName.substring(fileName.lastIndexOf('/') + 1));
        }
        var data = responseAndData.valueForKey('data');
        if (data instanceof NSData) {
            data.writeToFileAtomically(destinationFilePath, true);
            return fs.File.fromPath(destinationFilePath);
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.FILE_SAVE_FAILED, destinationFilePath));
        }
    };
    HttpResponse.toImage = function (responseAndData) {
        var data = responseAndData.valueForKey('data');
        if (data instanceof NSData) {
            var uiImage = UIImage.imageWithData(data);
            return uiImage;
        }
    };
    HttpResponse.toString = function (responseAndData, encoding) {
        var data = responseAndData.valueForKey('data');
        return NSDataToString(data, encoding);
    };
    return HttpResponse;
}());
exports.HttpResponse = HttpResponse;
;
function NSDataToString(data, encoding) {
    var code = 4;
    if (encoding === http.HttpResponseEncoding.GBK) {
        code = 1586;
    }
    return NSString.alloc().initWithDataEncoding(data, code).toString();
}
