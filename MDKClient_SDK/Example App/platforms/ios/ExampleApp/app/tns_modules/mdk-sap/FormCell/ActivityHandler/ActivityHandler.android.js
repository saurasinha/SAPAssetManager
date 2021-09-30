"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActivityHandler = (function () {
    function ActivityHandler() {
    }
    ActivityHandler.onCreate = function (savedInstanceState, context) {
        ActivityHandler.bridge.onCreate(savedInstanceState, context);
    };
    ActivityHandler.onActivityResult = function (requestCode, resultCode, data, context) {
        ActivityHandler.bridge.onActivityResult(requestCode, resultCode, data, context);
    };
    ActivityHandler.onRequestPermissionsResult = function (requestCode, permissions, grantResults, context) {
        ActivityHandler.bridge.onRequestPermissionsResult(requestCode, permissions, grantResults, context);
    };
    ActivityHandler.bridge = com.sap.mdk.client.ui.fiori.activityHandler.ActivityHandler;
    return ActivityHandler;
}());
exports.ActivityHandler = ActivityHandler;
