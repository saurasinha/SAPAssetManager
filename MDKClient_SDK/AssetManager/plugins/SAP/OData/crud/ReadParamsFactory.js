"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReadParams_1 = require("./readparams/ReadParams");
var QueryOptionsReadParams_1 = require("./readparams/QueryOptionsReadParams");
var ReadLinkReadParams_1 = require("./readparams/ReadLinkReadParams");
var CrudParamsHelper_1 = require("./CrudParamsHelper");
var ErrorMessage_1 = require("../../ErrorHandling/ErrorMessage");
var ReadParamsFactory = (function () {
    function ReadParamsFactory() {
    }
    ReadParamsFactory.createReadParams = function (params) {
        var entitySetName = params[ReadParamsFactory.ENTITYSETNAMEKEY];
        if (typeof entitySetName !== 'string' || entitySetName.length === 0) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.ODATA_ENTITY_NAME_NOT_FOUND, CrudParamsHelper_1.CrudParamsHelper.MALFORMEDPARAM, this.ENTITYSETNAMEKEY));
        }
        var queryOptions = params[ReadParamsFactory.QUERYOPTIONSKEY];
        var readLink = params[ReadParamsFactory.READLINKKEY];
        if (typeof queryOptions === 'string' && queryOptions.length !== 0) {
            return new QueryOptionsReadParams_1.QueryOptionsReadParams(entitySetName, queryOptions);
        }
        else if (typeof readLink === 'string' && readLink.length !== 0) {
            return new ReadLinkReadParams_1.ReadLinkReadParams(entitySetName, readLink);
        }
        else {
            return new ReadParams_1.ReadParams(entitySetName);
        }
    };
    ReadParamsFactory.ENTITYSETNAMEKEY = 'entitySet';
    ReadParamsFactory.QUERYOPTIONSKEY = 'queryOptions';
    ReadParamsFactory.READLINKKEY = 'readLink';
    return ReadParamsFactory;
}());
exports.ReadParamsFactory = ReadParamsFactory;
