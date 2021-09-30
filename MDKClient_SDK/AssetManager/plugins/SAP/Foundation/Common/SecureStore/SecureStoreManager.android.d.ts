export declare class SecureStorageManager {
    static getInstance(): SecureStorageManager;
    private static _instance;
    private _bridge;
    getString(key: String): String;
    setString(key: String, value: String): void;
    remove(key: String): void;
    removeStore(): void;
}
