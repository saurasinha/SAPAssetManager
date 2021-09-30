"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceActionDefinition_1 = require("./ODataServiceActionDefinition");
var UploadOfflineODataActionDefinition = (function (_super) {
    __extends(UploadOfflineODataActionDefinition, _super);
    function UploadOfflineODataActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UploadOfflineODataActionDefinition.prototype.getUploadCategories = function () {
        return this.data.UploadCategories;
    };
    return UploadOfflineODataActionDefinition;
}(ODataServiceActionDefinition_1.ODataServiceActionDefinition));
exports.UploadOfflineODataActionDefinition = UploadOfflineODataActionDefinition;
;
