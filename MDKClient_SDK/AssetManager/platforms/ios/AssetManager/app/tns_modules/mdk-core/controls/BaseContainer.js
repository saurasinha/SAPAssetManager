"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseControl_1 = require("./BaseControl");
var LoadingIndicatorData_1 = require("../common/LoadingIndicatorData");
var mdk_sap_1 = require("mdk-sap");
var BaseContainer = (function (_super) {
    __extends(BaseContainer, _super);
    function BaseContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._loadingIndicatorData = new LoadingIndicatorData_1.LoadingIndicatorData();
        return _this;
    }
    BaseContainer.prototype.initialize = function (controlData) {
        _super.prototype.initialize.call(this, controlData);
    };
    BaseContainer.prototype._showLoadingIndicator = function () {
        if (this._loadingIndicatorData.enabled && this._loadingIndicatorData.indicatorId === -1) {
            this._loadingIndicatorData.indicatorId = mdk_sap_1.ActivityIndicator.instance.show(this._loadingIndicatorData.text);
        }
    };
    BaseContainer.prototype._dismissLoadingIndicator = function () {
        var id = this._loadingIndicatorData.indicatorId === -1 ? this.page().getLoadingIndicatorId() :
            this._loadingIndicatorData.indicatorId;
        if (this._loadingIndicatorData.enabled && id !== -1) {
            mdk_sap_1.ActivityIndicator.instance.dismissWithId(id);
        }
        this.page().setLoadingIndicatorData(null);
        this._loadingIndicatorData.indicatorId = -1;
    };
    BaseContainer.prototype._setLoadingIndicatorData = function (value) {
        this._loadingIndicatorData.enabled = value.Enabled ? true : false;
        this._loadingIndicatorData.text = value.Text ? value.Text : '';
        if (this.page().isPageHasLoadedOnce) {
            this._showLoadingIndicator();
        }
        else {
            this.page().setLoadingIndicatorData(this._loadingIndicatorData);
        }
    };
    return BaseContainer;
}(BaseControl_1.BaseControl));
exports.BaseContainer = BaseContainer;
