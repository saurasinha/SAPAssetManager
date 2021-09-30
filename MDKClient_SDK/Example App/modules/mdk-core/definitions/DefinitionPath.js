"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var DefinitionPath = (function () {
    function DefinitionPath(path) {
        if (!path || !DefinitionPath.isValid(path)) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_DEFINITION_PATH, path));
        }
        this._path = path;
        this._type = this._path.split('/')[DefinitionPath.pathToTypeIndex(path)];
    }
    DefinitionPath.pathToTypeIndex = function (path) {
        if (!path || path.startsWith('/')) {
            return 2;
        }
        else if (path.startsWith('./')) {
            return 1;
        }
        throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_CALL_PATHTOTYPEINDEX, path));
    };
    DefinitionPath.isValid = function (path) {
        var pathTypeIndex = DefinitionPath.pathToTypeIndex(path);
        return path && !!path.split('/')[pathTypeIndex] && DefinitionPath.types[path.split('/')[pathTypeIndex]];
    };
    Object.defineProperty(DefinitionPath.prototype, "path", {
        get: function () {
            return this._path;
        },
        set: function (path) {
            if (!DefinitionPath.isValid(path)) {
                throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.INVALID_DEFINITION_PATH, path));
            }
            this._path = path;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefinitionPath.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    DefinitionPath.types = {
        Actions: 'Actions',
        Extensions: 'Extensions',
        Globals: 'Globals',
        Images: 'Images',
        Pages: 'Pages',
        Rules: 'Rules',
        SDKStyles: 'Styles',
        Services: 'Services',
        Styles: 'Styles',
        i18n: 'i18n',
    };
    return DefinitionPath;
}());
exports.DefinitionPath = DefinitionPath;
;
