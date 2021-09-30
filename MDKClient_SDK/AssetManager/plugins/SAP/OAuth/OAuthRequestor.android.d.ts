export declare class OAuthRequestor {
    static getInstance(): OAuthRequestor;
    private static _instance;
    private _bridge;
    initialize(params: any): void;
    updateConnectionParams(params: any): void;
    sendRequest(url: string): Promise<any>;
}
