"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("tns-core-modules/trace");
var DataConverter = (function () {
    function DataConverter() {
    }
    DataConverter.toJavaObject = function (params) {
        var obj = new org.json.JSONObject();
        for (var prop in params) {
            if (params[prop] === null || params[prop] === undefined) {
                obj.put(prop, null);
            }
            else if (typeof params[prop] === 'string' || typeof params[prop] === 'number'
                || typeof params[prop] === 'boolean') {
                obj.put(prop, params[prop]);
            }
            else if (typeof params[prop] === 'object') {
                if (params[prop] && params[prop].constructor === {}.constructor) {
                    obj.put(prop, DataConverter.toJavaObject(params[prop]));
                }
                else if (Array.isArray(params[prop])) {
                    obj.put(prop, DataConverter.toJavaArray(params[prop]));
                }
            }
            else {
                trace_1.write("DataConverter.toJavaObject - Unsupported type " + prop, 'mdk.trace.core', trace_1.messageType.log);
            }
        }
        return obj;
    };
    DataConverter.toJavaArray = function (params) {
        var obj = new org.json.JSONArray();
        for (var prop in params) {
            if (params[prop] === null || params[prop] === undefined) {
                obj.put(null);
            }
            else if (typeof params[prop] === 'string' || typeof params[prop] === 'number'
                || typeof params[prop] === 'boolean') {
                obj.put(params[prop]);
            }
            else if (typeof params[prop] === 'object') {
                if (params[prop] && params[prop].constructor === {}.constructor) {
                    obj.put(DataConverter.toJavaObject(params[prop]));
                }
                else if (Array.isArray(params[prop])) {
                    obj.put(DataConverter.toJavaArray(params[prop]));
                }
                else if (Array.isArray(params[prop])) {
                    obj.put(DataConverter.toJavaArray(params[prop]));
                }
            }
            else {
                var message = 'DataConverter.toJavaObject - Unsupported type ${typeof params[prop]}`';
                trace_1.write(message, 'mdk.trace.core', trace_1.messageType.log);
            }
        }
        return obj;
    };
    DataConverter.toJavaScriptObject = function (javaObj) {
        var node = {};
        var obj = new org.json.JSONObject(javaObj);
        var iterator = obj.keys();
        var key;
        while (iterator.hasNext()) {
            key = iterator.next();
            node[key] = obj.get(key);
        }
        return node;
    };
    DataConverter.jsonObjectToJavascriptObject = function (jsonObject) {
        var node = {};
        var iterator = jsonObject.keys();
        var key;
        while (iterator.hasNext()) {
            key = iterator.next();
            node[key] = jsonObject.get(key);
        }
        return node;
    };
    DataConverter.toJavaScriptMap = function (javaObj) {
        var aMap = new Map();
        var node = DataConverter.toJavaScriptObject(javaObj);
        Object.keys(node).forEach(function (key) {
            if (key === 'PasscodeSource') {
                aMap.set(key, Number(node[key]));
            }
            else {
                aMap.set(key, node[key]);
            }
        });
        return aMap;
    };
    DataConverter.toViewFacade = function (view) {
        return {
            android: view,
            ios: undefined,
        };
    };
    DataConverter.toArray = function (value, allowSplit) {
        if (allowSplit === void 0) { allowSplit = true; }
        var result = [];
        if (Array.isArray(value)) {
            result = value;
        }
        else if (value instanceof Object) {
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var item = value_1[_i];
                result.push(item);
            }
        }
        else {
            result = [value];
        }
        return result;
    };
    DataConverter.toUTCDate = function (dateString, serviceTimeZoneAbbreviation) {
        if (dateString && dateString.length > 0 && dateString[dateString.length - 1] === 'Z') {
            var formatter = dateString.match(this.UTC_DATE_TIME_FULL_REGEX) ?
                new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") :
                new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
            var date = formatter.parse(dateString);
            formatter = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            return formatter.format(date);
        }
        else {
            var formatter = dateString.match(this.DATE_TIME_FULL_REGEX) ?
                new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS") :
                new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            formatter.setTimeZone(java.util.TimeZone.getTimeZone(serviceTimeZoneAbbreviation));
            var date = formatter.parse(dateString);
            formatter = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            formatter.setTimeZone(java.util.TimeZone.getTimeZone('UTC'));
            return formatter.format(date);
        }
    };
    DataConverter.toJavaScriptValue = function (value) {
        if (value instanceof java.util.Date) {
            return new Date(value.getTime());
        }
        else if (value instanceof java.lang.Object && value.getClass() && value.getClass().getSimpleName() === 'JSONObject' && value.length() >= 0) {
            return this.jsonObjectToJavascriptObject(value);
        }
        else if (value instanceof java.lang.Object && value.length >= 0) {
            var result = [];
            for (var _i = 0, value_2 = value; _i < value_2.length; _i++) {
                var item = value_2[_i];
                result.push(item);
            }
            return result;
        }
        else {
            return value;
        }
    };
    DataConverter.javaJsonObjectToJavascriptObject = function (javaJsonObj) {
        var obj = {};
        var iterator = javaJsonObj.keys();
        var key, value;
        while (iterator.hasNext()) {
            key = iterator.next();
            value = javaJsonObj.get(key);
            if (value instanceof java.lang.Object && value.getClass()) {
                if (value.getClass().getSimpleName() === 'Integer') {
                    obj[key] = value.intValue();
                }
                else if (value.getClass().getSimpleName() === 'Boolean') {
                    obj[key] = value.booleanValue();
                }
                else if (value.getClass().getSimpleName() === 'int[]') {
                    var result = [];
                    for (var _i = 0, value_3 = value; _i < value_3.length; _i++) {
                        var item = value_3[_i];
                        result.push(item);
                    }
                    obj[key] = result;
                }
            }
            else {
                obj[key] = value;
            }
        }
        return obj;
    };
    DataConverter.DATE_TIME_FULL_REGEX = /^(\d{4})(\-)(\d\d)(\-)(\d\d)(\T)(\d\d)(\:)(\d\d)(\:)(\d\d).(\d\d\d)$/;
    DataConverter.UTC_DATE_TIME_FULL_REGEX = /^(\d{4})(\-)(\d\d)(\-)(\d\d)(\T)(\d\d)(\:)(\d\d)(\:)(\d\d).(\d\d\d)Z$/;
    return DataConverter;
}());
exports.DataConverter = DataConverter;
;
