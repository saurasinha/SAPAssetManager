"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tracer_1 = require("../utils/Tracer");
var Logger_1 = require("../utils/Logger");
var appSettingsModule = require("tns-core-modules/application-settings");
var connectivityModule = require("tns-core-modules/connectivity");
var fileSystemModule = require("tns-core-modules/file-system");
var platformModule = require("tns-core-modules/platform");
var uiDialogsModule = require("tns-core-modules/ui/dialogs");
var utilsModule = require("tns-core-modules/utils/utils");
var applicationModule = require("tns-core-modules/application");
;
var Rule = (function () {
    function Rule(oRuleDefinition, _context) {
        this._context = _context;
        this.ruleFunction = oRuleDefinition.getRuleFunction(undefined);
        this.ruleName = oRuleDefinition.getName();
    }
    Rule._assignPreloadedModule = function (preloadedModule) {
        Rule.modules[preloadedModule.moduleContainer] = Rule.modules[preloadedModule.moduleContainer] || {};
        var moduleContainer = Rule.modules[preloadedModule.moduleContainer];
        var module = undefined;
        switch (preloadedModule.moduleName) {
            case 'appSettingsModule':
                module = appSettingsModule;
                break;
            case 'connectivityModule':
                module = connectivityModule;
                break;
            case 'fileSystemModule':
                module = fileSystemModule;
                break;
            case 'platformModule':
                module = platformModule;
                break;
            case 'uiDialogsModule':
                module = uiDialogsModule;
                break;
            case 'utilsModule':
                module = utilsModule;
                break;
            case 'applicationModule':
                module = applicationModule;
                break;
            default:
                Logger_1.Logger.instance.core.error(Logger_1.Logger.ERROR, "Rule execution runtime: invalid preloaded module request '" + preloadedModule.moduleName + "'");
        }
        if (module) {
            moduleContainer[preloadedModule.moduleName] = module;
        }
    };
    Rule.prototype.run = function () {
        var tid = Tracer_1.Tracer.startTrace("Executing rule " + this.ruleName, 'Rule');
        try {
            this._preloadRuleModules(this._context.clientAPI);
            return Promise.resolve(this.ruleFunction(this._context.clientAPI)).then(function (result) {
                Tracer_1.Tracer.commitTrace(tid);
                return result;
            });
        }
        catch (error) {
            Tracer_1.Tracer.commitTrace(tid);
            return Promise.reject(error);
        }
    };
    Rule.prototype._preloadRuleModules = function (clientAPI) {
        if (Rule.preloadedModules.length === 0) {
            Logger_1.Logger.instance.core.info("Rule execution runtime: loading preloaded modules");
            Rule.preloadedModules = this._preloadedRuleModules();
            Rule.preloadedModules.forEach(function (preloadedModule) {
                Rule._assignPreloadedModule(preloadedModule);
            });
            Logger_1.Logger.instance.core.info("Rule execution runtime: preloaded modules loaded");
        }
        Object.keys(Rule.modules).forEach(function (moduleContainer) {
            clientAPI[moduleContainer] = Rule.modules[moduleContainer];
        });
    };
    Rule.prototype._preloadedRuleModules = function () {
        return [
            {
                module: undefined,
                moduleContainer: 'nativescript',
                moduleName: 'appSettingsModule',
                modulePath: 'tns-core-modules/application-settings',
            },
            {
                module: undefined,
                moduleContainer: 'nativescript',
                moduleName: 'connectivityModule',
                modulePath: 'tns-core-modules/connectivity',
            },
            {
                module: undefined,
                moduleContainer: 'nativescript',
                moduleName: 'fileSystemModule',
                modulePath: 'tns-core-modules/file-system',
            },
            {
                module: undefined,
                moduleContainer: 'nativescript',
                moduleName: 'platformModule',
                modulePath: 'tns-core-modules/platform',
            },
            {
                module: undefined,
                moduleContainer: 'nativescript',
                moduleName: 'uiDialogsModule',
                modulePath: 'tns-core-modules/ui/dialogs',
            },
            {
                module: undefined,
                moduleContainer: 'nativescript',
                moduleName: 'utilsModule',
                modulePath: 'tns-core-modules/utils/utils',
            },
            {
                module: undefined,
                moduleContainer: 'nativescript',
                moduleName: 'applicationModule',
                modulePath: 'tns-core-modules/application',
            },
        ];
    };
    Rule.preloadedModules = [];
    Rule.modules = {};
    return Rule;
}());
exports.Rule = Rule;
;
