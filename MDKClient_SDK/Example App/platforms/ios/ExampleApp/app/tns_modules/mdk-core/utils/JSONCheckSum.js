"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../utils/Logger");
var sha256 = require("crypto-js/sha256");
var JSONCheckSum = (function () {
    function JSONCheckSum() {
    }
    JSONCheckSum.sha256 = function (json) {
        var builtDataString = JSONCheckSum.stringify(json);
        if (builtDataString) {
            var checksum = sha256(builtDataString);
            try {
                return checksum.toString();
            }
            catch (error) {
                Logger_1.Logger.instance.core.error(error);
            }
        }
        return builtDataString;
    };
    JSONCheckSum.stringify = function (json) {
        if (Array.isArray(json)) {
            return JSON.stringify(json.map(function (i) { return JSONCheckSum.stringify(i); }));
        }
        else if (typeof json === 'object' && json !== null) {
            return Object.keys(json)
                .sort()
                .map(function (key) { return key + ":" + JSONCheckSum.stringify(json[key]); })
                .join('');
        }
        return json;
    };
    return JSONCheckSum;
}());
exports.JSONCheckSum = JSONCheckSum;
