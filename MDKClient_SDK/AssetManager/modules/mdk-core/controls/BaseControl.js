"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IControl_1 = require("./IControl");
var BaseObservable_1 = require("../observables/BaseObservable");
var Context_1 = require("../context/Context");
var BaseControl = (function (_super) {
    __extends(BaseControl, _super);
    function BaseControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BaseControl.prototype, "isBindable", {
        get: function () {
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseControl.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        set: function (parent) {
            this._parent = parent;
        },
        enumerable: true,
        configurable: true
    });
    BaseControl.prototype.bind = function () {
        return this.observable().bindValue(this.definition().getValue());
    };
    BaseControl.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
        var binding = controlData.context ? controlData.context.binding : null;
        this.context = new Context_1.Context(binding, this);
    };
    BaseControl.prototype.setContainer = function (container) {
        this._parent = container;
    };
    BaseControl.prototype.getContainer = function () {
        return this._parent;
    };
    BaseControl.prototype.setView = function (view) {
        this._view = view;
        this._view.id = this.definition().getName();
    };
    BaseControl.prototype.view = function () {
        return this._view;
    };
    BaseControl.prototype.observable = function () {
        this._observable = this._observable || this.createObservable();
        return this._observable;
    };
    BaseControl.prototype.setValue = function (value, notify, isTextValue) {
        return this.observable().setValue(value, notify, isTextValue);
    };
    BaseControl.prototype.onPageUnloaded = function (pageExists) {
        if (!pageExists) {
            this._view = undefined;
            this.observable().unregisterDataListeners();
        }
    };
    Object.defineProperty(BaseControl.prototype, "binding", {
        get: function () {
            return this.context.binding;
        },
        enumerable: true,
        configurable: true
    });
    BaseControl.prototype.createObservable = function () {
        return new BaseObservable_1.BaseObservable(this, this.definition(), this.page());
    };
    return BaseControl;
}(IControl_1.IControl));
exports.BaseControl = BaseControl;
;
