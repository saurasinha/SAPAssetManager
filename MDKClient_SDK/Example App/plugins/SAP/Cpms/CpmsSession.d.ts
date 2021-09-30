export declare class CpmsSession {
    static getInstance(): CpmsSession;
    initialize(params: any): void;
    updateConnectionParams(params: any): void;
    sendRequest(url: string, params?: object): Promise<any>;
}
