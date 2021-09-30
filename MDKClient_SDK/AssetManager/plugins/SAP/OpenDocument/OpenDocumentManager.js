"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OpenDocument = (function () {
    function OpenDocument() {
    }
    OpenDocument.getInstance = function () {
        return null;
    };
    OpenDocument.prototype.openWithPath = function (pressedControlView, path) {
        return new Promise(function (resolve, reject) { return reject('stub'); });
    };
    OpenDocument.prototype.clearCache = function () {
        return;
    };
    return OpenDocument;
}());
exports.OpenDocument = OpenDocument;
;
