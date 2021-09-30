import { DataConverter } from '../../Common/DataConverter';

declare var com: any;

export class OnboardingCustomization {
  /**
   * This method is to customize/localize the strings used in Onboarding pages, such as
   * FUIPasscodeView, FUIPasscodeSetupView, FUITouchIDView and EULA
   * 
   * @param params customized strings
   * 
   */
  public static configOnboardingPages(params: any) {
    let onboardingCustomizations = DataConverter.toJavaObject(params);
    com.sap.mdk.client.ui.onboarding.OnboardingCustomizationBridge.config(onboardingCustomizations);
  }
};
