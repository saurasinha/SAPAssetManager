"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceActionDefinition_1 = require("./ODataServiceActionDefinition");
var ReadODataServiceActionDefinition = (function (_super) {
    __extends(ReadODataServiceActionDefinition, _super);
    function ReadODataServiceActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    ReadODataServiceActionDefinition.prototype.getQueryOptions = function () {
        return this.data.Target.QueryOptions;
    };
    return ReadODataServiceActionDefinition;
}(ODataServiceActionDefinition_1.ODataServiceActionDefinition));
exports.ReadODataServiceActionDefinition = ReadODataServiceActionDefinition;
;
exports.default = ReadODataServiceActionDefinition;
