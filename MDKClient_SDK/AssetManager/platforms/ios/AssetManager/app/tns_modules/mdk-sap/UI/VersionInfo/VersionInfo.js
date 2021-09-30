"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VersionInfo = (function () {
    function VersionInfo() {
    }
    VersionInfo.getVersionInfo = function () {
        var nsDict = JSON.parse(VersionInfoBridge.getVersionInfo());
        return nsDict;
    };
    VersionInfo.setVersionInfo = function (buildVersion) {
        VersionInfoBridge.setVersionInfo(buildVersion);
    };
    return VersionInfo;
}());
exports.VersionInfo = VersionInfo;
