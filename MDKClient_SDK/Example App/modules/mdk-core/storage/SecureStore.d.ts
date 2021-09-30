export declare class SecureStore {
    static getInstance(): SecureStore;
    private static _instance;
    private _manager;
    private constructor();
    setString(key: String, value: String): void;
    getString(key: String): String;
    remove(key: String): void;
    removeStore(): void;
}
