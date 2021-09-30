export declare class ODataConverter {
    private dataService;
    constructor(dataService: any);
    convert(propertyName: string, value: any, type: number, typeName: String): any;
    private convertComplexValue;
    private convertComplexValueList;
    private convertDataValueList;
    private convertEntityValue;
    private convertEntityValueList;
    private convertEnumValue;
    private getOnlineService;
    private getComplexType;
    private getEntityType;
    private convertBinaryValue;
}
