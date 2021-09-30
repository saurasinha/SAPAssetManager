"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavigationActionDefinition_1 = require("./NavigationActionDefinition");
var FilterActionDefinition = (function (_super) {
    __extends(FilterActionDefinition, _super);
    function FilterActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    FilterActionDefinition.prototype.getFilterable = function () {
        return this.data.Filterable;
    };
    FilterActionDefinition.prototype.isModalPage = function () {
        return true;
    };
    return FilterActionDefinition;
}(NavigationActionDefinition_1.NavigationActionDefinition));
exports.FilterActionDefinition = FilterActionDefinition;
