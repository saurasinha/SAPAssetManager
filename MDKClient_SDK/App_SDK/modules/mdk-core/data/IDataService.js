"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var IDataService = (function () {
    function IDataService() {
    }
    IDataService.setInstance = function (provider) {
        this._instance = provider;
    };
    IDataService.instance = function () {
        if (!this._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.CALLED_IDATASERVICE_INSTANCE_BEFORE_ASSIGNED);
        }
        return this._instance;
    };
    IDataService.isValid = function () {
        return !!this._instance;
    };
    return IDataService;
}());
exports.IDataService = IDataService;
