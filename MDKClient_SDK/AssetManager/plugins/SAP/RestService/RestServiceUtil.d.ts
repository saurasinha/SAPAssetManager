export declare class RestServiceUtil {
    static getAndroidFormData(body: object[]): any;
    static getIOSFormData(boundry: string, body: object[]): any;
    static isTextContent(contentType: string): true | RegExpMatchArray;
}
