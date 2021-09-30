"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var trace_1 = require("tns-core-modules/trace");
var ConsoleWriter = (function () {
    function ConsoleWriter(categories) {
        this._categories = {};
        this.setCategories(categories);
    }
    ConsoleWriter.prototype.write = function (message, category, type) {
        if (!console) {
            return;
        }
        var msgType;
        if (type === undefined) {
            msgType = trace_1.messageType.log;
        }
        else {
            msgType = type;
        }
        if (msgType == trace_1.messageType.error) {
            if (!(category in this._categories)) {
                return;
            }
        }
        switch (msgType) {
            case trace_1.messageType.log:
                console.log(category + ": " + message);
                break;
            case trace_1.messageType.info:
                console.info(category + ": " + message);
                break;
            case trace_1.messageType.warn:
                console.warn(category + ": " + message);
                break;
            case trace_1.messageType.error:
                console.error(category + ": " + message);
                break;
        }
    };
    ConsoleWriter.prototype.setCategories = function (categories) {
        this._categories = {};
        this.addCategories(categories);
    };
    ConsoleWriter.prototype.addCategories = function (categories) {
        var split = categories.split(",");
        for (var i = 0; i < split.length; i++) {
            this._categories[split[i].trim()] = true;
        }
    };
    return ConsoleWriter;
}());
exports.ConsoleWriter = ConsoleWriter;
