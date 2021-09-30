"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Zip = (function () {
    function Zip() {
    }
    Zip.unzip = function (source, destination) {
        var zipFile = new net.lingala.zip4j.core.ZipFile(source);
        zipFile.extractAll(destination);
    };
    return Zip;
}());
exports.Zip = Zip;
