"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var IDefinitionProvider = (function () {
    function IDefinitionProvider() {
    }
    IDefinitionProvider.setInstance = function (provider) {
        this._instance = provider;
    };
    IDefinitionProvider.instance = function () {
        if (!this._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.CALLED_IDEFINITIONPROVIDER_INSTANCE_BEFORE_ASSIGNED);
        }
        return this._instance;
    };
    IDefinitionProvider.isDefinitionInstantiated = function () {
        return this._instance !== undefined && this._instance !== null;
    };
    return IDefinitionProvider;
}());
exports.IDefinitionProvider = IDefinitionProvider;
