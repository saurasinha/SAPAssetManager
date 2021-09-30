/**
 * This is the common interface exosed to TS for the SecureStore native implementation.
 */
export class SecureStorageManager {

  public static getInstance(): SecureStorageManager {
    //
    return null;
  }

  public setString(key: String, value: String) {
    //
  }

  public getString(key: String): String {
    return '';
  }

  public remove(key: String) {
    //
  }

  public removeStore() {
    //
  }
};
