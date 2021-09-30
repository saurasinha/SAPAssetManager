import { Zip } from 'zip-plugin';
import * as fs from 'tns-core-modules/file-system';
import { Logger } from 'mdk-core/utils/Logger';
import { RequireUtil } from 'mdk-core/utils/RequireUtil';

export class AppExtractHelper {

  public static getInstance(): AppExtractHelper {
    return AppExtractHelper._instance;
  }

  private static _instance: AppExtractHelper = new AppExtractHelper();
  private zipDest: string;
  private zipSource: string;

  public extract(msg: any) {
    let error;
    this.zipSource = msg.data.zipSource;
    this.zipDest = msg.data.zipDestPath;
    const bundleDest: string = msg.data.bundleDest;
    Logger.instance.core.info('Unzip started: from ' + this.zipSource + ' to ' + this.zipDest);
    Zip.unzip(this.zipSource, this.zipDest);

        // Move the bundle to specified zipDestPat
    let bundleSourcePath = fs.path.join(this.zipDest, 'bundle.js');
    error = this._moveBundleFile(bundleSourcePath, bundleDest, (sContents) => {
      return RequireUtil.replaceMdkRequire(sContents);
    });

    if (!error) {
        this._moveBundleFile(fs.path.join(this.zipDest, 'bundle.js.map'), bundleDest + '.map');
    }

    return error;
  }

  public removeFolder() {
    // Remove extracted folder
    let extractedZipFolder = fs.Folder.fromPath(this.zipDest);
    extractedZipFolder.removeSync(e => {
      Logger.instance.core.error(`Failed to remove extracted zip folder: ${e}`);
    });
  }

  public removeDownloadedZipFile() {
    let zipSourceFile = fs.File.fromPath(this.zipSource);
    zipSourceFile.removeSync(e => {
      Logger.instance.core.error(`Failed to remove temp download zip: ${e}`);
    });
  }

  private _moveBundleFile(bundleSourcePath, bundleDest, cb?) {
    let error;
    const bundleExists = fs.File.exists(bundleSourcePath);
    let bundleSourceFile;
    let bundleSourceData: string;

    if (bundleExists) {
        bundleSourceFile = fs.File.fromPath(bundleSourcePath);
    } else {
        error = bundleSourcePath + ' does not exist';
    }

    if (!error) {
        bundleSourceData = bundleSourceFile.readTextSync(e => {
          error = e;
          Logger.instance.core.error(`App download file read failed: ${error}`);
        });
    }

    if (!error) {
        if (cb) {
            bundleSourceData = cb(bundleSourceData);
        }

        let bundleDesthFile = fs.File.fromPath(bundleDest);
        bundleDesthFile.writeTextSync(bundleSourceData, e => {
          error = e;
          Logger.instance.core.error(`App download file write failed: ${error}`);
        });
    }

    return error;
  }

}
