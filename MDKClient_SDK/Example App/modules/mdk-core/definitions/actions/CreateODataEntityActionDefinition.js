"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceActionDefinition_1 = require("./ODataServiceActionDefinition");
var CreateODataEntityActionDefinition = (function (_super) {
    __extends(CreateODataEntityActionDefinition, _super);
    function CreateODataEntityActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    CreateODataEntityActionDefinition.prototype.getLinks = function () {
        var property = 'Property';
        var entitySet = 'EntitySet';
        var queryOptions = 'QueryOptions';
        var links = [];
        if (this.data.CreateLinks) {
            for (var _i = 0, _a = this.data.CreateLinks; _i < _a.length; _i++) {
                var item = _a[_i];
                var createLink = {};
                createLink[property] = item.Property;
                createLink[entitySet] = item.Target.EntitySet;
                createLink[queryOptions] = item.Target.QueryOptions;
                links.push(createLink);
            }
        }
        return links;
    };
    return CreateODataEntityActionDefinition;
}(ODataServiceActionDefinition_1.ODataServiceActionDefinition));
exports.CreateODataEntityActionDefinition = CreateODataEntityActionDefinition;
;
