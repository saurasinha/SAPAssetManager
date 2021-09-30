"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataServiceActionDefinition_1 = require("./ODataServiceActionDefinition");
var DownloadOfflineODataActionDefinition = (function (_super) {
    __extends(DownloadOfflineODataActionDefinition, _super);
    function DownloadOfflineODataActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(DownloadOfflineODataActionDefinition.prototype, "downloadKey", {
        get: function () {
            return this.data.DownloadKey;
        },
        enumerable: true,
        configurable: true
    });
    return DownloadOfflineODataActionDefinition;
}(ODataServiceActionDefinition_1.ODataServiceActionDefinition));
exports.DownloadOfflineODataActionDefinition = DownloadOfflineODataActionDefinition;
;
