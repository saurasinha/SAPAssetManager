"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("tns-core-modules/application");
var Context_1 = require("../../context/Context");
var DefaultExtension_1 = require("../../controls/DefaultExtension");
var FallbackExtension_1 = require("../../controls/FallbackExtension");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var fs = require("tns-core-modules/file-system");
var IDefinitionProvider_1 = require("../../definitions/IDefinitionProvider");
var ClientSettings_1 = require("../../storage/ClientSettings");
var ExtensionControlSource_1 = require("../../common/ExtensionControlSource");
var RequireUtil_1 = require("../../utils/RequireUtil");
var ExtensionBuilder = (function () {
    function ExtensionBuilder() {
        this._controlFolderName = 'controls';
        this._moduleName = '';
        this._controlName = '';
        this._className = '';
        this._defaultExtensionFolderName = 'Extensions';
        this._tsExtName = '.ts';
        this._jsExtName = '.js';
        this._extSource = ExtensionControlSource_1.ExtensionControlSource.Extension;
        this._retryCount = 0;
        this._maxRetryCount = 3;
    }
    ExtensionBuilder.createFallbackExtension = function (error, props, native) {
        if (native === void 0) { native = true; }
        var fallbackExtension = new FallbackExtension_1.FallbackExtension(error, native);
        fallbackExtension.initialize(props);
        return fallbackExtension;
    };
    ExtensionBuilder.prototype.setModule = function (moduleName) {
        this._moduleName = moduleName;
        return this;
    };
    ExtensionBuilder.prototype.setControl = function (controlName) {
        this._controlName = controlName;
        return this;
    };
    ExtensionBuilder.prototype.setClass = function (className) {
        this._className = className;
        return this;
    };
    ExtensionBuilder.prototype.build = function (def, binding, props) {
        this.setModule(def.module).setControl(def.control).setClass(def.class);
        var extension = this.createExtension();
        var context = new Context_1.Context(binding, extension);
        extension.context = context;
        props.context = context;
        extension.initialize(props);
        return extension;
    };
    ExtensionBuilder.prototype.createExtension = function () {
        if (!app.ios && !app.android) {
            console.log("WebClient unsupported feature: extension");
            return new FallbackExtension_1.FallbackExtension({ message: this._className }, {});
        }
        if (!this._className) {
            throw new Error(ErrorMessage_1.ErrorMessage.EXTENSION_CLASS_IS_NOT_PROVIDED);
        }
        if (!this._moduleName) {
            if (app.ios) {
                return new DefaultExtension_1.DefaultExtension(this._className);
            }
            else {
                throw new Error(ErrorMessage_1.ErrorMessage.EXTENSION_MODULE_NOT_EXIST);
            }
        }
        if (!this._controlName) {
            this._controlName = this._moduleName;
        }
        var extModule;
        var extClass;
        extModule = this._getExtensionModule();
        if (extModule) {
            extClass = extModule[this._className];
            while (!extClass && this._retryCount < this._maxRetryCount) {
                extModule = this._getExtensionModule();
                extClass = extModule[this._className];
                this._retryCount++;
            }
        }
        if (!extClass) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.EXTENSION_CLASS_NOT_EXIST, this._className, this._moduleName, this._maxRetryCount));
        }
        this._updateExtControlSourceMap(this._moduleName, this._extSource);
        var extension = new extClass();
        if (!this._isValidExtensionView(extension)) {
            throw new Error(ErrorMessage_1.ErrorMessage.EXTENSION_NOT_CORRECTLY_IMPLEMENT);
        }
        return extension;
    };
    ExtensionBuilder.prototype._getExtensionModule = function () {
        var extModule;
        extModule = this._getExtensionModuleFromDefinition();
        if (!extModule) {
            extModule = this._getExtensionModuleFromExtension();
        }
        return extModule;
    };
    ExtensionBuilder.prototype._getExtensionModuleFromDefinition = function () {
        var extModule;
        var modPath;
        var modPathWithoutFileExt;
        modPathWithoutFileExt = this._getDefinitionExtensionModulePath();
        modPath = modPathWithoutFileExt + this._tsExtName;
        extModule = IDefinitionProvider_1.IDefinitionProvider.instance().getExtensionDefinition(modPath);
        if (!extModule) {
            modPath = modPathWithoutFileExt + this._jsExtName;
            extModule = IDefinitionProvider_1.IDefinitionProvider.instance().getExtensionDefinition(modPath);
        }
        if (extModule) {
            this._extSource = ExtensionControlSource_1.ExtensionControlSource.Metadata;
        }
        return extModule;
    };
    ExtensionBuilder.prototype._getExtensionModuleFromExtension = function () {
        var extModule;
        var modPath = this._getPartialExtensionModulePath();
        if (app.ios || app.android) {
            extModule = RequireUtil_1.RequireUtil.require('./extensions/' + modPath);
            if (extModule) {
                this._extSource = ExtensionControlSource_1.ExtensionControlSource.Extension;
            }
        }
        return extModule;
    };
    ExtensionBuilder.prototype._getPartialExtensionModulePath = function () {
        return fs.path.join(this._moduleName, this._controlFolderName, this._controlName);
    };
    ExtensionBuilder.prototype._getDefinitionExtensionModulePath = function () {
        var appDef = IDefinitionProvider_1.IDefinitionProvider.instance().getApplicationDefinition();
        return fs.path.join(appDef.name, this._defaultExtensionFolderName, this._moduleName, this._controlFolderName, this._controlName);
    };
    ExtensionBuilder.prototype._isModuleExists = function (modulePath) {
        var checkPath = fs.path.join(fs.knownFolders.currentApp().path, modulePath.substr(3, modulePath.length - 3) + '.js');
        return fs.File.exists(checkPath);
    };
    ExtensionBuilder.prototype._isValidExtensionView = function (oView) {
        return (oView.view !== undefined && oView.initialize !== undefined);
    };
    ExtensionBuilder.prototype._updateExtControlSourceMap = function (moduleName, source) {
        var existingValue;
        var extSourceMap = ClientSettings_1.ClientSettings.getExtensionControlSourceMap();
        if (extSourceMap) {
            if (extSourceMap.hasOwnProperty(moduleName)) {
                existingValue = extSourceMap[moduleName];
            }
        }
        else {
            extSourceMap = {};
        }
        if (existingValue !== source) {
            extSourceMap[this._moduleName] = source;
            ClientSettings_1.ClientSettings.setExtensionControlSourceMap(extSourceMap);
        }
    };
    return ExtensionBuilder;
}());
exports.ExtensionBuilder = ExtensionBuilder;
