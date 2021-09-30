"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseActionDefinition_1 = require("./BaseActionDefinition");
var MessageActionDefinition = (function (_super) {
    __extends(MessageActionDefinition, _super);
    function MessageActionDefinition(path, data) {
        return _super.call(this, path, data) || this;
    }
    Object.defineProperty(MessageActionDefinition.prototype, "message", {
        get: function () {
            return this.data.Message;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageActionDefinition.prototype, "okCaption", {
        get: function () {
            return this.data.OKCaption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageActionDefinition.prototype, "onOK", {
        get: function () {
            return this.data.OnOK;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageActionDefinition.prototype, "cancelCaption", {
        get: function () {
            return this.data.CancelCaption;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageActionDefinition.prototype, "onCancel", {
        get: function () {
            return this.data.OnCancel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageActionDefinition.prototype, "title", {
        get: function () {
            return this.data.Title;
        },
        enumerable: true,
        configurable: true
    });
    MessageActionDefinition.prototype.getMessage = function () {
        return this.message;
    };
    MessageActionDefinition.prototype.getOKCaption = function () {
        return this.okCaption;
    };
    MessageActionDefinition.prototype.getTitle = function () {
        return this.title;
    };
    return MessageActionDefinition;
}(BaseActionDefinition_1.BaseActionDefinition));
exports.MessageActionDefinition = MessageActionDefinition;
;
