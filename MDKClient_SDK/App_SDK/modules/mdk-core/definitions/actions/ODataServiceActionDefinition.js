"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataServiceActionDefinition_1 = require("./DataServiceActionDefinition");
var ODataServiceActionDefinition = (function (_super) {
    __extends(ODataServiceActionDefinition, _super);
    function ODataServiceActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ODataServiceActionDefinition.prototype.getEntitySet = function () {
        return this.data.Target.EntitySet;
    };
    ODataServiceActionDefinition.prototype.getProperties = function () {
        return this.data.Properties;
    };
    ODataServiceActionDefinition.prototype.getForce = function () {
        return this.data.Force;
    };
    ODataServiceActionDefinition.prototype.getDefiningRequests = function () {
        return this.data.DefiningRequests;
    };
    ODataServiceActionDefinition.prototype.getHeaders = function () {
        return this.data.Headers;
    };
    return ODataServiceActionDefinition;
}(DataServiceActionDefinition_1.DataServiceActionDefinition));
exports.ODataServiceActionDefinition = ODataServiceActionDefinition;
;
