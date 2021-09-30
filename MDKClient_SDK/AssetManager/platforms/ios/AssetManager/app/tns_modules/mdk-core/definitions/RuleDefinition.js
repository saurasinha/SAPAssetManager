"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("./BaseJSONDefinition");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var RuleDefinition = (function (_super) {
    __extends(RuleDefinition, _super);
    function RuleDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    RuleDefinition.prototype.getRuleFunction = function (sExportedName) {
        sExportedName = sExportedName || 'default';
        var fnExported = this._findExportedFunction(this.data, sExportedName);
        if (!fnExported || (typeof fnExported !== 'function')) {
            throw new Error(ErrorMessage_1.ErrorMessage.INVALID_CALL_GETRULEFUNCTION_RULE);
        }
        return fnExported;
    };
    RuleDefinition.prototype._findExportedFunction = function (oJSONObject, sExportedName) {
        var _this = this;
        var fnExported;
        Object.keys(oJSONObject).some(function (sKey) {
            if (sKey.toLowerCase() === sExportedName.toLowerCase()) {
                var oExport = oJSONObject[sKey];
                if (typeof oExport === 'function') {
                    fnExported = oExport;
                }
                else if (typeof oExport === 'object') {
                    fnExported = _this._findExportedFunction(oExport, Object.keys(oExport)[0]);
                }
            }
            if (fnExported) {
                return true;
            }
        });
        return fnExported;
    };
    return RuleDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.RuleDefinition = RuleDefinition;
;
