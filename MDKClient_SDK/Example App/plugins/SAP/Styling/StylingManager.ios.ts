declare var StylingHelperBridge: any;
export class StylingManager {
  public static applySDKTheme(file: string) {
    StylingHelperBridge.applySDKTheme(file);
  }
  public static applySDKBranding(file: string) {
    StylingHelperBridge.applySDKBranding(file);
  }
} 
