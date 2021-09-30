"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceActionDefinition_1 = require("./ODataServiceActionDefinition");
var UpdateODataEntityActionDefinition = (function (_super) {
    __extends(UpdateODataEntityActionDefinition, _super);
    function UpdateODataEntityActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    UpdateODataEntityActionDefinition.prototype.getLinks = function () {
        var property = 'Property';
        var entitySet = 'EntitySet';
        var queryOptions = 'QueryOptions';
        var links = [];
        if (this.data.UpdateLinks) {
            for (var _i = 0, _a = this.data.UpdateLinks; _i < _a.length; _i++) {
                var item = _a[_i];
                var updateLink = {};
                updateLink[property] = item.Property;
                updateLink[entitySet] = item.Target.EntitySet;
                updateLink[queryOptions] = item.Target.QueryOptions;
                links.push(updateLink);
            }
        }
        return links;
    };
    return UpdateODataEntityActionDefinition;
}(ODataServiceActionDefinition_1.ODataServiceActionDefinition));
exports.UpdateODataEntityActionDefinition = UpdateODataEntityActionDefinition;
;
