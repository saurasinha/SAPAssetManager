"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var Logger_1 = require("../../utils/Logger");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var DataServiceActionDefinition = (function (_super) {
    __extends(DataServiceActionDefinition, _super);
    function DataServiceActionDefinition() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataServiceActionDefinition.prototype.getService = function () {
        try {
            return this.data.Service || this.service;
        }
        catch (e) {
            Logger_1.Logger.instance.action.error(e);
            throw new Error(ErrorMessage_1.ErrorMessage.SERVICE_NAME_NOT_FOUND);
        }
    };
    Object.defineProperty(DataServiceActionDefinition.prototype, "service", {
        get: function () {
            if (this.data.Target) {
                return this.data.Target.Service;
            }
            else {
                return undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    return DataServiceActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.DataServiceActionDefinition = DataServiceActionDefinition;
;
