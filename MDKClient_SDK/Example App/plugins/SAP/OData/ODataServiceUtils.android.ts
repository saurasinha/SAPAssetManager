import { ODataServiceProvider } from './ODataServiceProvider';
import { ErrorMessage } from '../ErrorHandling/ErrorMessage';

declare var java;
declare var com;
const oDataPkg = com.sap.cloud.mobile.odata;

export class ODataServiceUtils {
  private static propertyName: string;

  public static getServiceName(serviceUrl: string): string {
    if (typeof serviceUrl !== 'string') {
        throw new Error(ErrorMessage.ODATA_SERVICE_URL_NOT_A_STRING);
    }

    if (serviceUrl != null) {
      let url = new java.net.URL(serviceUrl);
      let path = url.getPath();
      if (path.length > 1 && path[0] === '/') {
        // No Path Suffix - /Test => Test
        // Has Path Suffix - /Test/V2/OData/OData.svc => TestV2ODataOData.svc
        let pathComponents = path.split('/');
        return pathComponents.join('');
      }
    }
    return null;
  }

  public static hasPathSuffix(serviceUrl: string): Boolean {
    if (serviceUrl != null) {
      let url = new java.net.URL(serviceUrl);
      let path = url.getPath();
      if (path.length > 1 && path[0] === '/') {
        // No Path Suffix - /Test => components length is 2
        // Has Path Suffix - /Test/V2/OData/OData.svc => components length is 5
        let pathComponents = path.split('/');
        return pathComponents.length > 2;
      }
    }
    return false;
  }
  
  public static convert(name: string, value: any, type: number): any {
    if (this.isNumericTypeWithEmptyValue(value, type)) {
      return null;
    }
    ODataServiceUtils.propertyName = name;

    switch (type) {
      case oDataPkg.DataType.STRING:
        return this.convertString(value);
      case oDataPkg.DataType.INTEGER:
        return this.convertInteger(value);
      case oDataPkg.DataType.BYTE:
          return this.convertByte(value);
      case oDataPkg.DataType.BOOLEAN:
          return this.convertBool(value);
      case oDataPkg.DataType.CHAR:
          return this.convertChar(value);
      case oDataPkg.DataType.DECIMAL:
          return this.convertDecimal(value);
      case oDataPkg.DataType.DOUBLE:
          return this.convertDouble(value);
      case oDataPkg.DataType.FLOAT:
          return this.convertFloat(value);
      case oDataPkg.DataType.INT:
          return this.convertInt(value);
      case oDataPkg.DataType.SHORT:
          return this.convertShort(value);
      case oDataPkg.DataType.LONG:
          return this.convertLong(value);
      case oDataPkg.DataType.UNSIGNED_BYTE:
          return this.convertUnsignedByte(value);
      case oDataPkg.DataType.LOCAL_DATE:
          return this.convertLocalDate(value);
      case oDataPkg.DataType.LOCAL_TIME:
          return this.convertLocalTime(value);
      case oDataPkg.DataType.LOCAL_DATE_TIME:
          return this.convertLocalDateTime(value);
      case oDataPkg.DataType.GLOBAL_DATE_TIME:
          return this.convertGlobalDateTime(value);
      case oDataPkg.DataType.GUID_VALUE:
          return this.convertGUID(value);
      case oDataPkg.DataType.DAY_TIME_DURATION:
          return this.convertDayTimeDuration(value);
      default:
        throw new Error(ErrorMessage.format(ErrorMessage.ODATA_CONVERSION_NOT_IMPLEMENTED, type));
    }
  }

  public static base64StringToBinary(value: string): any {
    return oDataPkg.core.Base64Binary.convert(value);
  }

  private static DATE_TIME_REGEX = /^(\d{4})(\-)(\d?\d)(\-)(\d?\d)(\T)(\d?\d)(\:)(\d?\d)(\:)(\d?\d)$/;
  private static UTC_DATE_TIME_REGEX = /^(\d{4})(\-)(\d?\d)(\-)(\d?\d)(\T)(\d?\d)(\:)(\d?\d)(\:)(\d?\d)Z$/;
  private static UTC_DATE_TIME_FULL_REGEX =
    /^(\d{4})(\-)(\d?\d)(\-)(\d?\d)(\T)(\d?\d)(\:)(\d?\d)(\:)(\d?\d).(\d?\d?\d)Z$/;
  private static DATE_REGEX = /^(\d{4})(\-)(\d?\d)(\-)(\d?\d)$/;
  private static TIME_REGEX = /^(\d?\d)(\:)(\d?\d)(\:)(\d?\d)$/;
  private static TIME_FULL_REGEX = /^(\d?\d)(\:)(\d?\d)(\:)(\d?\d).(\d?\d?\d)$/;

  private static timeZoneAbbreviationForString: string = 'UTC';

  private static isNumericTypeWithEmptyValue(value: any, type: number): boolean {
    switch (type) {
      case oDataPkg.DataType.INTEGER:
      case oDataPkg.DataType.DECIMAL:
      case oDataPkg.DataType.DOUBLE:
      case oDataPkg.DataType.FLOAT:
      case oDataPkg.DataType.INT:
      case oDataPkg.DataType.SHORT:
      case oDataPkg.DataType.LONG:
      case oDataPkg.DataType.BYTE:
      case oDataPkg.DataType.UNSIGNED_BYTE:
        if (typeof value === 'string' && value === '') {
          return true;
        }
        return false;
      default: 
        return false;
    }
  }

  private static convertString(value: any): any {
    if (value instanceof oDataPkg.StringValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (value instanceof Date) {
      return oDataPkg.StringValue.of(value.toISOString().substring(0, 10));
    }

    if (typeof value === 'string') {
      return oDataPkg.StringValue.of(value);
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'String'));
    }
  }

  private static convertInteger(value: any): any {
    if (value instanceof oDataPkg.IntegerValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (value instanceof java.math.BigInteger) {
      return oDataPkg.IntegerValue.of(value);
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      return oDataPkg.IntegerValue.of(new java.math.BigInteger(value));
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Integer'));
    }
  }

  private static convertByte(value: any): any {
    if (value instanceof oDataPkg.ByteValue) {
        return value;
    }

    if (value == null) {
      return null;
    }

    let returnValue;
    if (typeof value === 'number') {
      returnValue = value;
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      let intVal = java.lang.Integer.valueOf(value);
      returnValue = intVal.intValue();
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Byte'));
    }
    if (returnValue < -128 || returnValue > 127) {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, String(returnValue), 'Byte'));
    }
    return oDataPkg.ByteValue.of(returnValue);
  }

  private static convertBool(value: any): any {
    if (value instanceof oDataPkg.BooleanValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'boolean') {
      return oDataPkg.BooleanValue.of(value);
    } else if (typeof value === 'number' && (value === 0 || value === 1)) {
      return oDataPkg.BooleanValue.of(!!value);
    } else if (typeof value === 'string' && (value === 'true' || value === 'false')) {
      return oDataPkg.BooleanValue.of(value === 'true');
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Bool'));
    }
  }

  private static convertChar(value: any): any {
    if (value instanceof oDataPkg.CharValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'number') {
      return oDataPkg.CharValue.of(value);
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Char'));
    }
  }

  private static convertDecimal(value: any): any {
    if (value instanceof oDataPkg.DecimalValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (value instanceof java.math.BigDecimal) {
      return oDataPkg.DecimalValue.of(value);
    } else if (typeof value === 'number') {
      return oDataPkg.DecimalValue.of(java.math.BigDecimal.valueOf(value));
      // Double from String is more robust than BigDecimal from String, so doing a detour through Double...
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      let doubleValue = java.lang.Double.valueOf(value);
      return oDataPkg.DecimalValue.of(java.math.BigDecimal.valueOf(doubleValue.doubleValue()));
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Decimal'));
    }
  }

  private static convertDouble(value: any): any {
    if (value instanceof oDataPkg.DoubleValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'number') {
      return oDataPkg.DoubleValue.of(value);
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      let doubleValue = java.lang.Double.valueOf(value);
      return oDataPkg.DoubleValue.of(doubleValue.doubleValue());
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Double'));
    }
  }

  private static convertFloat(value: any): any {
    if (value instanceof oDataPkg.FloatValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'number') {
      return oDataPkg.FloatValue.of(value);
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      let floatValue = java.lang.Float.valueOf(value);
      return oDataPkg.FloatValue.of(floatValue.floatValue());
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Float'));
    }
  }

  private static convertInt(value: any): any {
    if (value instanceof oDataPkg.IntValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'number') {
      return oDataPkg.IntValue.of(value);
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      let intVal = java.lang.Integer.valueOf(value);
      return oDataPkg.IntValue.of(intVal.intValue());
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Int'));
    }
  }

  private static convertShort(value: any): any {
    if (value instanceof oDataPkg.ShortValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'number') {
      return oDataPkg.ShortValue.of(value);
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      let shortVal = java.lang.Short.valueOf(value);
      return oDataPkg.ShortValue.of(shortVal.shortValue());
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Short'));
    }
  }

  private static convertLong(value: any): any {
    if (value instanceof oDataPkg.LongValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'number') {
      return oDataPkg.LongValue.of(value);
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      let int64Val = java.lang.Long.valueOf(value);
      return oDataPkg.LongValue.of(int64Val.longValue());
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Long'));
    }
  }

  private static convertUnsignedByte(value: any): any {
    if (value instanceof oDataPkg.UnsignedByte) {
      return value;
    }

    if (value == null) {
      return null;
    }

    let returnValue;
    if (typeof value === 'number') {
      returnValue = value;
    } else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
      let intVal = java.lang.Integer.valueOf(value);
      returnValue = intVal.intValue();
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'UnsignedByte'));
    }
    if (returnValue > 255 || returnValue < 0) {
      throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, String(returnValue), 'UnsignedByte'));
    }
    return oDataPkg.UnsignedByte.of(returnValue);
  }

  // Info: the date or time coming from UI Controls is always in UTC, i.e. if user enters 13:00 
  // and his device is EST timezone, the Date object will be 17:00
  private static convertLocalDateTime(value: any): any {
    if (value instanceof oDataPkg.LocalDateTime) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'string') {
      let utcDate = this.utcDateTimeFromString(value, this.timeZoneAbbreviationForString);
      if (utcDate) {
        return this.localDateTimeFrom(utcDate, this.timeZoneAbbreviationForString);
      } else {
        throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'LocalDateTime'));
      }
    }

    if (value instanceof Date) {
      // TODO-FUTURE: The abbreviation comes from the BrandedSettings. This will also have to support DateTimeOffset 
      // in the future, as it will replace DateTime in OData V4
      // (Gateway currently does not support DateTimeOffset).
      return this.localDateTimeFrom(value, ODataServiceProvider.getServiceTimeZoneAbbreviation());
    }
    throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'LocalDateTime'));
  }

  // GlobalDateTime assumes that the user did all the calculations and entered time in UTC no matter where he is,
  // and that the backend also expects UTC, so no conversion is required
  private static convertGlobalDateTime(value: any): any {
    if (value instanceof oDataPkg.GlobalDateTime) {
        return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'string') {
      let utcDate = this.utcDateTimeFromString(value, this.timeZoneAbbreviationForString);
      if (utcDate) {
        return this.globalDateTimeFrom(utcDate);
      } else {
        throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'GlobalDateTime'));
      }
    }

    if (value instanceof Date) {
      return this.globalDateTimeFrom(value);
    }

    throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'GlobalDateTime'));
  }

  private static convertLocalDate(value: any): any {
    if (value instanceof oDataPkg.LocalDate) {
        return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'string') {
      let utcDate = this.utcDateFromString(value, this.timeZoneAbbreviationForString);
      if (utcDate) {
        return this.localDateFrom(utcDate, this.timeZoneAbbreviationForString);
      } else {
        throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'LocalDate'));
      }
    }

    if (value instanceof Date) {
      return this.localDateFrom(value, ODataServiceProvider.getServiceTimeZoneAbbreviation());
    }

    throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'LocalDate'));
  }

  private static convertLocalTime(value: any): any {
    if (value instanceof oDataPkg.LocalTime) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'string') {
      let utcDate = this.utcTimeFromString(value, this.timeZoneAbbreviationForString);
      if (utcDate) {
        return this.localTimeFrom(utcDate, this.timeZoneAbbreviationForString);
      } else {
        throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'LocalTime'));
      }
    }

    if (value instanceof Date) {
      return this.localTimeFrom(value, ODataServiceProvider.getServiceTimeZoneAbbreviation());
    }

    throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'LocalTime'));
  }

  private static convertGUID(value: any): any {
    if (value instanceof oDataPkg.GuidValue) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'string') {
      try {
        return oDataPkg.GuidValue.parse(value);
      } catch (error) {
        throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'GUID'));
      }
    }
  }

  private static convertDayTimeDuration(value: any): any {
    if (value instanceof oDataPkg.DayTimeDuration) {
      return value;
    }

    if (value == null) {
      return null;
    }

    if (typeof value === 'string') {
      try {
        return oDataPkg.DayTimeDuration.parse(value);
      } catch (error) {
        throw new Error(ErrorMessage.format(ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'DayTimeDuration'));
      }
    }
  }

  // Please refer to iOS GlobalDateTime.from function. This function is not supported in Android SDK.
  private static globalDateTimeFrom(utcDate: any, timezone: string = 'UTC') {
    let formatter = new java.text.SimpleDateFormat(`yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ`);
    formatter.setTimeZone(java.util.TimeZone.getTimeZone(timezone));
    let dateString = formatter.format(new java.util.Date(utcDate.getTime()));
    return oDataPkg.GlobalDateTime.parse(dateString);
  }

  // Please refer to iOS LocalDateTime.from function. This function is not supported in Android SDK.
  private static localDateTimeFrom(utcDate: any, timezone: string) {
    let formatter = new java.text.SimpleDateFormat(`yyyy-MM-dd'T'HH:mm:ss.SSS`);
    formatter.setTimeZone(java.util.TimeZone.getTimeZone(timezone));
    let dateString = formatter.format(new java.util.Date(utcDate.getTime()));
    return oDataPkg.LocalDateTime.parse(dateString);
  }

  // Please refer to iOS LocalDate.from function. This function is not supported in Android SDK.
  private static localDateFrom(utcDate: any, timezone: string) {
    let formatter = new java.text.SimpleDateFormat('yyyy-MM-dd');
    formatter.setTimeZone(java.util.TimeZone.getTimeZone(timezone));
    let dateString = formatter.format(new java.util.Date(utcDate.getTime()));
    return oDataPkg.LocalDate.parse(dateString);
  }

  // Please refer to iOS LocalTime.from function. This function is not supported in Android SDK.
  private static localTimeFrom(utcDate: any, timezone: string) {
    let formatter = new java.text.SimpleDateFormat('HH:mm:ss.SSS');
    formatter.setTimeZone(java.util.TimeZone.getTimeZone(timezone));
    let dateString = formatter.format(new java.util.Date(utcDate.getTime()));
    return oDataPkg.LocalTime.parse(dateString);
  }

  private static utcDateTimeFromString(dateString: string, timezone) {
    if (dateString.match(this.DATE_TIME_REGEX) || dateString.match(this.UTC_DATE_TIME_REGEX) || 
      dateString.match(this.UTC_DATE_TIME_FULL_REGEX)) {
      try {
        let dateFormat = dateString.match(this.UTC_DATE_TIME_FULL_REGEX) ? `yyyy-MM-dd'T'HH:mm:ss.SSS` :
          `yyyy-MM-dd'T'HH:mm:ss`;
        let formatter = new java.text.SimpleDateFormat(dateFormat);
        formatter.setTimeZone(java.util.TimeZone.getTimeZone('UTC'));
        return formatter.parse(dateString);
      } catch (error) {
        // Ignore catch error and return null value
      }
      return null;
    } else {
      return this.utcDateFromString(dateString, timezone);
    }
  }

  private static utcDateFromString(dateString: string, timezone: string) {
    if (dateString.match(this.DATE_REGEX)) {
      try {
        let formatter = new java.text.SimpleDateFormat('yyyy-MM-dd');
        formatter.setTimeZone(java.util.TimeZone.getTimeZone('UTC'));
        return formatter.parse(dateString);
      } catch (error) {
        // Ignore catch error and return null value
      }
    }
    return null;
  }

  private static utcTimeFromString(dateString: string, timezone: string) {
    if (dateString.match(this.TIME_REGEX) || dateString.match(this.TIME_FULL_REGEX)) {
      try {
        let dateFormat = dateString.match(this.TIME_FULL_REGEX) ? `HH:mm:ss.SSS` : `HH:mm:ss`;
        let formatter = new java.text.SimpleDateFormat(dateFormat);
        formatter.setTimeZone(java.util.TimeZone.getTimeZone('UTC'));
        return formatter.parse(dateString);
      } catch (error) {
        // Ignore catch error and return null value
      }
    }
    return null;
  }
}
