"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var page_1 = require("tns-core-modules/ui/page");
var Context_1 = require("../context/Context");
var label_1 = require("tns-core-modules/ui/label");
var I18nHelper_1 = require("../utils/I18nHelper");
var Application_1 = require("../Application");
var ClientSettings_1 = require("../storage/ClientSettings");
var RestoreInfoPage = (function (_super) {
    __extends(RestoreInfoPage, _super);
    function RestoreInfoPage() {
        var _this = _super.call(this) || this;
        _this.actionBarHidden = true;
        _this.context = new Context_1.Context();
        _this.label = new label_1.Label();
        _this.label.text = I18nHelper_1.I18nHelper.localizeMDKText('restoring_app');
        _this.label.textAlignment = 'center';
        _this.label.fontSize = 20;
        return _this;
    }
    RestoreInfoPage.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.content = this.label;
        if (ClientSettings_1.ClientSettings.isDemoMode()) {
            return Application_1.Application.startApplication(null);
        }
    };
    return RestoreInfoPage;
}(page_1.Page));
exports.RestoreInfoPage = RestoreInfoPage;
;
