"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueResolver_1 = require("../utils/ValueResolver");
var BaseDataBuilder = (function () {
    function BaseDataBuilder(_context) {
        this._context = _context;
        this._data = {};
        this._doNotResolveKeys = {
            FormatRule: true,
            OnPress: true,
            OnValueChange: true,
        };
    }
    BaseDataBuilder.prototype.build = function () {
        var builtData = {};
        var promises = [];
        var _loop_1 = function (key) {
            if (this_1.data.hasOwnProperty(key)) {
                var value = this_1.data[key];
                if (value !== undefined && value !== null) {
                    if (this_1._doNotResolveKeys[key]) {
                        builtData[key] = value;
                    }
                    else {
                        promises.push(this_1._buildValue(value).then(function (builtValue) {
                            if (builtValue !== undefined && builtValue !== null) {
                                builtData[key] = builtValue;
                            }
                        }));
                    }
                }
            }
        };
        var this_1 = this;
        for (var key in this.data) {
            _loop_1(key);
        }
        return Promise.all(promises).then(function () {
            return builtData;
        });
    };
    Object.defineProperty(BaseDataBuilder.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDataBuilder.prototype, "doNotResolveKeys", {
        set: function (doNotResolve) {
            Object.assign(this._doNotResolveKeys, doNotResolve);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseDataBuilder.prototype, "excludedTypes", {
        set: function (types) {
            this._excludedTypes = types;
        },
        enumerable: true,
        configurable: true
    });
    BaseDataBuilder.prototype._buildValue = function (value) {
        var _this = this;
        if (value instanceof BaseDataBuilder) {
            return value.build();
        }
        else if (Array.isArray(value)) {
            return Promise.all(value.map(function (item) {
                return _this._buildValue(item);
            }));
        }
        else if (typeof value === 'object') {
            if (!value) {
                return Promise.resolve(value);
            }
            return Promise.all(Object.keys(value).map(function (key) {
                return _this._buildValue(value[key]).then(function (result) {
                    value[key] = result;
                });
            })).then(function () {
                return value;
            });
        }
        else {
            return ValueResolver_1.ValueResolver.resolveValue(value, this._context, true, this._excludedTypes);
        }
    };
    return BaseDataBuilder;
}());
exports.BaseDataBuilder = BaseDataBuilder;
