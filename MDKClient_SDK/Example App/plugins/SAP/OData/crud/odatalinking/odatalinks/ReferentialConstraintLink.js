"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseODataCruder_1 = require("../../BaseODataCruder");
var ODataServiceUtils_1 = require("../../../ODataServiceUtils");
var ErrorMessage_1 = require("../../../../ErrorHandling/ErrorMessage");
var ReferentialConstraintLink = (function () {
    function ReferentialConstraintLink(dependantNavigationProperty, dependantEntity, principalEntity, operation) {
        this.forcesCreateRelatedEntity = false;
        this.dependantNavigationProperty = dependantNavigationProperty;
        this.dependantEntity = dependantEntity;
        this.principalEntity = principalEntity;
        this.operation = operation;
    }
    ReferentialConstraintLink.prototype.getPrincipalEntity = function () {
        return this.principalEntity;
    };
    ReferentialConstraintLink.prototype.getDependantNavigationProperty = function () {
        return this.dependantNavigationProperty;
    };
    ReferentialConstraintLink.prototype.execute = function () {
        switch (this.operation) {
            case BaseODataCruder_1.ODataCrudOperation.Create:
            case BaseODataCruder_1.ODataCrudOperation.Update:
                this.createLink();
                break;
            case BaseODataCruder_1.ODataCrudOperation.Delete:
                this.deleteLink();
                break;
            case BaseODataCruder_1.ODataCrudOperation.Read:
            default:
                break;
        }
    };
    ReferentialConstraintLink.prototype.createLink = function () {
        var principalPropertyNamesByDependantPropertyNames = this.dependantNavigationProperty.getReferentialConstraints();
        var iterator = principalPropertyNamesByDependantPropertyNames.keys().iterator();
        while (iterator.hasNext()) {
            var dependantPropertyName = iterator.next();
            var principalPropertyName = principalPropertyNamesByDependantPropertyNames.get(dependantPropertyName);
            var principalProp = this.principalEntity.getEntityType().getProperty(principalPropertyName);
            var principalPropValue = principalProp.getOptionalValue(this.principalEntity);
            if (principalPropValue != null) {
                var dependantProp = this.dependantEntity.getEntityType().getProperty(dependantPropertyName);
                dependantProp.setValue(this.dependantEntity, ODataServiceUtils_1.ODataServiceUtils.convert(dependantPropertyName, principalPropValue, dependantProp.getDataType().getCode()));
            }
        }
    };
    ReferentialConstraintLink.prototype.deleteLink = function () {
        var principalPropertyNamesByDependantPropertyNames = this.dependantNavigationProperty.getReferentialConstraints();
        var iterator = principalPropertyNamesByDependantPropertyNames.keys().iterator();
        while (iterator.hasNext()) {
            var dependantPropertyName = iterator.next();
            var dependantProp = this.dependantEntity.getEntityType().getProperty(dependantPropertyName);
            if (this.dependantEntity.getEntityType().getKeyProperties().indexOf(dependantProp) >= 0) {
                throw new Error(ErrorMessage_1.ErrorMessage.ODATA_DELETE_REQUIRED_PROPERTY_NOT_ALLOWED);
            }
            dependantProp.setValue(this.dependantEntity, null);
        }
    };
    return ReferentialConstraintLink;
}());
exports.ReferentialConstraintLink = ReferentialConstraintLink;
