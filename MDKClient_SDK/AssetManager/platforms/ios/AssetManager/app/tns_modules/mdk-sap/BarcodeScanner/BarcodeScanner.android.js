"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataConverter_1 = require("../Common/DataConverter");
var app = require("tns-core-modules/application");
var androidApp = app.android;
var BarcodeScanner = (function () {
    function BarcodeScanner() {
        this._bridge = new com.sap.mdk.client.ui.fiori.barcodescanner.BarcodeScanner(androidApp.foregroundActivity);
    }
    BarcodeScanner.getInstance = function () {
        if (!BarcodeScanner._instance) {
            BarcodeScanner._instance = new BarcodeScanner();
        }
        return BarcodeScanner._instance;
    };
    BarcodeScanner.prototype.createCallback = function (callback) {
        return new com.sap.mdk.client.ui.fiori.barcodescanner.IBarcodeScannerCallback({
            finishedCheckingWithErrors: function (data) {
                callback.finishedCheckingWithErrors(data);
            },
            finishedCheckingWithResults: function (data) {
                callback.finishedCheckingWithResults(data);
            },
            finishedScanningWithErrors: function (data) {
                callback.finishedScanningWithErrors(data);
            },
            finishedScanningWithResults: function (data) {
                callback.finishedScanningWithResults(data);
            },
        });
    };
    BarcodeScanner.prototype.open = function (params, callback) {
        var openParams = DataConverter_1.DataConverter.toJavaObject(params);
        this._bridge.create(openParams, this.createCallback(callback));
    };
    BarcodeScanner.prototype.checkPrerequisite = function (params, callback) {
        var checkParams = DataConverter_1.DataConverter.toJavaObject(params);
        this._bridge.check(checkParams, this.createCallback(callback));
    };
    return BarcodeScanner;
}());
exports.BarcodeScanner = BarcodeScanner;
;
