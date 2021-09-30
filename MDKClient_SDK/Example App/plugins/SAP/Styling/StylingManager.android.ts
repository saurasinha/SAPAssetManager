import * as fs from 'tns-core-modules/file-system';
import * as utils from 'tns-core-modules/utils/utils';

declare var com: any;
export class StylingManager {
  public static applySDKTheme(file: string) {
    const fullPath = fs.path.join(fs.knownFolders.temp().path, file);
    const _stylingHelperBridge = com.sap.mdk.client.ui.styling.StylingHelper.sharedInstance;
    const context = utils.ad.getApplicationContext();
    _stylingHelperBridge.calculateDensity(context);
    _stylingHelperBridge.applySDKTheme(fullPath);
  }
  public static applySDKBranding(file: string) {
    // TODO: When supported by SDK uncomment and test.
    // const _stylingHelperBridge = com.sap.mdk.client.ui.styling.StylingHelper.sharedInstance;
    // _stylingHelperBridge.applySDKBranding(file);
  }
} 
