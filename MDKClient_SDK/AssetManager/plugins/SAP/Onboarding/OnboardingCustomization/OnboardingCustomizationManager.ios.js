"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OnboardingCustomization = (function () {
    function OnboardingCustomization() {
    }
    OnboardingCustomization.configOnboardingPages = function (params) {
        OnboardingCustomizationBridge.config(params);
    };
    return OnboardingCustomization;
}());
exports.OnboardingCustomization = OnboardingCustomization;
;
