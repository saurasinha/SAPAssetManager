"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BarcodeScannerCallback = (function (_super) {
    __extends(BarcodeScannerCallback, _super);
    function BarcodeScannerCallback() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarcodeScannerCallback.initWithCreateCallback = function (callback) {
        var bridgeCallback = BarcodeScannerCallback.new();
        bridgeCallback._createCallback = callback;
        return bridgeCallback;
    };
    BarcodeScannerCallback.initWithCheckCallback = function (callback) {
        var bridgeCallback = BarcodeScannerCallback.new();
        bridgeCallback._checkCallback = callback;
        return bridgeCallback;
    };
    BarcodeScannerCallback.prototype.finishedScanningWithResults = function (data) {
        this._createCallback.finishedScanningWithResults(data);
    };
    BarcodeScannerCallback.prototype.finishedCheckingWithResults = function (data) {
        this._checkCallback.finishedCheckingWithResults(data);
    };
    BarcodeScannerCallback.prototype.finishedScanningWithErrors = function (data) {
        this._createCallback.finishedScanningWithErrors(data);
    };
    BarcodeScannerCallback.prototype.finishedCheckingWithErrors = function (data) {
        this._checkCallback.finishedCheckingWithErrors(data);
    };
    BarcodeScannerCallback.ObjCExposedMethods = {
        finishedScanningWithResults: { params: [NSString], returns: interop.types.void },
        finishedCheckingWithResults: { params: [NSString], returns: interop.types.void },
        finishedScanningWithErrors: { params: [NSString], returns: interop.types.void },
        finishedCheckingWithErrors: { params: [NSString], returns: interop.types.void },
    };
    return BarcodeScannerCallback;
}(NSObject));
var BarcodeScanner = (function () {
    function BarcodeScanner() {
    }
    BarcodeScanner.getInstance = function () {
        if (!BarcodeScanner._instance) {
            BarcodeScanner._instance = new BarcodeScanner();
        }
        return BarcodeScanner._instance;
    };
    BarcodeScanner.prototype.open = function (params, callback) {
        this._barcodeScannerBridge = BarcodeScannerBridge.new();
        var myCallback = BarcodeScannerCallback.initWithCreateCallback(callback);
        this._barcodeScannerBridge.createCallback(params, myCallback);
    };
    BarcodeScanner.prototype.checkPrerequisite = function (params, callback) {
        this._barcodeScannerBridge = BarcodeScannerBridge.new();
        var myCallback = BarcodeScannerCallback.initWithCheckCallback(callback);
        this._barcodeScannerBridge.checkCallback(params, myCallback);
    };
    return BarcodeScanner;
}());
exports.BarcodeScanner = BarcodeScanner;
;
