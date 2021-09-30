"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("tns-core-modules/file-system");
var utils = require("tns-core-modules/utils/utils");
var StylingManager = (function () {
    function StylingManager() {
    }
    StylingManager.applySDKTheme = function (file) {
        var fullPath = fs.path.join(fs.knownFolders.temp().path, file);
        var _stylingHelperBridge = com.sap.mdk.client.ui.styling.StylingHelper.sharedInstance;
        var context = utils.ad.getApplicationContext();
        _stylingHelperBridge.calculateDensity(context);
        _stylingHelperBridge.applySDKTheme(fullPath);
    };
    StylingManager.applySDKBranding = function (file) {
    };
    return StylingManager;
}());
exports.StylingManager = StylingManager;
