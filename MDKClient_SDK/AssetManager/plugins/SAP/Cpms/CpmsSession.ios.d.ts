export declare class CpmsSession {
    static getInstance(): CpmsSession;
    private static _instance;
    private _bridge;
    initialize(params: any): void;
    updateConnectionParams(params: any): void;
    sendRequest(url: string, params?: object): Promise<any>;
}
