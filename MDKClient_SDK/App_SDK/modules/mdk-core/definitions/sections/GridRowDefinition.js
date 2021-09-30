"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseJSONDefinition_1 = require("../BaseJSONDefinition");
var GridLayoutDefinition_1 = require("./GridLayoutDefinition");
var GridRowItemDefinition_1 = require("./GridRowItemDefinition");
var GridRowDefinition = (function (_super) {
    __extends(GridRowDefinition, _super);
    function GridRowDefinition(path, data, parent) {
        var _this = _super.call(this, path, data) || this;
        _this.parent = parent;
        _this.layout = undefined;
        _this.items = undefined;
        if (_this.data.Layout) {
            _this.layout = new GridLayoutDefinition_1.GridLayoutDefinition(path, _this.data.Layout, _this);
        }
        if (Array.isArray(_this.data.Items)) {
            _this.items = _this.data.Items.map(function (itemData) {
                return new GridRowItemDefinition_1.GridRowItemDefinition(path, itemData, _this);
            });
        }
        return _this;
    }
    Object.defineProperty(GridRowDefinition.prototype, "accessoryType", {
        get: function () {
            return this.data.AccessoryType || this.defaultAccessoryType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowDefinition.prototype, "defaultAccessoryType", {
        get: function () {
            return 'none';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowDefinition.prototype, "onAccessoryButtonPress", {
        get: function () {
            return this.data.OnAccessoryButtonPress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridRowDefinition.prototype, "onPress", {
        get: function () {
            return this.data.OnPress;
        },
        enumerable: true,
        configurable: true
    });
    return GridRowDefinition;
}(BaseJSONDefinition_1.BaseJSONDefinition));
exports.GridRowDefinition = GridRowDefinition;
