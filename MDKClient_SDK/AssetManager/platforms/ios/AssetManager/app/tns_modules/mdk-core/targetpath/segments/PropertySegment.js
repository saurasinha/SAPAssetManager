"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ISegment_1 = require("./ISegment");
var Context_1 = require("../../context/Context");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var Logger_1 = require("../../utils/Logger");
var PropertySegment = (function (_super) {
    __extends(PropertySegment, _super);
    function PropertySegment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PropertySegment.prototype.resolve = function () {
        var target = this.context.binding;
        var property = this.findPropertyByName(this.specifier, target);
        if (property === undefined) {
            if (this.context.clientAPIProps && this.context.clientAPIProps.actionBinding) {
                property = this.findPropertyByName(this.specifier, this.context.clientAPIProps.actionBinding);
            }
        }
        if (property === undefined) {
            throw new Error(ErrorMessage_1.ErrorMessage.format(ErrorMessage_1.ErrorMessage.CANNOT_FIND_PROPERTY_WITH_NAME, this.specifier));
        }
        return new Context_1.Context(property);
    };
    PropertySegment.prototype.findPropertyByName = function (propertyName, element) {
        var value;
        if (element !== undefined && element[propertyName] !== undefined) {
            value = element[propertyName];
        }
        else if (typeof element === 'string') {
            try {
                var parsed = JSON.parse(element);
                if (parsed !== undefined && parsed[propertyName]) {
                    value = parsed[propertyName];
                }
            }
            catch (error) {
                var log_1 = "Tried to parse invalid JSON for property with name " + this.specifier + ": " + error;
                Logger_1.Logger.instance.targetPath.error(log_1);
            }
        }
        return value;
    };
    return PropertySegment;
}(ISegment_1.ISegment));
exports.PropertySegment = PropertySegment;
