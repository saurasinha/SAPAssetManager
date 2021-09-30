export declare enum UniqueIdType {
    String = 0,
    Integer = 1
}
export declare function isUniqueIdTypeInteger(type: UniqueIdType): boolean;
export declare function isUniqueIdTypeString(type: UniqueIdType): boolean;
export declare function stringToUniqueIdType(uniqueIdType: string): UniqueIdType;
