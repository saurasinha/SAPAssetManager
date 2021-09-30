import { DataConverter } from '../Common/DataConverter';
import * as app from 'tns-core-modules/application';
const androidApp = app.android;
declare var com: any;

export class BarcodeScanner {
  public static getInstance(): BarcodeScanner {
    if (!BarcodeScanner._instance) {
      BarcodeScanner._instance = new BarcodeScanner();
    }
    return BarcodeScanner._instance;
  }

  private static _instance;
  private _bridge = new com.sap.mdk.client.ui.fiori.barcodescanner.BarcodeScanner(androidApp.foregroundActivity);

  public createCallback(callback: any) {
    return new com.sap.mdk.client.ui.fiori.barcodescanner.IBarcodeScannerCallback ({
      finishedCheckingWithErrors: (data) => {
        callback.finishedCheckingWithErrors(data);
      },
      finishedCheckingWithResults: (data) => {
        callback.finishedCheckingWithResults(data);
      },
      finishedScanningWithErrors: (data) => {
        callback.finishedScanningWithErrors(data);
      },
      finishedScanningWithResults: (data) => {
        callback.finishedScanningWithResults(data);
      },
    });
  }

  public open(params: any, callback: any) {
    let openParams = DataConverter.toJavaObject(params);
    this._bridge.create(openParams, this.createCallback(callback));
  }

  public checkPrerequisite(params: any, callback: any) {
    let checkParams = DataConverter.toJavaObject(params);
    this._bridge.check(checkParams, this.createCallback(callback));
  }
};
