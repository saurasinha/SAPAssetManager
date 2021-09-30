"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDefinition_1 = require("./BaseDefinition");
var BaseJSONDefinition = (function (_super) {
    __extends(BaseJSONDefinition, _super);
    function BaseJSONDefinition(path, data) {
        var _this = _super.call(this, path, data) || this;
        _this._data = data;
        return _this;
    }
    Object.defineProperty(BaseJSONDefinition.prototype, "name", {
        get: function () {
            if (this.data._Name) {
                return this.data._Name;
            }
            else if (this._data._Type !== undefined) {
                this._data._Name = this.data._Type + '.' + BaseJSONDefinition.controlIdNumber++;
                return this._data._Name;
            }
            else {
                return _super.prototype.getName.call(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseJSONDefinition.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    BaseJSONDefinition.prototype.getName = function () {
        return this.name;
    };
    BaseJSONDefinition.controlIdNumber = 0;
    return BaseJSONDefinition;
}(BaseDefinition_1.BaseDefinition));
exports.BaseJSONDefinition = BaseJSONDefinition;
;
