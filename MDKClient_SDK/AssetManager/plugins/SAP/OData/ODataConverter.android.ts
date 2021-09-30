import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { ODataServiceUtils } from './ODataServiceUtils';

declare var com;
const oDataPkg = com.sap.cloud.mobile.odata;

export class ODataConverter {
  private dataService: any;

  public constructor(dataService: any) {
    this.dataService = dataService;
  }

  public convert(propertyName: string, value: any, type: number, typeName: String): any {
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
        return ODataServiceUtils.convert(propertyName, value, type);
    }
  }

  private convertComplexValue(name: string, value: any, typeName: String): any {
    if (value instanceof oDataPkg.ComplexValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    let complexType = this.getComplexType(typeName);
    if (complexType && typeof value === 'object') {
      let returnValue = oDataPkg.ComplexValue.ofType(complexType);
      for (let key in value) {
        if (key != null) {
          let property = complexType.getProperty(key);
          if (property != null) {
            let dataValue = this.convert(key, value[key], property.getType().getCode(), property.getType().getName());
            returnValue.setDataValue(property, dataValue);
          }
        }
      }
      return returnValue;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'ComplexValue'));
    }
  }

  private convertComplexValueList(name: string, value: any, typeName: String): any {
    if (value instanceof oDataPkg.ComplexValueList) {
      return value;
    }

    if (value == null) {
      return null;
    }

    let dataService = this.getOnlineService();
    if (dataService != null && Array.isArray(value)) {
      let complexTypeName = typeName.substring(0, typeName.length - 1);
      let complexType = dataService.getMetadata().getComplexType(complexTypeName);
      let returnValue = new oDataPkg.ComplexValueList();
      returnValue = returnValue.withType(oDataPkg.DataType.listOf(complexType));

      for (let complexVal of value) {
        if (complexVal != null) {
          let dataValue = this.convert(name, complexVal, oDataPkg.DataType.COMPLEX_VALUE, complexTypeName);
          returnValue.add(dataValue);
        }
      }
      return returnValue;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'ComplexValueList'));
    }
  }

  private convertDataValueList(name: string, value: any, typeName: String): any {
    if (value instanceof oDataPkg.DataValueList) {
      return value;
    }

    if (value == null) {
      return null;
    }

    let dataService = this.getOnlineService();
    if (dataService != null && Array.isArray(value)) {
      let simpleTypeName = typeName.substring(0, typeName.length - 1);
      let dataType;
      if (simpleTypeName.indexOf('.') !== -1) {
        dataType = dataService.getMetadata().getEnumType(simpleTypeName);
      } else {
        dataType = oDataPkg.DataType.forName(simpleTypeName);
      }
      let returnValue = new oDataPkg.DataValueList();
      returnValue = returnValue.withType(oDataPkg.DataType.listOf(dataType));

      for (let simpleValue of value) {
        if (simpleValue != null) {
          let dataValue = this.convert(name, simpleValue, dataType.getCode(), dataType.getName());
          returnValue.add(dataValue);
        }
      }
      return returnValue;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'DataValueList'));
    }
  }

  private convertEntityValue(name: string, value: any, typeName: String): any {
    if (value instanceof oDataPkg.EntityValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    let entityType = this.getEntityType(typeName);
    if (entityType && typeof value === 'object') {
      let returnValue = oDataPkg.EntityValue.ofType(entityType);
      for (let key in value) {
        if (key != null) {
          let property = entityType.getProperty(key);
          if (property != null) {
            let dataValue = this.convert(key, value[key], property.getType().getCode(), property.getType().getName());
            returnValue.setDataValue(property, dataValue);
          }
        }
      }
      return returnValue;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'EntityValue'));
    }
  }

  private convertEntityValueList(name: string, value: any, typeName: String): any {
    if (value instanceof oDataPkg.EntityValueList) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (Array.isArray(value)) {
      let entityTypeName = typeName.substring(0, typeName.length - 1);
      let entityType = this.getEntityType(entityTypeName);
      let returnValue = new oDataPkg.EntityValueList();
      returnValue = returnValue.withType(oDataPkg.DataType.listOf(entityType));

      for (let complexVal of value) {
        if (complexVal != null) {
          let dataValue = this.convert(name, complexVal, oDataPkg.DataType.ENTITY_VALUE, entityTypeName);
          returnValue.add(dataValue);
        }
      }
      return returnValue;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'EntityValueList'));
    }
  }

  private convertEnumValue(name: string, value: any, typeName: String): any {
    if (value instanceof oDataPkg.EnumValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'string') {
      let enumType = this.dataService.getMetadata().getEnumType(typeName);
      if (enumType.findMember(value)) {
        return enumType.getMember(value);
      } else {
        throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, name, value, 'EnumValue'));
      }
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'EnumValue'));
    }
  }

  private getOnlineService(): any {
    if (this.dataService != null && this.dataService.getProvider() instanceof oDataPkg.OnlineODataProvider) {
      return this.dataService;
    } else { 
      return null;
    }
  }

  private getComplexType(typeName: String): any {
    if (this.dataService != null) {
      return this.dataService.getMetadata().getComplexType(typeName);
    } else {
      return null;
    }
  }

  private getEntityType(typeName: String): any {
    if (this.dataService != null) {
      return this.dataService.getMetadata().getEntityType(typeName);
    } else {
      return null;
    }
  }

  private convertBinaryValue(name: string, value: any): any {
    if (value == null) {
      return null;
    }
    if (value instanceof oDataPkg.BinaryValue) {
      return value;
    }

    let content;
    if (value instanceof Array) {
      // from attachment control
      if (value.length === 0) {
        return null;
      }
      // use the first item
      content = value[0].content;
    } else if (typeof value === 'string') {
      // support base64 string
      content = ODataServiceUtils.base64StringToBinary(value);
    } else if (value && value.content) {
      // attachment media object
      content = value.content;
    } else if (value && value.length > 0) {
      // binary data
      content = value;
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, name, 'BinaryValue'));
    }
    return oDataPkg.BinaryValue.of(content);
  }
}
