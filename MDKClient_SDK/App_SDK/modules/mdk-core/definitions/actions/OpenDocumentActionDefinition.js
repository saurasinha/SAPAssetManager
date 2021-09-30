"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var OpenDocumentActionDefinition = (function (_super) {
    __extends(OpenDocumentActionDefinition, _super);
    function OpenDocumentActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpenDocumentActionDefinition.prototype.getPath = function () {
        return this.data.Path;
    };
    return OpenDocumentActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.OpenDocumentActionDefinition = OpenDocumentActionDefinition;
;
