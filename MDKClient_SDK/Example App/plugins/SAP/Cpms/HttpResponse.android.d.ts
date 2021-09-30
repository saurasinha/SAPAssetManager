export declare class HttpResponse {
    static getHeaders(responseAndData: any): any;
    static getMimeType(responseAndData: any): any;
    static getStatusCode(responseAndData: any): any;
    static getData(responseAndData: any): any;
    static toFile(responseAndData: any, url: string, destinationFilePath?: string): any;
    static toImage(responseAndData: any): any;
    static toString(responseAndData: any): string;
}
