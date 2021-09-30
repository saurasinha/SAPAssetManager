export declare class HttpHeadersUtil {
    static convertHeaders(headers: {
        key: string;
        value: string;
    }): {
        key: string;
        value: string;
    };
    static convertHeadersPropertiesToString(headerProperties: Object): string;
}
