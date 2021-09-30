"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientSettings_1 = require("../storage/ClientSettings");
var Logger_1 = require("./Logger");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var Tracer = (function () {
    function Tracer() {
        if (Tracer._instance) {
            throw new Error(ErrorMessage_1.ErrorMessage.INITIALIZE_FAIL_SHOULD_USE_GETINSTANCE);
        }
        Tracer._instance = this;
        this._profilingEnabled = ClientSettings_1.ClientSettings.getProfilingEnabled();
    }
    Object.defineProperty(Tracer, "instance", {
        get: function () {
            return Tracer._instance;
        },
        enumerable: true,
        configurable: true
    });
    Tracer.startTrace = function (message, category) {
        if (message === void 0) { message = ''; }
        if (category === void 0) { category = ''; }
        if (!Tracer.instance._profilingEnabled) {
            return -1;
        }
        var thisTraceId = Tracer._lastTraceId + 1;
        Tracer._lastTraceId += 1;
        Tracer._activeTraces[thisTraceId] = {
            category: category,
            message: message,
            start: Date.now(),
            traceId: thisTraceId,
        };
        return thisTraceId;
    };
    Tracer.commitTrace = function (traceId, message, category) {
        if (message === void 0) { message = ''; }
        if (category === void 0) { category = ''; }
        if (!Tracer.instance._profilingEnabled) {
            return;
        }
        var trace = Tracer._activeTraces[traceId];
        if (trace) {
            var end = Date.now();
            var durationInMS = end - trace.start;
            if (message) {
                trace.message = message;
            }
            if (category) {
                trace.category = category;
            }
            var logMessage = trace.category ? trace.category + " - " : 'Profiler - ';
            logMessage += trace.start + " - " + end + " - " + durationInMS + " ms - " + trace.message;
            Logger_1.Logger.instance.profiling.log(logMessage);
        }
    };
    Tracer._instance = new Tracer();
    Tracer._lastTraceId = 0;
    Tracer._activeTraces = {};
    return Tracer;
}());
exports.Tracer = Tracer;
