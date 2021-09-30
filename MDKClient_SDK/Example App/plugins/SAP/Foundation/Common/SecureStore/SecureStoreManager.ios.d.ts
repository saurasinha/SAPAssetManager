export declare class SecureStorageManager {
    static getInstance(): SecureStorageManager;
    private static _instance;
    private constructor();
    setString(key: String, value: String): void;
    getString(key: String): String;
    remove(key: String): void;
    removeStore(): void;
    private _throwIfError;
}
