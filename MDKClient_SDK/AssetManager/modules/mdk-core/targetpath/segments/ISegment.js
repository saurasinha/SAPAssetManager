"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ISegment = (function () {
    function ISegment(specifier, context) {
        this.specifier = specifier;
        this.context = context;
        if (!this.context) {
            throw new Error(ErrorMessage_1.ErrorMessage.SEGMENT_CONTEXT_CANNOT_UNDEFINED);
        }
        this.throwIfSpecifierRequiredButMissing();
    }
    ISegment.prototype.isSpecifierRequired = function () {
        return true;
    };
    ISegment.prototype.throwIfSpecifierRequiredButMissing = function () {
        if (this.isSpecifierRequired() && !this.specifier) {
            throw new Error(ErrorMessage_1.ErrorMessage.SEGMENT_SPECIFIER_CANNOT_UNDEFINED);
        }
    };
    return ISegment;
}());
exports.ISegment = ISegment;
