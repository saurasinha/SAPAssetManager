"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Popover = (function () {
    function Popover() {
    }
    Popover.getInstance = function () {
        return null;
    };
    Popover.prototype.show = function (data) {
        return Promise.resolve('');
    };
    Popover.prototype.dismiss = function (page) {
    };
    Popover.prototype.setPopoverAnchor = function (modalFrame, page, pressedItem) {
    };
    return Popover;
}());
exports.Popover = Popover;
;
