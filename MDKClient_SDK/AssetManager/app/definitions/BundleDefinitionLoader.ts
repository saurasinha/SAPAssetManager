import { IDefinitionLoader } from 'mdk-core/definitions/IDefinitionLoader';
import * as fs from 'tns-core-modules/file-system';
import * as PathToExportName from 'mdk-core/definitions/PathToExportName';
import { Logger } from 'mdk-core/utils/Logger';

export class BundleDefinitionLoader implements IDefinitionLoader {
  public static readonly BUNDLE_PATH = fs.path.join(fs.knownFolders.currentApp().path, 'bundle.js');
  public static readonly DEFAULT_BUNDLE_PATH = fs.path.join(fs.knownFolders.currentApp().path, 'default.js');

  public static bundleExist(bundlePath: string): boolean {
    return fs.File.exists(bundlePath);
  }

  public static validLocationExists() {
    // check for 'bundle.js' or 'default.js'
    // 'demo.js' is not used for Live mode
    return this.bundleExist(BundleDefinitionLoader.BUNDLE_PATH) ||
    this.bundleExist(BundleDefinitionLoader.DEFAULT_BUNDLE_PATH);
  }

  private mdkApplication = undefined;
  constructor(protected bundlePath: string) {
  }

  /**
   * This method is to return list localization resource files in definition keys that starts with _i18n_
   * Should not include properties files from _extensions_ folder
   * Sample: _i18n_i18n_de_properties, _i18n_i18n_en_gb_properties, _i18n_i18n_en_us_properties
   *
   */
  public getLocalizationResourceList(): any {
    if (this.mdkApplication) {
      // Filter for
      // - include /i18n/
      // - .properties is behind /i18n/
      // - exclude /Extensions/
      return Object.keys(this.mdkApplication)
      .filter(key => key.indexOf('_i18n_') >= 0 && key.indexOf('_properties') > key.indexOf('_i18n_') &&
       key.indexOf('_extensions_') < 0);
    }
  }
  public loadJsonDefinition(sPath) {
    return Promise.resolve(this.loadDefinition(sPath));
  }
  public loadJsDefinition(sPath) {
    return Promise.resolve(this.loadDefinition(sPath));
  }
  public loadDefinition(sApplicationReference) {
    if (!sApplicationReference) {
      // They just want the Application.app defintion
      sApplicationReference = './Application.app';
    }
    const sName = PathToExportName.pathToExportName(sApplicationReference,
      this.mdkApplication.version_mdkbundlerversion);
    return this.mdkApplication[sName];
  }

  // loads the given bundle, replacing the existing definitions.
  // it is important to note that reloading the same bundle file will
  // not load any new definitions, even if the file itself has changed.
  // any new definitions will need to be put into a file that has not been
  // require()d before in order for them to load in an running app.
  // side note: the old definitions will take up space in memory due to how
  // the javascript engine works, and will stay there until the app is
  // restarted.
  public loadBundle(): Promise<any> {
    let sourceBundlePath: string;
    let paths: string[] = [];

    if (this.bundlePath) {
      // Add the bundle path to the front of the list
      paths.push(this.bundlePath);
    }
    paths.push(this.getBundleLocation());
    paths.push(this.getDefaultLocation());

    for (let path of paths) {
      if (BundleDefinitionLoader.bundleExist(path)) {
        sourceBundlePath = path;
        break;
      }
    }

    if (!sourceBundlePath) {
      Logger.instance.definitionLoader.error(Logger.DEFINITIONLOADER_APPLICATION_DEFINITIONS_NOT_FOUND);
      this.mdkApplication = [];
      return Promise.resolve();
    }

    Logger.instance.definitionLoader.log(Logger.DEFINITIONLOADER_LOADING_DEFINITIONS, sourceBundlePath);

    this.mdkApplication = global.require(sourceBundlePath);

    return Promise.resolve();
  }

  protected getBundleLocation(): string {
    return BundleDefinitionLoader.BUNDLE_PATH;
  }

  protected getDefaultLocation(): string {
    return BundleDefinitionLoader.DEFAULT_BUNDLE_PATH;
  }
}
