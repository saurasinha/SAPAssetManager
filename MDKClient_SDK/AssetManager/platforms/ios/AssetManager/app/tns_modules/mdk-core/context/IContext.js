"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var _fromPageFunction;
function setFromPageFunction(func) {
    _fromPageFunction = func;
}
exports.setFromPageFunction = setFromPageFunction;
function fromPage() {
    if (!_fromPageFunction) {
        throw new Error(ErrorMessage_1.ErrorMessage.ICONTEXT_INVOKED_NOT_ASSIGNED);
    }
    return _fromPageFunction();
}
exports.fromPage = fromPage;
