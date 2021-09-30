import { BundleDefinitionLoader } from './BundleDefinitionLoader';
import * as fs from 'tns-core-modules/file-system';

export class DemoBundleDefinitionLoader extends BundleDefinitionLoader {
  public static readonly DEMO_BUNDLE_PATH = fs.path.join(fs.knownFolders.currentApp().path, 'demo.js');

  public static validLocationExists() {
    // only check 'demo.js'
    // 'bundle.js' and 'default.js' are not used when in Demo mode
    return BundleDefinitionLoader.bundleExist(DemoBundleDefinitionLoader.DEMO_BUNDLE_PATH);
  }

  constructor(bundlePath: string) {
    super(bundlePath);
  }

  protected getBundleLocation(): string {
    return DemoBundleDefinitionLoader.DEMO_BUNDLE_PATH;
  }

  protected getDefaultLocation(): string {
    return undefined;  // For demo mode, do not use 'default.js'
  }
}
