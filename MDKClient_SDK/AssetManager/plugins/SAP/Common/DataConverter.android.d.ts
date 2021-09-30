export declare class DataConverter {
    static toJavaObject(params: any): any;
    static toJavaArray(params: any): any;
    static toJavaScriptObject(javaObj: any): {};
    static jsonObjectToJavascriptObject(jsonObject: any): {};
    static toJavaScriptMap(javaObj: any): Map<any, any>;
    static toViewFacade(view: any): {
        android: any;
        ios: any;
    };
    static toArray(value: any, allowSplit?: boolean): [any];
    static toUTCDate(dateString: string, serviceTimeZoneAbbreviation: string): any;
    static toJavaScriptValue(value: any): any;
    static javaJsonObjectToJavascriptObject(javaJsonObj: any): {};
    private static DATE_TIME_FULL_REGEX;
    private static UTC_DATE_TIME_FULL_REGEX;
}
