export declare class DataConverter {
    static toJavaObject(params: any): any;
    static toJavaArray(params: any): any;
    static toJavaScriptObject(javaObj: any): void;
    static toJavaScriptMap(javaObj: any): void;
    static fromNSDictToMap(nsDict: any): Map<String, any>;
    static toViewFacade(view: any): any;
    static toUTCDate(dateString: string, serviceTimeZoneAbbreviation: string): string;
    static toJavaScriptValue(value: any): string;
    static fromNSDictToJavascriptObject(nsDict: any): void;
    static fromNSDictWithNSArrayToJavascriptObject(nsDict: any): void;
    static convertNSDictInNSArray(value: any): void;
    static toArray(value: any): void;
    static jsonObjectToJavascriptObject(value: any): void;
    static javaJsonObjectToJavascriptObject(value: any): void;
}
