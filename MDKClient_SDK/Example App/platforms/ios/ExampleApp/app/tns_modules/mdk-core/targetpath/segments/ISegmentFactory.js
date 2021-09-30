"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ISegmentFactory = (function () {
    function ISegmentFactory() {
    }
    ISegmentFactory.setBuildFunction = function (func) {
        this._build = func;
    };
    ISegmentFactory.build = function (segment, context) {
        if (!this._build) {
            throw new Error(ErrorMessage_1.ErrorMessage.ISEGMENTFACTORY_BUILD_INVOKED_NOT_ASSIGNED);
        }
        return this._build(segment, context);
    };
    return ISegmentFactory;
}());
exports.ISegmentFactory = ISegmentFactory;
