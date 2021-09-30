"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseODataCruder_1 = require("../../BaseODataCruder");
var BindingLink = (function () {
    function BindingLink(sourceNavigationProperty, sourceEntity, targetEntity, operation) {
        this.sourceNavigationProperty = sourceNavigationProperty;
        this.sourceEntity = sourceEntity;
        this.targetEntity = targetEntity;
        this.operation = operation;
    }
    BindingLink.prototype.execute = function () {
        if (this.operation === BaseODataCruder_1.ODataCrudOperation.Delete) {
            return;
        }
        this.sourceEntity.bindEntity(this.targetEntity, this.sourceNavigationProperty);
    };
    return BindingLink;
}());
exports.BindingLink = BindingLink;
