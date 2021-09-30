"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceProvider_1 = require("./ODataServiceProvider");
var ErrorMessage_1 = require("../ErrorHandling/ErrorMessage");
var oDataPkg = com.sap.cloud.mobile.odata;
var ODataServiceUtils = (function () {
    function ODataServiceUtils() {
    }
    ODataServiceUtils.getServiceName = function (serviceUrl) {
        if (typeof serviceUrl !== 'string') {
            throw new Error(ErrorMessage_1.ErrorMessage.ODATA_SERVICE_URL_NOT_A_STRING);
        }
        if (serviceUrl != null) {
            var url = new java.net.URL(serviceUrl);
            var path = url.getPath();
            if (path.length > 1 && path[0] === '/') {
                var pathComponents = path.split('/');
                return pathComponents.join('');
            }
        }
        return null;
    };
    ODataServiceUtils.hasPathSuffix = function (serviceUrl) {
        if (serviceUrl != null) {
            var url = new java.net.URL(serviceUrl);
            var path = url.getPath();
            if (path.length > 1 && path[0] === '/') {
                var pathComponents = path.split('/');
                return pathComponents.length > 2;
            }
        }
        return false;
    };
    ODataServiceUtils.convert = function (name, value, type) {
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
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_CONVERSION_NOT_IMPLEMENTED, type));
        }
    };
    ODataServiceUtils.base64StringToBinary = function (value) {
        return oDataPkg.core.Base64Binary.convert(value);
    };
    ODataServiceUtils.isNumericTypeWithEmptyValue = function (value, type) {
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
    };
    ODataServiceUtils.convertString = function (value) {
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
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'String'));
        }
    };
    ODataServiceUtils.convertInteger = function (value) {
        if (value instanceof oDataPkg.IntegerValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (value instanceof java.math.BigInteger) {
            return oDataPkg.IntegerValue.of(value);
        }
        else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
            return oDataPkg.IntegerValue.of(new java.math.BigInteger(value));
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Integer'));
        }
    };
    ODataServiceUtils.convertByte = function (value) {
        if (value instanceof oDataPkg.ByteValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        var returnValue;
        if (typeof value === 'number') {
            returnValue = value;
        }
        else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
            var intVal = java.lang.Integer.valueOf(value);
            returnValue = intVal.intValue();
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Byte'));
        }
        if (returnValue < -128 || returnValue > 127) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, String(returnValue), 'Byte'));
        }
        return oDataPkg.ByteValue.of(returnValue);
    };
    ODataServiceUtils.convertBool = function (value) {
        if (value instanceof oDataPkg.BooleanValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'boolean') {
            return oDataPkg.BooleanValue.of(value);
        }
        else if (typeof value === 'number' && (value === 0 || value === 1)) {
            return oDataPkg.BooleanValue.of(!!value);
        }
        else if (typeof value === 'string' && (value === 'true' || value === 'false')) {
            return oDataPkg.BooleanValue.of(value === 'true');
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Bool'));
        }
    };
    ODataServiceUtils.convertChar = function (value) {
        if (value instanceof oDataPkg.CharValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'number') {
            return oDataPkg.CharValue.of(value);
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Char'));
        }
    };
    ODataServiceUtils.convertDecimal = function (value) {
        if (value instanceof oDataPkg.DecimalValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (value instanceof java.math.BigDecimal) {
            return oDataPkg.DecimalValue.of(value);
        }
        else if (typeof value === 'number') {
            return oDataPkg.DecimalValue.of(java.math.BigDecimal.valueOf(value));
        }
        else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
            var doubleValue = java.lang.Double.valueOf(value);
            return oDataPkg.DecimalValue.of(java.math.BigDecimal.valueOf(doubleValue.doubleValue()));
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Decimal'));
        }
    };
    ODataServiceUtils.convertDouble = function (value) {
        if (value instanceof oDataPkg.DoubleValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'number') {
            return oDataPkg.DoubleValue.of(value);
        }
        else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
            var doubleValue = java.lang.Double.valueOf(value);
            return oDataPkg.DoubleValue.of(doubleValue.doubleValue());
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Double'));
        }
    };
    ODataServiceUtils.convertFloat = function (value) {
        if (value instanceof oDataPkg.FloatValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'number') {
            return oDataPkg.FloatValue.of(value);
        }
        else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
            var floatValue = java.lang.Float.valueOf(value);
            return oDataPkg.FloatValue.of(floatValue.floatValue());
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Float'));
        }
    };
    ODataServiceUtils.convertInt = function (value) {
        if (value instanceof oDataPkg.IntValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'number') {
            return oDataPkg.IntValue.of(value);
        }
        else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
            var intVal = java.lang.Integer.valueOf(value);
            return oDataPkg.IntValue.of(intVal.intValue());
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Int'));
        }
    };
    ODataServiceUtils.convertShort = function (value) {
        if (value instanceof oDataPkg.ShortValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'number') {
            return oDataPkg.ShortValue.of(value);
        }
        else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
            var shortVal = java.lang.Short.valueOf(value);
            return oDataPkg.ShortValue.of(shortVal.shortValue());
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Short'));
        }
    };
    ODataServiceUtils.convertLong = function (value) {
        if (value instanceof oDataPkg.LongValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'number') {
            return oDataPkg.LongValue.of(value);
        }
        else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
            var int64Val = java.lang.Long.valueOf(value);
            return oDataPkg.LongValue.of(int64Val.longValue());
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'Long'));
        }
    };
    ODataServiceUtils.convertUnsignedByte = function (value) {
        if (value instanceof oDataPkg.UnsignedByte) {
            return value;
        }
        if (value == null) {
            return null;
        }
        var returnValue;
        if (typeof value === 'number') {
            returnValue = value;
        }
        else if (typeof value === 'string' && !Number.isNaN(Number(value))) {
            var intVal = java.lang.Integer.valueOf(value);
            returnValue = intVal.intValue();
        }
        else {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'UnsignedByte'));
        }
        if (returnValue > 255 || returnValue < 0) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, String(returnValue), 'UnsignedByte'));
        }
        return oDataPkg.UnsignedByte.of(returnValue);
    };
    ODataServiceUtils.convertLocalDateTime = function (value) {
        if (value instanceof oDataPkg.LocalDateTime) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'string') {
            var utcDate = this.utcDateTimeFromString(value, this.timeZoneAbbreviationForString);
            if (utcDate) {
                return this.localDateTimeFrom(utcDate, this.timeZoneAbbreviationForString);
            }
            else {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'LocalDateTime'));
            }
        }
        if (value instanceof Date) {
            return this.localDateTimeFrom(value, ODataServiceProvider_1.ODataServiceProvider.getServiceTimeZoneAbbreviation());
        }
        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'LocalDateTime'));
    };
    ODataServiceUtils.convertGlobalDateTime = function (value) {
        if (value instanceof oDataPkg.GlobalDateTime) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'string') {
            var utcDate = this.utcDateTimeFromString(value, this.timeZoneAbbreviationForString);
            if (utcDate) {
                return this.globalDateTimeFrom(utcDate);
            }
            else {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'GlobalDateTime'));
            }
        }
        if (value instanceof Date) {
            return this.globalDateTimeFrom(value);
        }
        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'GlobalDateTime'));
    };
    ODataServiceUtils.convertLocalDate = function (value) {
        if (value instanceof oDataPkg.LocalDate) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'string') {
            var utcDate = this.utcDateFromString(value, this.timeZoneAbbreviationForString);
            if (utcDate) {
                return this.localDateFrom(utcDate, this.timeZoneAbbreviationForString);
            }
            else {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'LocalDate'));
            }
        }
        if (value instanceof Date) {
            return this.localDateFrom(value, ODataServiceProvider_1.ODataServiceProvider.getServiceTimeZoneAbbreviation());
        }
        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'LocalDate'));
    };
    ODataServiceUtils.convertLocalTime = function (value) {
        if (value instanceof oDataPkg.LocalTime) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'string') {
            var utcDate = this.utcTimeFromString(value, this.timeZoneAbbreviationForString);
            if (utcDate) {
                return this.localTimeFrom(utcDate, this.timeZoneAbbreviationForString);
            }
            else {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'LocalTime'));
            }
        }
        if (value instanceof Date) {
            return this.localTimeFrom(value, ODataServiceProvider_1.ODataServiceProvider.getServiceTimeZoneAbbreviation());
        }
        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, 'LocalTime'));
    };
    ODataServiceUtils.convertGUID = function (value) {
        if (value instanceof oDataPkg.GuidValue) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'string') {
            try {
                return oDataPkg.GuidValue.parse(value);
            }
            catch (error) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'GUID'));
            }
        }
    };
    ODataServiceUtils.convertDayTimeDuration = function (value) {
        if (value instanceof oDataPkg.DayTimeDuration) {
            return value;
        }
        if (value == null) {
            return null;
        }
        if (typeof value === 'string') {
            try {
                return oDataPkg.DayTimeDuration.parse(value);
            }
            catch (error) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CONVERT_PROPERTY_STRING_VALUE_TO_REQUIRED_TYPE_FAILED, ODataServiceUtils.propertyName, value, 'DayTimeDuration'));
            }
        }
    };
    ODataServiceUtils.globalDateTimeFrom = function (utcDate, timezone) {
        if (timezone === void 0) { timezone = 'UTC'; }
        var formatter = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ");
        formatter.setTimeZone(java.util.TimeZone.getTimeZone(timezone));
        var dateString = formatter.format(new java.util.Date(utcDate.getTime()));
        return oDataPkg.GlobalDateTime.parse(dateString);
    };
    ODataServiceUtils.localDateTimeFrom = function (utcDate, timezone) {
        var formatter = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
        formatter.setTimeZone(java.util.TimeZone.getTimeZone(timezone));
        var dateString = formatter.format(new java.util.Date(utcDate.getTime()));
        return oDataPkg.LocalDateTime.parse(dateString);
    };
    ODataServiceUtils.localDateFrom = function (utcDate, timezone) {
        var formatter = new java.text.SimpleDateFormat('yyyy-MM-dd');
        formatter.setTimeZone(java.util.TimeZone.getTimeZone(timezone));
        var dateString = formatter.format(new java.util.Date(utcDate.getTime()));
        return oDataPkg.LocalDate.parse(dateString);
    };
    ODataServiceUtils.localTimeFrom = function (utcDate, timezone) {
        var formatter = new java.text.SimpleDateFormat('HH:mm:ss.SSS');
        formatter.setTimeZone(java.util.TimeZone.getTimeZone(timezone));
        var dateString = formatter.format(new java.util.Date(utcDate.getTime()));
        return oDataPkg.LocalTime.parse(dateString);
    };
    ODataServiceUtils.utcDateTimeFromString = function (dateString, timezone) {
        if (dateString.match(this.DATE_TIME_REGEX) || dateString.match(this.UTC_DATE_TIME_REGEX) ||
            dateString.match(this.UTC_DATE_TIME_FULL_REGEX)) {
            try {
                var dateFormat = dateString.match(this.UTC_DATE_TIME_FULL_REGEX) ? "yyyy-MM-dd'T'HH:mm:ss.SSS" :
                    "yyyy-MM-dd'T'HH:mm:ss";
                var formatter = new java.text.SimpleDateFormat(dateFormat);
                formatter.setTimeZone(java.util.TimeZone.getTimeZone('UTC'));
                return formatter.parse(dateString);
            }
            catch (error) {
            }
            return null;
        }
        else {
            return this.utcDateFromString(dateString, timezone);
        }
    };
    ODataServiceUtils.utcDateFromString = function (dateString, timezone) {
        if (dateString.match(this.DATE_REGEX)) {
            try {
                var formatter = new java.text.SimpleDateFormat('yyyy-MM-dd');
                formatter.setTimeZone(java.util.TimeZone.getTimeZone('UTC'));
                return formatter.parse(dateString);
            }
            catch (error) {
            }
        }
        return null;
    };
    ODataServiceUtils.utcTimeFromString = function (dateString, timezone) {
        if (dateString.match(this.TIME_REGEX) || dateString.match(this.TIME_FULL_REGEX)) {
            try {
                var dateFormat = dateString.match(this.TIME_FULL_REGEX) ? "HH:mm:ss.SSS" : "HH:mm:ss";
                var formatter = new java.text.SimpleDateFormat(dateFormat);
                formatter.setTimeZone(java.util.TimeZone.getTimeZone('UTC'));
                return formatter.parse(dateString);
            }
            catch (error) {
            }
        }
        return null;
    };
    ODataServiceUtils.DATE_TIME_REGEX = /^(\d{4})(\-)(\d?\d)(\-)(\d?\d)(\T)(\d?\d)(\:)(\d?\d)(\:)(\d?\d)$/;
    ODataServiceUtils.UTC_DATE_TIME_REGEX = /^(\d{4})(\-)(\d?\d)(\-)(\d?\d)(\T)(\d?\d)(\:)(\d?\d)(\:)(\d?\d)Z$/;
    ODataServiceUtils.UTC_DATE_TIME_FULL_REGEX = /^(\d{4})(\-)(\d?\d)(\-)(\d?\d)(\T)(\d?\d)(\:)(\d?\d)(\:)(\d?\d).(\d?\d?\d)Z$/;
    ODataServiceUtils.DATE_REGEX = /^(\d{4})(\-)(\d?\d)(\-)(\d?\d)$/;
    ODataServiceUtils.TIME_REGEX = /^(\d?\d)(\:)(\d?\d)(\:)(\d?\d)$/;
    ODataServiceUtils.TIME_FULL_REGEX = /^(\d?\d)(\:)(\d?\d)(\:)(\d?\d).(\d?\d?\d)$/;
    ODataServiceUtils.timeZoneAbbreviationForString = 'UTC';
    return ODataServiceUtils;
}());
exports.ODataServiceUtils = ODataServiceUtils;
