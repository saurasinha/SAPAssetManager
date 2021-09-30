import { ErrorMessage } from '../../../ErrorHandling/ErrorMessage';
declare var interop: any;
// ios native class
declare var SecureStoreManager: any;

export class SecureStorageManager {

  public static getInstance(): SecureStorageManager {
    return SecureStorageManager._instance;
  }

  private static _instance: SecureStorageManager = new SecureStorageManager();
  private constructor() {
    if (SecureStorageManager._instance) {
      throw new Error('Error: Instantiation failed. Use getInstance() instead of new.');
    }
    SecureStorageManager._instance = this;
  }

  public setString(key: String, value: String) {
    let errorRef = new interop.Reference();
    SecureStoreManager.sharedInstance.putStringWithValueKeyError(value, key, errorRef);
    this._throwIfError(errorRef);
  }

  public getString(key: String): String {
    let errorRef = new interop.Reference();
    let value = SecureStoreManager.sharedInstance.getStringWithKeyError(key, errorRef);
    this._throwIfError(errorRef);
    return value;
  }

  public remove(key: String) {
    let errorRef = new interop.Reference();
    SecureStoreManager.sharedInstance.removeWithKeyError(key, errorRef);
    this._throwIfError(errorRef);
  }

  public removeStore() {
    SecureStoreManager.sharedInstance.removeStore();
  }

  private _throwIfError(errorRef: any) {
    if (!errorRef.value || errorRef.value.code === 0) {
      // All is good!
      return;
    }
    
    // There is an issue we can't ignore
    let errorCode = errorRef.value.localizedDescription;
    throw new Error(ErrorMessage.format(ErrorMessage.ERROR_ACCESSING_SECURE_STOIRE, errorCode));
  }
};
