"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseObservable_1 = require("./BaseObservable");
var ObjectCellObservable = (function (_super) {
    __extends(ObjectCellObservable, _super);
    function ObjectCellObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ObjectCellObservable.prototype.bind = function (fromValue, context, bTwoWay) {
        return Promise.resolve();
    };
    ObjectCellObservable.prototype.formatValueInParams = function () {
        return this._target;
    };
    return ObjectCellObservable;
}(BaseObservable_1.BaseObservable));
exports.ObjectCellObservable = ObjectCellObservable;
