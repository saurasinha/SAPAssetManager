"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BindingLink_1 = require("./BindingLink");
var ReferentialConstraintLink_1 = require("./ReferentialConstraintLink");
var BaseODataCruder_1 = require("../../BaseODataCruder");
var ChangeSetManager_1 = require("../../ChangeSetManager");
var ODataHelper_1 = require("../../../ODataHelper");
var ErrorMessage_1 = require("../../../../ErrorHandling/ErrorMessage");
var LinkingScenario = (function () {
    function LinkingScenario(navigationProperty, sourceEntity, targetEntity, operation, canUseCreateRelatedEntity, supportsBind) {
        this.navigationProperty = navigationProperty;
        this.sourceEntity = sourceEntity;
        this.targetEntity = targetEntity;
        this.operation = operation;
        this.canUseCreateRelatedEntity = canUseCreateRelatedEntity;
        this.supportsBind = supportsBind;
        this.partnerProperty = ODataHelper_1.ODataHelper.partnerPropertyFromEntity(navigationProperty, targetEntity);
    }
    LinkingScenario.prototype.execute = function () {
        var linkToParentEntity = null;
        var shouldDoBinding = true;
        var refConstrs = this.analyseReferentialConstraintScenario();
        if (refConstrs != null) {
            if (refConstrs.forcesCreateRelatedEntity) {
                linkToParentEntity = refConstrs;
                shouldDoBinding = false;
            }
            else {
                refConstrs.execute();
            }
        }
        if (shouldDoBinding) {
            var binding = this.analyseBindingScenario();
            if (binding != null) {
                binding.execute();
            }
        }
        return linkToParentEntity;
    };
    LinkingScenario.prototype.canCreateRelatedEntity = function () {
        if (this.partnerProperty == null) {
            return false;
        }
        return this.canUseCreateRelatedEntity
            && this.operation === BaseODataCruder_1.ODataCrudOperation.Create
            && this.partnerProperty.getType().isList();
    };
    LinkingScenario.prototype.analyseBindingScenario = function () {
        if (this.operation === BaseODataCruder_1.ODataCrudOperation.Delete) {
            return null;
        }
        if (this.bothPending()) {
            throw new Error(ErrorMessage_1.ErrorMessage.ODATA_LINKING_2_PENDING_ENTITIES_NOT_ALLOWED);
        }
        if (this.canBindFromSourceToTarget()) {
            return new BindingLink_1.BindingLink(this.navigationProperty, this.sourceEntity, this.targetEntity, this.operation);
        }
        else if (this.canBindFromTargetToSource()) {
            if (this.supportsBind) {
                return new BindingLink_1.BindingLink(this.navigationProperty, this.sourceEntity, this.targetEntity, this.operation);
            }
            else {
                return new BindingLink_1.BindingLink(this.partnerProperty, this.targetEntity, this.sourceEntity, this.operation);
            }
        }
        return null;
    };
    LinkingScenario.prototype.analyseReferentialConstraintScenario = function () {
        var arranged = this.arrange(this.sourceEntity, this.navigationProperty, this.targetEntity);
        if (arranged == null) {
            return null;
        }
        var dependantNavProp = arranged.dependantNavProp;
        var dependant = arranged.dependant;
        var principal = arranged.principal;
        var refLink = new ReferentialConstraintLink_1.ReferentialConstraintLink(dependantNavProp, dependant, principal, this.operation);
        if (!this.canCreateRelatedEntity()) {
            return refLink;
        }
        if (this.bothPending() || this.isRelationshipManyToMany()) {
            refLink.forcesCreateRelatedEntity = true;
        }
        return refLink;
    };
    LinkingScenario.prototype.canBindFromSourceToTarget = function () {
        return this.canBindFromNavProp(this.navigationProperty);
    };
    LinkingScenario.prototype.canBindFromTargetToSource = function () {
        if (this.partnerProperty == null) {
            return false;
        }
        return this.canBindFromNavProp(this.partnerProperty);
    };
    LinkingScenario.prototype.canBindFromNavProp = function (navProp) {
        if (this.associationHasReferentialConstraints()) {
            return this.isDependant(navProp);
        }
        else {
            return !navProp.getType().isList();
        }
    };
    LinkingScenario.prototype.associationHasReferentialConstraints = function () {
        return this.isDependant(this.navigationProperty) || this.isDependant(this.partnerProperty);
    };
    LinkingScenario.prototype.isDependant = function (navProp) {
        if (navProp == null) {
            return false;
        }
        return navProp.getReferentialConstraints().size() !== 0;
    };
    LinkingScenario.prototype.bothPending = function () {
        return ChangeSetManager_1.ChangeSetManager.isPending(this.targetEntity) && ChangeSetManager_1.ChangeSetManager.isPending(this.sourceEntity);
    };
    LinkingScenario.prototype.isRelationshipManyToMany = function () {
        if (this.partnerProperty == null) {
            return false;
        }
        return this.navigationProperty.getType().isList()
            && this.partnerProperty.getType().isList();
    };
    LinkingScenario.prototype.arrange = function (entity1, entity1NavProp, entity2) {
        if (!this.associationHasReferentialConstraints()) {
            return null;
        }
        if (!this.isDependant(entity1NavProp)) {
            if (this.supportsBind) {
                return {
                    dependant: entity2,
                    dependantNavProp: entity1NavProp,
                    principal: entity1,
                };
            }
            else {
                return {
                    dependant: entity2,
                    dependantNavProp: ODataHelper_1.ODataHelper.partnerPropertyFromEntity(entity1NavProp, entity2),
                    principal: entity1,
                };
            }
        }
        else {
            return {
                dependant: entity1,
                dependantNavProp: entity1NavProp,
                principal: entity2,
            };
        }
    };
    return LinkingScenario;
}());
exports.LinkingScenario = LinkingScenario;
