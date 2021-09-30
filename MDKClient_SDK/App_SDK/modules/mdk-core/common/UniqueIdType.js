"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UniqueIdType;
(function (UniqueIdType) {
    UniqueIdType[UniqueIdType["String"] = 0] = "String";
    UniqueIdType[UniqueIdType["Integer"] = 1] = "Integer";
})(UniqueIdType = exports.UniqueIdType || (exports.UniqueIdType = {}));
function isUniqueIdTypeInteger(type) {
    return type === UniqueIdType.Integer;
}
exports.isUniqueIdTypeInteger = isUniqueIdTypeInteger;
function isUniqueIdTypeString(type) {
    if (type === undefined) {
        type = UniqueIdType.String;
    }
    return type === UniqueIdType.String;
}
exports.isUniqueIdTypeString = isUniqueIdTypeString;
function stringToUniqueIdType(uniqueIdType) {
    if (uniqueIdType === 'Integer') {
        return UniqueIdType.Integer;
    }
    return UniqueIdType.String;
}
exports.stringToUniqueIdType = stringToUniqueIdType;
