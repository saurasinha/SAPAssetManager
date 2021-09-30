"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var ODataServiceUtils_1 = require("./ODataServiceUtils");
var oDataPkg = com.sap.cloud.mobile.odata;
var ODataConverter = (function () {
    function ODataConverter(dataService) {
        this.dataService = dataService;
    }
    ODataConverter.prototype.convert = function (propertyName, value, type, typeName) {
        switch (type) {
            case oDataPkg.DataType.COMPLEX_VALUE:
                return this.convertComplexValue(propertyName, value, typeName);
            case oDataPkg.DataType.COMPLEX_VALUE_LIST:
                return this.convertComplexValueList(propertyName, value, typeName);
            case oDataPkg.DataType.DATA_VALUE_LIST:
                return this.convertDataValueList(propertyName, value, typeName);
            case oDataPkg.DataType.ENTITY_VALUE:
                return this.convertEntityValue(propertyName, value, typeName);
            case oDataPkg.DataType.ENTITY_VALUE_LIST:
                return this.convertEntityValueList(propertyName, value, typeName);
            case oDataPkg.DataType.ENUM_VALUE:
                return this.convertEnumValue(propertyName, value, typeName);
            case oDataPkg.DataType.BINARY:
                return this.convertBinaryValue(propertyName, value);
            default:
                return ODataServiceUtils_1.ODataServiceUtils.convert(propertyName, value, type);
        }
    };
    ODataConverter.prototype.convertComplexValue = function (name, value, typeName) {
        if (value instanceof oDataPkg.ComplexValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        var complexType = this.getComplexType(typeName);
        if (complexType && typeof value === 'object') {
            var returnValue = oDataPkg.ComplexValue.ofType(complexType);
            for (var key in value) {
                if (key != null) {
                    var property = complexType.getProperty(key);
                    if (property != null) {
                        var dataValue = this.convert(key, value[key], property.getType().getCode(), property.getType().getName());
                        returnValue.setDataValue(property, dataValue);
                    }
                }
            }
            return returnValue;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'ComplexValue'));
        }
    };
    ODataConverter.prototype.convertComplexValueList = function (name, value, typeName) {
        if (value instanceof oDataPkg.ComplexValueList) {
            return value;
        }
        if (value == null) {
            return null;
        }
        var dataService = this.getOnlineService();
        if (dataService != null && Array.isArray(value)) {
            var complexTypeName = typeName.substring(0, typeName.length - 1);
            var complexType = dataService.getMetadata().getComplexType(complexTypeName);
            var returnValue = new oDataPkg.ComplexValueList();
            returnValue = returnValue.withType(oDataPkg.DataType.listOf(complexType));
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var complexVal = value_1[_i];
                if (complexVal != null) {
                    var dataValue = this.convert(name, complexVal, oDataPkg.DataType.COMPLEX_VALUE, complexTypeName);
                    returnValue.add(dataValue);
                }
            }
            return returnValue;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'ComplexValueList'));
        }
    };
    ODataConverter.prototype.convertDataValueList = function (name, value, typeName) {
        if (value instanceof oDataPkg.DataValueList) {
            return value;
        }
        if (value == null) {
            return null;
        }
        var dataService = this.getOnlineService();
        if (dataService != null && Array.isArray(value)) {
            var simpleTypeName = typeName.substring(0, typeName.length - 1);
            var dataType = void 0;
            if (simpleTypeName.indexOf('.') !== -1) {
                dataType = dataService.getMetadata().getEnumType(simpleTypeName);
            }
            else {
                dataType = oDataPkg.DataType.forName(simpleTypeName);
            }
            var returnValue = new oDataPkg.DataValueList();
            returnValue = returnValue.withType(oDataPkg.DataType.listOf(dataType));
            for (var _i = 0, value_2 = value; _i < value_2.length; _i++) {
                var simpleValue = value_2[_i];
                if (simpleValue != null) {
                    var dataValue = this.convert(name, simpleValue, dataType.getCode(), dataType.getName());
                    returnValue.add(dataValue);
                }
            }
            return returnValue;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'DataValueList'));
        }
    };
    ODataConverter.prototype.convertEntityValue = function (name, value, typeName) {
        if (value instanceof oDataPkg.EntityValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        var entityType = this.getEntityType(typeName);
        if (entityType && typeof value === 'object') {
            var returnValue = oDataPkg.EntityValue.ofType(entityType);
            for (var key in value) {
                if (key != null) {
                    var property = entityType.getProperty(key);
                    if (property != null) {
                        var dataValue = this.convert(key, value[key], property.getType().getCode(), property.getType().getName());
                        returnValue.setDataValue(property, dataValue);
                    }
                }
            }
            return returnValue;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'EntityValue'));
        }
    };
    ODataConverter.prototype.convertEntityValueList = function (name, value, typeName) {
        if (value instanceof oDataPkg.EntityValueList) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (Array.isArray(value)) {
            var entityTypeName = typeName.substring(0, typeName.length - 1);
            var entityType = this.getEntityType(entityTypeName);
            var returnValue = new oDataPkg.EntityValueList();
            returnValue = returnValue.withType(oDataPkg.DataType.listOf(entityType));
            for (var _i = 0, value_3 = value; _i < value_3.length; _i++) {
                var complexVal = value_3[_i];
                if (complexVal != null) {
                    var dataValue = this.convert(name, complexVal, oDataPkg.DataType.ENTITY_VALUE, entityTypeName);
                    returnValue.add(dataValue);
                }
            }
            return returnValue;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'EntityValueList'));
        }
    };
    ODataConverter.prototype.convertEnumValue = function (name, value, typeName) {
        if (value instanceof oDataPkg.EnumValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'string') {
            var enumType = this.dataService.getMetadata().getEnumType(typeName);
            if (enumType.findMember(value)) {
                return enumType.getMember(value);
            }
            else {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, name, value, 'EnumValue'));
            }
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'EnumValue'));
        }
    };
    ODataConverter.prototype.getOnlineService = function () {
        if (this.dataService != null && this.dataService.getProvider() instanceof oDataPkg.OnlineODataProvider) {
            return this.dataService;
        }
        else {
            return null;
        }
    };
    ODataConverter.prototype.getComplexType = function (typeName) {
        if (this.dataService != null) {
            return this.dataService.getMetadata().getComplexType(typeName);
        }
        else {
            return null;
        }
    };
    ODataConverter.prototype.getEntityType = function (typeName) {
        if (this.dataService != null) {
            return this.dataService.getMetadata().getEntityType(typeName);
        }
        else {
            return null;
        }
    };
    ODataConverter.prototype.convertBinaryValue = function (name, value) {
        if (value == null) {
            return null;
        }
        if (value instanceof oDataPkg.BinaryValue) {
            return value;
        }
        var content;
        if (value instanceof Array) {
            if (value.length === 0) {
                return null;
            }
            content = value[0].content;
        }
        else if (typeof value === 'string') {
            content = ODataServiceUtils_1.ODataServiceUtils.base64StringToBinary(value);
        }
        else if (value && value.content) {
            content = value.content;
        }
        else if (value && value.length > 0) {
            content = value;
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'BinaryValue'));
        }
        return oDataPkg.BinaryValue.of(content);
    };
    return ODataConverter;
}());
exports.ODataConverter = ODataConverter;
