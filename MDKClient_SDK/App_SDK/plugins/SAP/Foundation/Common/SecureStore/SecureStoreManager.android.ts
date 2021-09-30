import * as application from 'tns-core-modules/application';

declare var com;
/**
 * This is the common interface exosed to TS for the SecureStore native implementation.
 */
export class SecureStorageManager {
  public static getInstance(): SecureStorageManager {
    if (!SecureStorageManager._instance) {
      SecureStorageManager._instance = new SecureStorageManager();
    }
    return SecureStorageManager._instance;
  }
  
  private static _instance: SecureStorageManager;
  
  private _bridge = com.sap.mdk.client.foundation.SecureStoreHandler.getInstance(application.android.context);

  public getString(key: String): String {
    return this._bridge.getString(key);
  }

  public setString(key: String, value: String) {
    this._bridge.putString(key, value);
  }

  public remove(key: String) {
    this._bridge.remove(key);
  }

  public removeStore() {
    this._bridge.removeStore();
  }
};
