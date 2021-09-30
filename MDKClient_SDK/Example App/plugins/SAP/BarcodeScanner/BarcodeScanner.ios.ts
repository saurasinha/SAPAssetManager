declare var BarcodeScannerBridge: any;

class BarcodeScannerCallback extends NSObject {
  // selector will be exposed so it can be called from native.
  /* tslint:disable */
  public static ObjCExposedMethods = {
    finishedScanningWithResults: { params: [NSString], returns: interop.types.void },
    finishedCheckingWithResults: { params: [NSString], returns: interop.types.void },
    finishedScanningWithErrors: { params: [NSString], returns: interop.types.void },
    finishedCheckingWithErrors: { params: [NSString], returns: interop.types.void },
  };
  /* tslint:enable */
  public static initWithCreateCallback(callback: any): BarcodeScannerCallback {
    let bridgeCallback = <BarcodeScannerCallback> BarcodeScannerCallback.new();
    bridgeCallback._createCallback = callback;
    return bridgeCallback;
  }

  public static initWithCheckCallback(callback: any): BarcodeScannerCallback {
    let bridgeCallback = <BarcodeScannerCallback> BarcodeScannerCallback.new();
    bridgeCallback._checkCallback = callback;
    return bridgeCallback;
  }

  private _createCallback: any;
  private _checkCallback: any;

  public finishedScanningWithResults(data: NSString) {
    this._createCallback.finishedScanningWithResults(data);
  }

  public finishedCheckingWithResults(data: Boolean) {
    this._checkCallback.finishedCheckingWithResults(data);
  }

  public finishedScanningWithErrors(data: NSString) {
    this._createCallback.finishedScanningWithErrors(data);
  }
  public finishedCheckingWithErrors(data: NSString) {
    this._checkCallback.finishedCheckingWithErrors(data);
  }
}

export class BarcodeScanner {
  public static getInstance(): BarcodeScanner {
    if (!BarcodeScanner._instance) {
      BarcodeScanner._instance = new BarcodeScanner();
    }
    return BarcodeScanner._instance;
  }

  private static _instance;
  private _barcodeScannerBridge: any;

  public open(params: any, callback: any) {
    this._barcodeScannerBridge = BarcodeScannerBridge.new();
    let myCallback = BarcodeScannerCallback.initWithCreateCallback(callback);
    this._barcodeScannerBridge.createCallback(params, myCallback);
  }

  public checkPrerequisite(params: any, callback: any) {
    this._barcodeScannerBridge = BarcodeScannerBridge.new();
    let myCallback = BarcodeScannerCallback.initWithCheckCallback(callback);
    this._barcodeScannerBridge.checkCallback(params, myCallback);
  }
};
