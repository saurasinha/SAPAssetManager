"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceActionDefinition_1 = require("./ODataServiceActionDefinition");
var InitializeODataActionDefinition = (function (_super) {
    __extends(InitializeODataActionDefinition, _super);
    function InitializeODataActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InitializeODataActionDefinition.prototype.getProgressText = function () {
        return this.data.ProgressText;
    };
    return InitializeODataActionDefinition;
}(ODataServiceActionDefinition_1.ODataServiceActionDefinition));
exports.InitializeODataActionDefinition = InitializeODataActionDefinition;
;
