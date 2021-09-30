"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var IControlFactory = (function () {
    function IControlFactory() {
    }
    IControlFactory.setCreateFunction = function (func) {
        this._Create = func;
    };
    IControlFactory.Create = function (page, context, container, definition) {
        if (!this._Create) {
            throw new Error(ErrorMessage_1.ErrorMessage.ICONTROLFACTORY_CREATE_INVOKED_NOT_ASSIGNED);
        }
        return this._Create(page, context, container, definition);
    };
    return IControlFactory;
}());
exports.IControlFactory = IControlFactory;
