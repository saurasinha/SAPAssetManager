export declare class ODataServiceUtils {
    static getServiceName(serviceUrl: string): string;
    static hasPathSuffix(serviceUrl: string): Boolean;
    static convert(name: string, value: any, type: number): any;
    static base64StringToBinary(value: string): Promise<any>;
}
