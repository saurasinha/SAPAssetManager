"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var IRestService = (function () {
    function IRestService() {
    }
    IRestService.setInstance = function (provider) {
        this._instance = provider;
    };
    IRestService.instance = function () {
        if (!this._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.CALLED_IRESTSERVICE_INSTANCE_BEFORE_ASSIGNED);
        }
        return this._instance;
    };
    IRestService.isValid = function () {
        return !!this._instance;
    };
    return IRestService;
}());
exports.IRestService = IRestService;
