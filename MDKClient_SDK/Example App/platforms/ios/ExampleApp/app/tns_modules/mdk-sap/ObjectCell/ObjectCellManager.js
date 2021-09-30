"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ObjectCell = (function () {
    function ObjectCell() {
    }
    ObjectCell.prototype.create = function () {
        return ObjectCellBridge.new().create();
    };
    ObjectCell.prototype.populate = function (params, args) {
        var cellKey = 'cell';
        if (!params || !args) {
            throw new Error('ObjectCellManager.ios.populate() invalid parameters');
        }
        params[cellKey] = args;
        ObjectCellBridge.new().populate(params);
    };
    return ObjectCell;
}());
exports.ObjectCell = ObjectCell;
;
