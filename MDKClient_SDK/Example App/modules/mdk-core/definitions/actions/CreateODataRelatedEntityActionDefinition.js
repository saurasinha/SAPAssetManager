"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceActionDefinition_1 = require("./ODataServiceActionDefinition");
var CreateODataRelatedEntityActionDefinition = (function (_super) {
    __extends(CreateODataRelatedEntityActionDefinition, _super);
    function CreateODataRelatedEntityActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    CreateODataRelatedEntityActionDefinition.prototype.getParent = function () {
        var property = 'Property';
        var entitySet = 'EntitySet';
        var queryOptions = 'QueryOptions';
        var readLink = 'ReadLink';
        var parent = {};
        if (this.data.ParentLink) {
            parent[property] = this.data.ParentLink.Property;
            parent[entitySet] = this.data.ParentLink.Target.EntitySet;
            parent[queryOptions] = this.data.ParentLink.Target.QueryOptions;
            parent[readLink] = this.data.ParentLink.Target.ReadLink;
        }
        return parent;
    };
    return CreateODataRelatedEntityActionDefinition;
}(ODataServiceActionDefinition_1.ODataServiceActionDefinition));
exports.CreateODataRelatedEntityActionDefinition = CreateODataRelatedEntityActionDefinition;
;
