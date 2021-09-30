"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RestServiceUtil = (function () {
    function RestServiceUtil() {
    }
    RestServiceUtil.getAndroidFormData = function (body) {
        var builder = com.sap.mdk.client.foundation.CPmsSession.getInstance().getMultipartBodyBuilder();
        for (var i = 0; i < body.length; i++) {
            var part = body[i];
            if (typeof part['Value'] === 'object') {
                var attachment = part['Value'];
                if (attachment && attachment.urlString && attachment.content) {
                    var fileName = attachment.urlString.substring(attachment.urlString.lastIndexOf('/') + 1);
                    var mediaType = okhttp3.MediaType.parse(attachment.contentType);
                    var partBody = okhttp3.MultipartBody.create(mediaType, attachment.content);
                    builder.addFormDataPart(part['Key'], fileName, partBody);
                }
            }
            else {
                builder.addFormDataPart(part['Key'], part['Value']);
            }
        }
        return builder.build();
    };
    RestServiceUtil.getIOSFormData = function (boundry, body) {
        var params = Object.assign({}, body);
        return CpmsSessionSwift.sharedInstance.getFormDataWithBoundaryParams(boundry, params);
    };
    RestServiceUtil.isTextContent = function (contentType) {
        return !contentType ||
            contentType.indexOf('text/') === 0 ||
            contentType.indexOf('application/json') === 0 ||
            contentType.match('^application/(.*)xml');
    };
    return RestServiceUtil;
}());
exports.RestServiceUtil = RestServiceUtil;
