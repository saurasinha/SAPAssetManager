"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadParams = (function () {
    function ReadParams(entitySetName) {
        this.entitySetName = entitySetName;
    }
    ReadParams.prototype.getEntitySetName = function () {
        return this.entitySetName;
    };
    ReadParams.prototype.isTargetCreatedInSameChangeSet = function () {
        return false;
    };
    return ReadParams;
}());
exports.ReadParams = ReadParams;
