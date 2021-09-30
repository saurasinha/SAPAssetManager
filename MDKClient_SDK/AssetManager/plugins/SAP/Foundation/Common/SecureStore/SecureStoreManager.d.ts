export declare class SecureStorageManager {
    static getInstance(): SecureStorageManager;
    setString(key: String, value: String): void;
    getString(key: String): String;
    remove(key: String): void;
    removeStore(): void;
}
