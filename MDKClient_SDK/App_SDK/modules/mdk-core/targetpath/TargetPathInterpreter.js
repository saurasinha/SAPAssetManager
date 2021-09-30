"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DefaultTargetPathErrorHandler_1 = require("./errorhandler/DefaultTargetPathErrorHandler");
var SegmentIterator_1 = require("./segments/SegmentIterator");
var ISegmentFactory_1 = require("./segments/ISegmentFactory");
var Logger_1 = require("../utils/Logger");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var TargetPathInterpreter = (function () {
    function TargetPathInterpreter(_context) {
        this._context = _context;
    }
    TargetPathInterpreter.prototype.registerErrorHandler = function (errorHandler) {
        this.errorHandler = errorHandler;
    };
    TargetPathInterpreter.prototype.getErrorHandler = function () {
        if (!this.errorHandler) {
            this.errorHandler = DefaultTargetPathErrorHandler_1.DefaultTargetPathErrorHandler.getInstance();
        }
        return this.errorHandler;
    };
    TargetPathInterpreter.prototype.evaluateTargetPathForContext = function (targetPath) {
        this.throwIfBadTargetPath(targetPath);
        var iterator = new SegmentIterator_1.SegmentIterator(targetPath);
        return this.onResolve(this._context, iterator);
    };
    TargetPathInterpreter.prototype.evaluateTargetPathForValue = function (targetPath) {
        var context = this.evaluateTargetPathForContext(targetPath);
        return context.element || context.binding;
    };
    TargetPathInterpreter.prototype.throwIfBadTargetPath = function (targetPath) {
        if (!targetPath) {
            var msg_1 = ErrorMessage_1.ErrorMessage.TARGET_PATH_CANNOT_BE_EMPTY;
            this.getErrorHandler().error(msg_1);
            throw new Error(msg_1);
        }
    };
    TargetPathInterpreter.prototype.onResolve = function (context, iterator) {
        var segmentString = iterator.next();
        Logger_1.Logger.instance.targetPath.log(Logger_1.Logger.TARGETPATHINTERPRETER_PROCESSING_PATH_SEGMENT, segmentString.value);
        var segment = ISegmentFactory_1.ISegmentFactory.build(segmentString.value, context);
        if (!segment) {
            throw new Error(ErrorMessage_1.ErrorMessage.FAILED_GET_NEXT_SEGMENT);
        }
        try {
            var resolvedSegment = segment.resolve();
            if (iterator.hasNext()) {
                return this.onResolve(resolvedSegment, iterator);
            }
            else {
                return resolvedSegment;
            }
        }
        catch (err) {
            this.getErrorHandler().error(err);
            throw (err);
        }
    };
    return TargetPathInterpreter;
}());
exports.TargetPathInterpreter = TargetPathInterpreter;
