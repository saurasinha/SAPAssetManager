"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseFormCellObservable_1 = require("./BaseFormCellObservable");
var EventHandler_1 = require("../EventHandler");
var PressedItem_1 = require("../controls/PressedItem");
var Logger_1 = require("../utils/Logger");
var ExecuteSource_1 = require("../common/ExecuteSource");
var ButtonFormCellObservable = (function (_super) {
    __extends(ButtonFormCellObservable, _super);
    function ButtonFormCellObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ButtonFormCellObservable.prototype.cellValueChange = function (params) {
        var onPress = this._control.definition().data.OnPress;
        if (!onPress) {
            return Promise.resolve();
        }
        var button = params.get('Button');
        var nativescriptViewFacade = {
            android: undefined,
            ios: button,
        };
        if (params.get('domElement')) {
            nativescriptViewFacade = params.get('domElement');
        }
        this._control.page().context.clientAPIProps.pressedItem = PressedItem_1.PressedItem.WithControlView(nativescriptViewFacade);
        var context = this._control.context;
        var handler = new EventHandler_1.EventHandler();
        var source = new ExecuteSource_1.ExecuteSource(this._control.page().frame.id);
        handler.setEventSource(source, context);
        return handler.executeActionOrRule(onPress, context).catch(function (err) {
            Logger_1.Logger.instance.ui.error(err);
        });
    };
    return ButtonFormCellObservable;
}(BaseFormCellObservable_1.BaseFormCellObservable));
exports.ButtonFormCellObservable = ButtonFormCellObservable;
