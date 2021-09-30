"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Zip = (function () {
    function Zip() {
    }
    Zip.unzip = function (source, destination) {
        return SSZipArchive.unzipFileAtPathToDestination(source, destination);
    };
    return Zip;
}());
exports.Zip = Zip;
