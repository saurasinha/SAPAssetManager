"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseDataBuilder_1 = require("../BaseDataBuilder");
var TypeConverter_1 = require("../../utils/TypeConverter");
var MessageDataBuilder = (function (_super) {
    __extends(MessageDataBuilder, _super);
    function MessageDataBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MessageDataBuilder.prototype.build = function () {
        return _super.prototype.build.call(this).then(function (data) {
            if (data.message !== undefined) {
                data.message = TypeConverter_1.TypeConverter.toString(data.message);
            }
            if (data.okButtonText !== undefined) {
                data.okButtonText = TypeConverter_1.TypeConverter.toString(data.okButtonText);
            }
            if (data.cancelButtonText !== undefined) {
                data.cancelButtonText = TypeConverter_1.TypeConverter.toString(data.cancelButtonText);
            }
            if (data.title !== undefined) {
                data.title = TypeConverter_1.TypeConverter.toString(data.title);
            }
            return data;
        });
    };
    MessageDataBuilder.prototype.setMessage = function (message) {
        var data = this.data;
        data.message = message;
        return this;
    };
    MessageDataBuilder.prototype.setOkButtonCaption = function (caption) {
        var data = this.data;
        data.okButtonText = caption;
        return this;
    };
    MessageDataBuilder.prototype.setCancelButtonCaption = function (caption) {
        var data = this.data;
        data.cancelButtonText = caption;
        return this;
    };
    MessageDataBuilder.prototype.setTitle = function (title) {
        var data = this.data;
        data.title = title;
        return this;
    };
    return MessageDataBuilder;
}(BaseDataBuilder_1.BaseDataBuilder));
exports.MessageDataBuilder = MessageDataBuilder;
