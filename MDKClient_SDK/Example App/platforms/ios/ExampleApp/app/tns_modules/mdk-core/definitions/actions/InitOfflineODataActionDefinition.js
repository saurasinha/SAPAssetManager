"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceActionDefinition_1 = require("./ODataServiceActionDefinition");
var InitOfflineODataActionDefinition = (function (_super) {
    __extends(InitOfflineODataActionDefinition, _super);
    function InitOfflineODataActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InitOfflineODataActionDefinition.prototype.getProgressText = function () {
        return this.data.ProgressText;
    };
    return InitOfflineODataActionDefinition;
}(ODataServiceActionDefinition_1.ODataServiceActionDefinition));
exports.InitOfflineODataActionDefinition = InitOfflineODataActionDefinition;
;
