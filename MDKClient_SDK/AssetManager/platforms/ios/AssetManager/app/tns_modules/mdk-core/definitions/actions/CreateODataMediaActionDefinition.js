"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceActionDefinition_1 = require("./ODataServiceActionDefinition");
var CreateODataMediaActionDefinition = (function (_super) {
    __extends(CreateODataMediaActionDefinition, _super);
    function CreateODataMediaActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    CreateODataMediaActionDefinition.prototype.getMedia = function () {
        return this.data.Media;
    };
    return CreateODataMediaActionDefinition;
}(ODataServiceActionDefinition_1.ODataServiceActionDefinition));
exports.CreateODataMediaActionDefinition = CreateODataMediaActionDefinition;
;
