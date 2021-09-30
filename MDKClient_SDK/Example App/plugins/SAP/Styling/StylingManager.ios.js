"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StylingManager = (function () {
    function StylingManager() {
    }
    StylingManager.applySDKTheme = function (file) {
        StylingHelperBridge.applySDKTheme(file);
    };
    StylingManager.applySDKBranding = function (file) {
        StylingHelperBridge.applySDKBranding(file);
    };
    return StylingManager;
}());
exports.StylingManager = StylingManager;
