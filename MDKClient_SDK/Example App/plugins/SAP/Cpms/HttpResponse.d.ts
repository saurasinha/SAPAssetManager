export declare class HttpResponse {
    static getHeaders(responseAndData: any): any;
    static getMimeType(responseAndData: any): string;
    static getStatusCode(responseAndData: any): number;
    static getData(responseAndData: any): any;
    static toFile(responseAndData: any, url: string, destinationFilePath?: string): any;
    static toImage(responseAndData: any): any;
    static toString(responseAndData: any, encoding?: any): string;
}
