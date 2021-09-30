"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var TypeConverter = (function () {
    function TypeConverter() {
    }
    TypeConverter.reduce = function (reducible) {
        var _this = this;
        return reducible.reduce(function (accumulator, value) {
            return accumulator.concat(Array.isArray(value) ? _this.reduce(value) : value);
        }, []);
    };
    TypeConverter.toArray = function (value, allowSplit) {
        if (allowSplit === void 0) { allowSplit = true; }
        var result = [];
        if (Array.isArray(value)) {
            result = value;
        }
        else if (typeof value === 'string') {
            result = allowSplit ? value.split(',') : [value];
        }
        else if (app.ios && value instanceof NSArray) {
            for (var i = 0; i < value.count; i++) {
                result.push(value.objectAtIndex(i));
            }
        }
        else if (app.android && value instanceof Object) {
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
    TypeConverter.toString = function (value) {
        if (typeof value !== 'string') {
            return "" + value;
        }
        return value;
    };
    TypeConverter.toBoolean = function (value) {
        if (typeof value === 'boolean') {
            return value;
        }
        else if (typeof value === 'string') {
            value = value.toLowerCase().trim();
            if (value === 'true') {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    };
    return TypeConverter;
}());
exports.TypeConverter = TypeConverter;
