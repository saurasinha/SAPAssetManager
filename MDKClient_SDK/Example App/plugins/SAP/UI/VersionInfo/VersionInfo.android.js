"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("tns-core-modules/application");
var foundationPkg = com.sap.mdk.client.foundation;
var VersionInfo = (function () {
    function VersionInfo() {
    }
    VersionInfo.getVersionInfo = function () {
        var info = foundationPkg.VersionInfoBridge.getVersionInfo(application.android.context);
        var json = JSON.parse(info);
        var result = new Object();
        var mergeResult = new Object();
        var item;
        var key;
        for (var i = 0; i < json.Root.length; i++) {
            item = json.Root[i];
            key = Object.keys(item);
            result[key] = item[key];
            mergeResult = Object.assign(mergeResult, result);
        }
        return mergeResult;
    };
    VersionInfo.setVersionInfo = function (buildVersion) {
        foundationPkg.VersionInfoBridge.setDefinitionVersionInfo(application.android.context, buildVersion);
    };
    return VersionInfo;
}());
exports.VersionInfo = VersionInfo;
