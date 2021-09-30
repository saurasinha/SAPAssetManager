"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IActionFactory_1 = require("./actions/IActionFactory");
var BaseActionDefinition_1 = require("./definitions/actions/BaseActionDefinition");
var IContext_1 = require("./context/IContext");
var IDefinitionProvider_1 = require("./definitions/IDefinitionProvider");
var Rule_1 = require("./rules/Rule");
var RuleDefinition_1 = require("./definitions/RuleDefinition");
var Logger_1 = require("./utils/Logger");
var ValueResolver_1 = require("./utils/ValueResolver");
var EventHandler = (function () {
    function EventHandler() {
    }
    EventHandler.prototype.executeAction = function (sActionPath) {
        var _this = this;
        return ValueResolver_1.ValueResolver.resolveValue(sActionPath).then(function (resolvedActionPath) {
            return _this._resolveHandler(resolvedActionPath).then(function (handler) {
                if (handler instanceof BaseActionDefinition_1.BaseActionDefinition) {
                    return _this._executeAction(handler);
                }
                return Promise.reject("Invalid call to EventHandler.executeAction " + resolvedActionPath + " is not an action");
            });
        });
    };
    EventHandler.prototype.executeRule = function (sRulePath, context) {
        var _this = this;
        return this._resolveHandler(sRulePath).then(function (handler) {
            if (handler instanceof RuleDefinition_1.RuleDefinition) {
                return _this._executeRule(handler, context);
            }
            return Promise.reject("Invalid call to EventHandler.executeRule " + sRulePath + " is not a rule");
        });
    };
    EventHandler.prototype.executeActionOrRule = function (sActionOrRulePath, context) {
        var _this = this;
        return ValueResolver_1.ValueResolver.resolveValue(sActionOrRulePath, context, true, [ValueResolver_1.ValueType.Rule]).then(function (resolvedActionOrRulePath) {
            return _this._resolveHandler(resolvedActionOrRulePath).then(function (handler) {
                if (handler instanceof BaseActionDefinition_1.BaseActionDefinition) {
                    return _this._executeAction(handler);
                }
                else if (handler instanceof RuleDefinition_1.RuleDefinition) {
                    return _this._executeRule(handler, context);
                }
                else {
                    var message = "Invalid call to EventHandler.executeActionOrRule " + resolvedActionOrRulePath + " is not a rule or action";
                    return Promise.reject(message);
                }
            }).then(function (result) {
                IContext_1.fromPage().resetClientAPIProps();
                if (context.clientAPIProps && context.clientAPIProps.eventSource) {
                    delete context.clientAPIProps.eventSource;
                }
                return result;
            });
        });
    };
    EventHandler.prototype.executeActionOrRuleSync = function (sActionOrRulePath, context) {
        var handler = this._resolveHandlerSync(sActionOrRulePath);
        var promise = Promise.resolve();
        if (handler instanceof BaseActionDefinition_1.BaseActionDefinition) {
            promise = this._executeAction(handler);
        }
        else if (handler instanceof RuleDefinition_1.RuleDefinition) {
            promise = this._executeRule(handler, context);
        }
        else {
            var message = "Invalid call to EventHandler.executeActionOrRule " + sActionOrRulePath + " is not a rule or action";
            return Promise.reject(message);
        }
        return promise.then(function (result) {
            IContext_1.fromPage().resetClientAPIProps();
            if (context.clientAPIProps && context.clientAPIProps.eventSource) {
                delete context.clientAPIProps.eventSource;
            }
            return result;
        });
    };
    EventHandler.prototype.setEventSource = function (source, context) {
        this._eventSource = source;
        if (context && context.clientAPIProps) {
            context.clientAPIProps.eventSource = source;
        }
    };
    EventHandler.prototype.getEventSource = function () {
        return this._eventSource;
    };
    EventHandler.prototype._executeAction = function (definition) {
        var action = IActionFactory_1.IActionFactory.Create(definition);
        if (this._eventSource) {
            action.source = this._eventSource;
        }
        return IActionFactory_1.IActionFactory.CreateActionRunner(definition).run(action);
    };
    EventHandler.prototype._executeRule = function (oRuleDefinition, context) {
        if (this._eventSource && context.clientAPIProps) {
            context.clientAPIProps.eventSource = this._eventSource;
        }
        return new Rule_1.Rule(oRuleDefinition, context).run();
    };
    EventHandler.prototype._resolveHandler = function (sActionOrRulePath) {
        try {
            return IDefinitionProvider_1.IDefinitionProvider.instance().getDefinition(sActionOrRulePath);
        }
        catch (error) {
            Logger_1.Logger.instance.core.error(error);
            var reason = "Invalid call to EventHandler.executeActionOrRule '" + sActionOrRulePath + "' is not a rule or action";
            return Promise.reject(reason);
        }
    };
    EventHandler.prototype._resolveHandlerSync = function (sActionOrRulePath) {
        try {
            return IDefinitionProvider_1.IDefinitionProvider.instance().getDefinitionSync(sActionOrRulePath);
        }
        catch (error) {
            Logger_1.Logger.instance.core.error(error);
            var reason = "Invalid call to EventHandler.executeActionOrRule '" + sActionOrRulePath + "' is not a rule or action";
            return Promise.reject(reason);
        }
    };
    return EventHandler;
}());
exports.EventHandler = EventHandler;
