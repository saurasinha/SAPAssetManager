import * as app from 'tns-core-modules/application';
import { Logger } from 'mdk-core/utils/Logger';

export class Paths {

  public static getOverridePath(): string {
    return Paths.getPrivateExternalStoragePath();
  }

  public static getSavedSettingsPath(): string {
    // change to internal storage due to threaten modeling
    return Paths.getPrivateInternalStoragePath();
  }

  private static getPrivateExternalStoragePath(): string {
    try {
      let overridePath: string = undefined;
      if (Paths.isExternalStorageMounted() || Paths.isExternalStorageMountedReadOnly()) {
        // tslint:disable-next-line:max-line-length
        Logger.instance.paths.info(Logger.PATHS_EXTERNAL_STORAGE_MOUNT_STATUS, Paths.isExternalStorageMounted(), Paths.isExternalStorageMountedReadOnly());
        
        let context = app.android.context;
        overridePath = context.getExternalFilesDir(null).getAbsolutePath();
        
        // uncomment for temp debugging as External Storage isn't always
        // Paths.printDebug();
      }
      return overridePath;
    } catch (error) {
      // Even with external storage being mounted, its possible for this to still throw and error
      // when attempting to access the private external storage.
      Logger.instance.paths.error(Logger.PATHS_FAILED_ACCESSS_EXTERNAL_STORAGE, error);

      return ``;
    }
  }

  private static getPrivateInternalStoragePath(): string {
    try {
      let overridePath: string = undefined;
      let context = app.android.context;
      overridePath = context.getFilesDir().getAbsolutePath();
      return overridePath;
    } catch (error) {
      // Even with external storage being mounted, its possible for this to still throw and error
      // when attempting to access the private external storage.
      Logger.instance.paths.error(Logger.PATHS_FAILED_ACCESSS_INTERNAL_STORAGE, error);

      return ``;
    }
  }

  // available at startup.
  private static printDebug(): void {
    let eSD = android.os.Environment.getExternalStorageDirectory();
    let eSPD = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS);
    let eSS = android.os.Environment.getExternalStorageState();
    let iESD = android.os.Environment.isExternalStorageEmulated();
    let iESR = android.os.Environment.isExternalStorageRemovable();
    Logger.instance.paths.log(`eSD: ${eSD} | eSPD: ${eSPD} | eSS: ${eSS} | iESD: ${iESD} | iESR: ${iESR}`);
    
    let context = app.android.context;

    let pPath = context.getExternalFilesDir(null).getAbsolutePath();
    Logger.instance.paths.log(`private external storage path: ${pPath}`);
  }

  private static isExternalStorageMounted(): boolean {
    return android.os.Environment.getExternalStorageState() === android.os.Environment.MEDIA_MOUNTED;
  }

  private static isExternalStorageMountedReadOnly(): boolean {
    return android.os.Environment.getExternalStorageState() === android.os.Environment.MEDIA_MOUNTED_READ_ONLY;
  }
}
