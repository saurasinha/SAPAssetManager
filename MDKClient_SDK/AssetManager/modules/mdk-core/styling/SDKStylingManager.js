"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mdk_sap_1 = require("mdk-sap");
var fs = require("tns-core-modules/file-system");
var SDKStylingManager = (function () {
    function SDKStylingManager() {
    }
    SDKStylingManager.saveSDKStyleFile = function (styleFileContent, styleFileName) {
        if (styleFileName === void 0) { styleFileName = SDKStylingManager.STYLE_FILE_NAME; }
        if (styleFileContent) {
            var tmpFile = fs.File.fromPath(fs.path.join(fs.knownFolders.temp().path, styleFileName));
            return tmpFile.writeText(styleFileContent);
        }
        else {
            return Promise.resolve();
        }
    };
    SDKStylingManager.applySDKStyle = function (styleFileName) {
        if (styleFileName === void 0) { styleFileName = SDKStylingManager.STYLE_FILE_NAME; }
        var tmpFile = fs.File.fromPath(fs.path.join(fs.knownFolders.temp().path, styleFileName));
        if (tmpFile) {
            mdk_sap_1.StylingManager.applySDKTheme(styleFileName);
        }
    };
    SDKStylingManager.applyBrandingStyles = function () {
        mdk_sap_1.StylingManager.applySDKBranding(SDKStylingManager.BRANDING_STYLE_FILE);
    };
    SDKStylingManager.deleteSDKStyleFile = function (styleFileName) {
        if (styleFileName === void 0) { styleFileName = SDKStylingManager.STYLE_FILE_NAME; }
        var tmpFile = fs.File.fromPath(fs.path.join(fs.knownFolders.temp().path, styleFileName));
        if (tmpFile) {
            return tmpFile.remove();
        }
    };
    SDKStylingManager.STYLE_FILE_NAME = 'SDKCustomTheme.nss';
    SDKStylingManager.BRANDING_STYLE_FILE = 'Branding.nss';
    return SDKStylingManager;
}());
exports.SDKStylingManager = SDKStylingManager;
