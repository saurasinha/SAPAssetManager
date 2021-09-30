"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ODataLinkCreator_1 = require("./ODataLinkCreator");
var BaseODataCruder_1 = require("../../BaseODataCruder");
var ODataLinkUpdater = (function (_super) {
    __extends(ODataLinkUpdater, _super);
    function ODataLinkUpdater(sourceEntitySetName, linkingParams) {
        return _super.call(this, sourceEntitySetName, linkingParams, BaseODataCruder_1.ODataCrudOperation.Update) || this;
    }
    return ODataLinkUpdater;
}(ODataLinkCreator_1.ODataLinkCreator));
exports.ODataLinkUpdater = ODataLinkUpdater;
