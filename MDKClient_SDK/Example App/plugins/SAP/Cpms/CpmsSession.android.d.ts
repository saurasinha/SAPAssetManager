export declare class CpmsSession {
    static createIPromiseCallback(args: any): any;
    static getInstance(): CpmsSession;
    private _bridge;
    initialize(params: any): void;
    updateConnectionParams(params: any): void;
    sendRequest(url: string, params?: object): Promise<any>;
}
