"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var observable_array_1 = require("tns-core-modules/data/observable-array");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var utils = require("tns-core-modules/utils/utils");
var app = require("tns-core-modules/application");
function ContextToIndexable(context) {
    var binding = context.binding;
    var element = context.element;
    var indexable;
    if (binding instanceof observable_array_1.ObservableArray) {
        return binding;
    }
    else if (Array.isArray(binding)) {
        return {
            getItem: function (i) { return binding[i]; },
            length: binding.length,
        };
    }
    else if (app.ios && binding instanceof NSArray) {
        var binding2_1 = utils.ios.collections.nsArrayToJSArray(binding);
        return {
            getItem: function (i) { return binding2_1[i]; },
            length: binding2_1.length,
        };
    }
    else if (element && element.view && element.view() && element.view().items) {
        return element.view().items;
    }
    else {
        throw new Error(ErrorMessage_1.ErrorMessage.CONTEXT_NO_VALUE_INDEXED);
    }
}
exports.ContextToIndexable = ContextToIndexable;
