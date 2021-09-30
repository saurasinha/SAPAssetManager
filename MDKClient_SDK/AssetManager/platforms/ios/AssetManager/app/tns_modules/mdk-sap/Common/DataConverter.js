"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataConverter = (function () {
    function DataConverter() {
    }
    DataConverter.fromNSDictToMap = function (nsDict) {
        var map = new Map();
        var keys = nsDict.allKeys;
        for (var i = 0; i < keys.count; i++) {
            var key = keys[i].toString();
            var value = nsDict.valueForKey(key);
            if (value !== undefined && value !== null) {
                map.set(key, value);
            }
        }
        return map;
    };
    DataConverter.fromNSDictToJavascriptObject = function (nsDict) {
        var node = {};
        var keys = nsDict.allKeys;
        for (var i = 0; i < keys.count; i++) {
            var key = keys[i].toString();
            var value = nsDict.valueForKey(key);
            if (value !== undefined && value !== null) {
                node[key] = value;
            }
        }
        return node;
    };
    DataConverter.fromNSDictWithNSArrayToJavascriptObject = function (nsDict) {
        var node = {};
        var keys = nsDict.allKeys;
        for (var i = 0; i < keys.count; i++) {
            var key = keys[i].toString();
            var value = nsDict.valueForKey(key);
            if (value !== undefined && value !== null) {
                if (value instanceof NSArray) {
                    node[key] = DataConverter.toArray(value);
                }
                else {
                    node[key] = value;
                }
            }
        }
        return node;
    };
    DataConverter.convertNSDictInNSArray = function (value) {
        var result = [];
        if (value instanceof NSArray) {
            for (var i = 0; i < value.count; i++) {
                result.push(DataConverter.fromNSDictToJavascriptObject(value.objectAtIndex(i)));
            }
        }
        else {
            result = [value];
        }
        return result;
    };
    DataConverter.toArray = function (value, allowSplit) {
        if (allowSplit === void 0) { allowSplit = true; }
        var result = [];
        if (Array.isArray(value)) {
            result = value;
        }
        else if (value instanceof NSArray) {
            for (var i = 0; i < value.count; i++) {
                result.push(value.objectAtIndex(i));
            }
        }
        else {
            result = [value];
        }
        return result;
    };
    DataConverter.toViewFacade = function (view) {
        return {
            android: undefined,
            ios: view,
        };
    };
    DataConverter.toUTCDate = function (dateString, serviceTimeZoneAbbreviation) {
        if (dateString && dateString.length > 0 && dateString[dateString.length - 1] === 'Z') {
            var formatter = NSDateFormatter.alloc().init();
            formatter.dateFormat = dateString.match(this.UTC_DATE_TIME_FULL_REGEX) ?
                "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" : "yyyy-MM-dd'T'HH:mm:ss'Z'";
            var date = formatter.dateFromString(dateString);
            formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss";
            return formatter.stringFromDate(date);
        }
        else {
            var formatter = NSDateFormatter.alloc().init();
            formatter.dateFormat = dateString.match(this.DATE_TIME_FULL_REGEX) ?
                "yyyy-MM-dd'T'HH:mm:ss.SSS" : "yyyy-MM-dd'T'HH:mm:ss";
            formatter.timeZone = NSTimeZone.alloc().initWithName(serviceTimeZoneAbbreviation);
            var date = formatter.dateFromString(dateString);
            formatter.timeZone = NSTimeZone.alloc().initWithName('UTC');
            formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss";
            return formatter.stringFromDate(date);
        }
    };
    DataConverter.DATE_TIME_FULL_REGEX = /^(\d{4})(\-)(\d\d)(\-)(\d\d)(\T)(\d\d)(\:)(\d\d)(\:)(\d\d).(\d\d\d)$/;
    DataConverter.UTC_DATE_TIME_FULL_REGEX = /^(\d{4})(\-)(\d\d)(\-)(\d\d)(\T)(\d\d)(\:)(\d\d)(\:)(\d\d).(\d\d\d)Z$/;
    return DataConverter;
}());
exports.DataConverter = DataConverter;
;
