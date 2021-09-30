"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCell_1 = require("./BaseFormCell");
var ExtensionFormCellObservable_1 = require("../../observables/ExtensionFormCellObservable");
var ErrorMessage_1 = require("../../errorHandling/ErrorMessage");
var ExtensionBuilder_1 = require("../../builders/ui/ExtensionBuilder");
var ExtensionViewDefinition_1 = require("../../definitions/ExtensionViewDefinition");
var EventHandler_1 = require("../../EventHandler");
var IControl_1 = require("../IControl");
var PressedItem_1 = require("../PressedItem");
var Logger_1 = require("../../utils/Logger");
var app = require("tns-core-modules/application");
var ExecuteSource_1 = require("../../common/ExecuteSource");
var ExtensionFormCell = (function (_super) {
    __extends(ExtensionFormCell, _super);
    function ExtensionFormCell() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExtensionFormCell.prototype.setValue = function (value, notify, isTextValue) {
        if (this._extension && this._extension instanceof IControl_1.IControl) {
            return this._extension.setValue(value, notify, isTextValue);
        }
        return Promise.resolve();
    };
    ExtensionFormCell.prototype.getValue = function () {
        if (this._extension && this._extension instanceof IControl_1.IControl) {
            return this._extension.getValue();
        }
    };
    ExtensionFormCell.prototype.build = function () {
        var _this = this;
        return this.observable().bind().then(function (params) {
            return _super.prototype.build.call(_this);
        });
    };
    ExtensionFormCell.prototype.redraw = function () {
        this._extension = undefined;
        return _super.prototype.redraw.call(this);
    };
    ExtensionFormCell.prototype.onPress = function (cell, view) {
        var oView = view;
        if (this._extension !== undefined) {
            oView = this._extension.view();
        }
        this.page().context.clientAPIProps.pressedItem = PressedItem_1.PressedItem.WithControlView(oView);
        if (typeof this._extension.onPress === 'function') {
            this._extension.onPress();
        }
        if (this.definition().onPress !== undefined) {
            var handler = new EventHandler_1.EventHandler();
            var source = new ExecuteSource_1.ExecuteSource(this.page().frame.id);
            handler.setEventSource(source, this.context);
            return handler.executeActionOrRule(this.definition().onPress, this.context)
                .catch(function (e) { return Logger_1.Logger.instance.formCellExtension.log(e); });
        }
    };
    ExtensionFormCell.prototype.getView = function () {
        try {
            if (this._extension === undefined) {
                var obs = this.observable();
                var extensionDefinition = new ExtensionViewDefinition_1.ExtensionViewDefinition('', this.definition().data, this.definition());
                var extensionProps = Object.assign({}, this._props);
                extensionProps.definition = extensionDefinition;
                extensionProps.page = this.page();
                extensionProps.container = this;
                this._extension = new ExtensionBuilder_1.ExtensionBuilder().build(extensionDefinition, obs.binding, extensionProps);
                if (this._extension instanceof IControl_1.IControl) {
                    Logger_1.Logger.instance.formCellExtension.log('The extension control implements IControl.');
                }
                else {
                    Logger_1.Logger.instance.formCellExtension.error('The extension control doesn\'t implement IControl.');
                }
            }
            if (this._extension.viewIsNative()) {
                return this._extension.view();
            }
            else {
                if (app.ios) {
                    return this._extension.view().ios;
                }
                else if (app.android) {
                    throw new Error(ErrorMessage_1.ErrorMessage.EXTENSION_NATIVE_VIEW_REQUIRED);
                }
            }
        }
        catch (error) {
            return ExtensionBuilder_1.ExtensionBuilder.createFallbackExtension(error, { page: this.page() }).view();
        }
    };
    ExtensionFormCell.prototype.onNavigatedFrom = function (pageExists) {
        if (this._extension) {
            this._extension.onNavigatedFrom(pageExists);
        }
    };
    ExtensionFormCell.prototype.onNavigatedTo = function (initialLoading) {
        if (this._extension) {
            this._extension.onNavigatedTo(initialLoading);
        }
    };
    ExtensionFormCell.prototype.onNavigatingFrom = function (pageExists) {
        if (this._extension) {
            this._extension.onNavigatingFrom(pageExists);
        }
    };
    ExtensionFormCell.prototype.onNavigatingTo = function (initialLoading) {
        if (this._extension) {
            this._extension.onNavigatingTo(initialLoading);
        }
    };
    ExtensionFormCell.prototype.onPageLoaded = function (initialLoading) {
        if (this._extension) {
            this._extension.onPageLoaded(initialLoading);
        }
    };
    ExtensionFormCell.prototype.onPageUnloaded = function (pageExists) {
        if (this._extension) {
            this._extension.onPageUnloaded(pageExists);
        }
    };
    ExtensionFormCell.prototype.createObservable = function () {
        return new ExtensionFormCellObservable_1.ExtensionFormCellObservable(this, this.definition(), this.page());
    };
    return ExtensionFormCell;
}(BaseFormCell_1.BaseFormCell));
exports.ExtensionFormCell = ExtensionFormCell;
