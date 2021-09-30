"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventHandler_1 = require("../EventHandler");
var observable_1 = require("tns-core-modules/data/observable");
var PropertyTypeChecker_1 = require("../utils/PropertyTypeChecker");
var ValueResolver_1 = require("../utils/ValueResolver");
var DataEventHandler_1 = require("../data/DataEventHandler");
var ErrorMessage_1 = require("../errorHandling/ErrorMessage");
var DataHelper_1 = require("../utils/DataHelper");
var EMPTY_STRING = '';
var EMPTY_ARRAY = [];
var BaseObservable = (function (_super) {
    __extends(BaseObservable, _super);
    function BaseObservable(oControl, oControlDef, oPage) {
        var _this = _super.call(this) || this;
        _this._dataSubscriptions = [];
        _this._valueChangedByRuleOrAction = false;
        _this._valueChanged = false;
        _this._control = oControl;
        _this._page = oPage;
        _this._onValChangedEvent = oControlDef ? oControlDef.getOnValueChange() : undefined;
        _this.registerDataListeners(oControlDef);
        return _this;
    }
    Object.defineProperty(BaseObservable.prototype, "control", {
        get: function () {
            return this._control;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseObservable.prototype, "context", {
        get: function () {
            return this.control.context;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseObservable.prototype, "isPageVisible", {
        get: function () {
            return this._control.page().isCurrentPage;
        },
        enumerable: true,
        configurable: true
    });
    BaseObservable.prototype.onDataChanged = function (action, result) {
        if (this.isPageVisible) {
            this.redraw();
        }
        else {
            this._control.page().staleDataListeners.add(this);
        }
    };
    BaseObservable.prototype.redraw = function () {
        this._control.redraw();
    };
    BaseObservable.prototype.unregisterDataListeners = function () {
        var _this = this;
        this._dataSubscriptions.forEach(function (dataSub) {
            DataEventHandler_1.DataEventHandler.getInstance().unsubscribe(dataSub, _this);
        });
        this._dataSubscriptions = [];
    };
    BaseObservable.prototype.bindValue = function (data) {
        var _this = this;
        if (data === undefined || data === null) {
            return Promise.resolve(null);
        }
        if (!this._control || !this._control.definition()) {
            throw new Error(ErrorMessage_1.ErrorMessage.CONTROL_OR_DEFINITION_MISSING);
        }
        return this.setValue(data, false).then(function () {
            var oBindingOptions = {
                sourceProperty: '_target',
                targetProperty: _this.getBindingTarget(),
                twoWay: true,
            };
            _this._control.view().bind(oBindingOptions, _this);
        });
    };
    BaseObservable.prototype.getBindingTarget = function () {
        return BindingTarget.TEXT;
    };
    BaseObservable.prototype.formatValue = function (value) {
        return value;
    };
    BaseObservable.prototype.setValue = function (value, notify, isTextValue) {
        var _this = this;
        this._valueChanged = false;
        var oldValue = this._target;
        var promise = Promise.resolve(value);
        if (!isTextValue) {
            promise = ValueResolver_1.ValueResolver.resolveValue(value, this._control.context);
        }
        return promise.then(function (result) {
            var formattedValue = _this.formatValue(result);
            return _this._updateTarget(formattedValue).then(function () {
                _this.notifyPropertyChange('_target', _this._target);
                if (JSON.stringify(oldValue) !== JSON.stringify(_this._target)) {
                    _this._valueChanged = true;
                    _this._valueBeforeRuleOrAction = _this._target;
                    return _this.onValueChange(notify).then(function () {
                        if (JSON.stringify(_this._valueBeforeRuleOrAction) !== JSON.stringify(_this._target)) {
                            _this._valueChangedByRuleOrAction = true;
                        }
                        return _this._target;
                    });
                }
                else {
                    return Promise.resolve().then(function () { return _this._target; });
                }
            });
        });
    };
    BaseObservable.prototype.getValue = function () {
        return this._target;
    };
    Object.defineProperty(BaseObservable.prototype, "debugString", {
        get: function () {
            var pageDebugString = this._page.debugString;
            var controlName = this._control.definition().getName();
            return "Control: " + controlName + " - " + pageDebugString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseObservable.prototype, "parent", {
        get: function () {
            return this._control.parent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseObservable.prototype, "valueChanged", {
        get: function () {
            return this._valueChanged;
        },
        enumerable: true,
        configurable: true
    });
    BaseObservable.prototype.onValueChange = function (notify) {
        var promise = Promise.resolve(this._target);
        if (notify && this._onValChangedEvent) {
            promise = new EventHandler_1.EventHandler().executeActionOrRule(this._onValChangedEvent, this._control.context);
        }
        return promise;
    };
    BaseObservable.prototype.registerDataListeners = function (oControlDef) {
        var _this = this;
        var promises = [];
        var dataSubs = oControlDef.dataSubscriptions;
        if (PropertyTypeChecker_1.PropertyTypeChecker.isRule(dataSubs)) {
            promises.push(ValueResolver_1.ValueResolver.resolveValue(dataSubs, this._control.context).then(function (result) {
                _this._dataSubscriptions = _this._dataSubscriptions.concat(result);
            }));
        }
        else {
            dataSubs.forEach(function (dataSub) {
                promises.push(ValueResolver_1.ValueResolver.resolveValue(dataSub, _this._control.context).then(function (result) {
                    _this._dataSubscriptions.push(result);
                }));
            });
        }
        return Promise.all(promises).then(function () {
            _this._dataSubscriptions.forEach(function (dataSub) {
                DataEventHandler_1.DataEventHandler.getInstance().subscribe(dataSub, _this);
            });
        });
    };
    BaseObservable.prototype._updateTarget = function (value) {
        var _this = this;
        this._target = value;
        return this._resolveRule(value).then(function (valueFromRule) {
            if (value !== valueFromRule) {
                value = _this.formatValue(valueFromRule);
                _this._target = value;
            }
            _this._control.context.clientAPIProps.newControlValue = value;
        });
    };
    BaseObservable.prototype._resolveRule = function (value) {
        var _this = this;
        var promise = Promise.resolve(value);
        if (this._control.formatRule()) {
            promise = ValueResolver_1.ValueResolver.resolveValue(this._control.formatRule(), this.context, true, [ValueResolver_1.ValueType.Rule]).then(function (resolvedRule) {
                return new EventHandler_1.EventHandler().executeRule(resolvedRule, _this._control.context);
            });
        }
        return promise;
    };
    BaseObservable.prototype._readFromService = function (service) {
        return DataHelper_1.DataHelper.readFromService(service);
    };
    return BaseObservable;
}(observable_1.Observable));
exports.BaseObservable = BaseObservable;
var BindingTarget = (function () {
    function BindingTarget() {
    }
    BindingTarget.TEXT = 'text';
    return BindingTarget;
}());
exports.BindingTarget = BindingTarget;
