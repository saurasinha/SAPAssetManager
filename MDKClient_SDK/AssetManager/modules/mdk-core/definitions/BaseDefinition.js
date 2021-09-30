"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDefinition = (function () {
    function BaseDefinition(path, data) {
        this.path = path;
        this.rawData = data;
    }
    BaseDefinition.prototype.getName = function () {
        return this.path;
    };
    return BaseDefinition;
}());
exports.BaseDefinition = BaseDefinition;
;
