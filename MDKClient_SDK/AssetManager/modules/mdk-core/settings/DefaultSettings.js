"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SimpleSettings_1 = require("./SimpleSettings");
var app = require("tns-core-modules/application");
var DefaultSettings = (function (_super) {
    __extends(DefaultSettings, _super);
    function DefaultSettings() {
        var _this = _super.call(this, 'Default Values') || this;
        _this._settings = {
            ApplicationDisplayName: 'Safe Default Data',
            ConnectionSettings: {
                AllowCerts: false,
                AppId: 'safe.default.data',
                AuthorizationEndpointUrl: 'safe.default.data',
                ClientId: 'safe.default.data',
                RedirectUrl: 'safe.default.data',
                ServerUrl: (app.ios || app.android) ? 'safe.default.data' : '',
                ServiceTimeZoneAbbreviation: 'UTC',
                TokenUrl: 'safe.default.data',
            },
            DebugSettings: {
                Categories: [
                    'mdk.trace.action',
                    'mdk.trace.api',
                    'mdk.trace.app',
                    'mdk.trace.binding',
                    'mdk.trace.branding',
                    'mdk.trace.core',
                    'mdk.trace.i18n',
                    'mdk.trace.lcms',
                    'mdk.trace.logging',
                    'mdk.trace.odata',
                    'mdk.trace.onboarding',
                    'mdk.trace.profiling',
                    'mdk.trace.push',
                    'mdk.trace.settings',
                    'mdk.trace.targetpath',
                    'mdk.trace.ui',
                ],
                DebugODataProvider: false,
                TracingEnabled: false,
            },
            DefaultAppLanguage: 'en',
            DetailLabelViewText: '',
            EncryptDatabase: true,
            PasscodeTimeout: 0,
        };
        return _this;
    }
    DefaultSettings.prototype.setSettings = function (obj) {
    };
    DefaultSettings.prototype.setSetting = function (key, value) {
    };
    DefaultSettings.prototype.clear = function () {
    };
    DefaultSettings.prototype.setValue = function (obj, key, value) {
    };
    return DefaultSettings;
}(SimpleSettings_1.SimpleSettings));
exports.DefaultSettings = DefaultSettings;
;
