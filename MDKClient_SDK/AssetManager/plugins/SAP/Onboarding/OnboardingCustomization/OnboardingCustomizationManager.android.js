"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataConverter_1 = require("../../Common/DataConverter");
var OnboardingCustomization = (function () {
    function OnboardingCustomization() {
    }
    OnboardingCustomization.configOnboardingPages = function (params) {
        var onboardingCustomizations = DataConverter_1.DataConverter.toJavaObject(params);
        com.sap.mdk.client.ui.onboarding.OnboardingCustomizationBridge.config(onboardingCustomizations);
    };
    return OnboardingCustomization;
}());
exports.OnboardingCustomization = OnboardingCustomization;
;
