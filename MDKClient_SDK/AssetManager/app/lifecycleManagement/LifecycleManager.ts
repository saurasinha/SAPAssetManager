import * as timer from 'tns-core-modules/timer';
import * as fs from 'tns-core-modules/file-system';

import { Application } from '../Application';
import { LifecycleAppVersionInfo } from './LifecycleAppVersionInfo';
import { ClientSettings } from 'mdk-core/storage/ClientSettings';
import { CpmsSession } from 'mdk-sap';
import { ErrorMessage } from 'mdk-core/errorHandling/ErrorMessage';
import * as app from 'tns-core-modules/application';
import { Logger } from 'mdk-core/utils/Logger';
import { RequireUtil } from 'mdk-core/utils/RequireUtil';
import { fromObject, EventData } from 'tns-core-modules/data/observable/observable';
import * as TsWorker from 'nativescript-worker-loader!./AppExtractWorker';
import { HttpResponse } from 'mdk-sap';

enum States {
  Running, Paused, Pending, Stopped,
};

enum ActionStatus {
  Success, Failure,
}

export class LifecycleManager {
  public static getInstance(): LifecycleManager {
    return LifecycleManager._instance;
  }
  private static readonly VERSION_CHECK_PATH: string = '/odata/lcm/v1/Apps(AppId=\'';
  private static readonly VERSION_CHECK_PATH_SUFFIX: string = '\',Platform=\'AppModeler\')';
  private static readonly TEMP_SAVE_PATH = fs.path.join(fs.knownFolders.temp().path, 'lcmsDownload.zip');
  private static readonly ZIP_EXTRACT_PATH = fs.path.join(fs.knownFolders.temp().path, 'SeamExtract');
  private static readonly ACTION_STATUS_CHANGED = 'ActionStatusChanged';
  private static readonly APPUPDATE_NOT_ENABLED_OR_NO_REVISION = 'AppUpdate feature is not enabled or no new revision found.'

  // tslint:disable:max-line-length
  // For iOS, cannot use documents folder as user can modify that folder via iTunes/iExplorer,
  //  use a non-user accessible path
  // 'Use the Library subdirectories for any files you don’t want exposed to the user.
  // Your app should not use these directories for user data files.'
  // https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html
  // tslint:enable:max-line-length

  private static readonly BUNDLE_FILE_PREFIX = 'bundle';
  private static readonly BUNDLE_FILE_SUFFIX = 'js';
  private static readonly BUNDLE_SOURCEMAP_SUFFIX = 'js.map';

  private static _instance: LifecycleManager = new LifecycleManager();
  private _state: States = States.Stopped;
  private _timerId: number;
  private _appDownloadErrorCount: number = 0;
  private _statusModel: any;
  private _isActionRunning: Boolean = false;

  private constructor() {
    if (LifecycleManager._instance) {
      throw new Error(ErrorMessage.INITIALIZE_FAIL_SHOULD_USE_GETINSTANCE);
    }
    LifecycleManager._instance = this;
  }

  // Check version information right away
  public start() {
    if (!this.isStopped()) {
      // immediately start a version checker and clear previous timer
      timer.clearTimeout(this._timerId);
    }
    if (Application.isOnUpdateProcessing()) {
      return;
    }
    this.setState(States.Running);

    // Fire off version checker
    if (ClientSettings.isDemoMode()) {
      return;
    } else {
      Logger.instance.lcms.info('Starting LCMS Version Checking');
      return this.versionChecker();
    }
  }

  // Do not request version info on call, set a timer to check
  public startDelayed() {
    if (!this.isStopped()) {
      Logger.instance.lcms.info('LCMS Version Checking already running, ignoring request');
      return Promise.reject('LCMS Version Checking already running, ignoring request');
    }
    this.setState(States.Running);

    // Fire off timer to delay the version checker
    Logger.instance.lcms.info('Delay Starting LCMS Version Checking');
    this.startVersionCheckerTimer();
  }

  public stop(): void {
    timer.clearTimeout(this._timerId);
    this.setState(States.Stopped);
  }

  // Stop handling timeouts, but keep the timer ticking
  // If a timer does timeout, state will transistion to Pending
  public pause(): void {
    if (this.isPauseable()) {
      this.setState(States.Paused);
    } else {
      Logger.instance.lcms.info(`LCMS is not being paused as its current state is :|${this._state}|`);
    }
  }

  // Start handling timeouts
  // If a timeout occurred when paused (Pending state), initiate a version check by reseting
  public unPause(): void {
    if (this.isPending()) {
      this.restart();
    } else if (this.isPaused()) {
      this.setState(States.Running);
    }
  }

  public getCurrentDefinitionPath(): string {
    return this.getBundlePath(this.getCurrentVersion());
  }

  public getStagedDefinitionPath(): string {
    return this.getBundlePath(this.getStagedVersion());
  }

  public promoteStagedVersion(): boolean {
    const version = this.getStagedVersion();
    if (fs.File.exists(this.getBundlePath(version))) {
      if (version > this.getCurrentVersion()) {
        this.setCurrentVersion(version);
        this.cleanupPreviousVersions(version);
        return true;
      }
    }
    return false;
  }

  // Resets the LCMS versions/downloaded applications
  public reset(): void {
    this.stop();
    ClientSettings.resetApplicationVersions();
    this.cleanupPreviousVersions();
  }

  public executeAppUpdateCheck(): Promise<any> {
    this._statusModel = fromObject({});
    this._isActionRunning = true;
    let self = this;
    return new Promise((resolve, reject) => {
      self._statusModel.on(LifecycleManager.ACTION_STATUS_CHANGED, (args: EventData) => {
        if (args.object.get('ActionStatus') === ActionStatus.Success) {
          self._isActionRunning = false;
          resolve(args.object.get('Message'));
        }
        if (args.object.get('ActionStatus') === ActionStatus.Failure) {
          self._isActionRunning = false;
          reject(new Error(args.object.get('Message')));
        }
      });
      this.restart();
    });
  }

  private setAppUpdateStatus(status: ActionStatus , message: String) {
    if (this._isActionRunning) {
      this._statusModel.set('Message', message);
      this._statusModel.set('ActionStatus', status);
      let eventData: EventData = {
        eventName: LifecycleManager.ACTION_STATUS_CHANGED,
        object: this._statusModel,
      };
      this._statusModel.notify(eventData);
      this._statusModel.off(LifecycleManager.ACTION_STATUS_CHANGED);
    }
  }

  private isPauseable(): boolean {
    return this._state === States.Running;
  }

  private isPaused(): boolean {
    return this._state === States.Paused;
  }

  private isPending(): boolean {
    return this._state === States.Pending;
  }

  private isStopped(): boolean {
    return this._state === States.Stopped;
  }

  // Helper function, currently doesn't do any state transistion checking
  private setState(state: States): void {
    this._state = state;
  }

  private restart(): void {
    this.stop();
    this.start();
  }

  private cleanupPreviousVersions(version?: number) {
    let bundleFolder = fs.Folder.fromPath(this.getBundleFolder());
    let currentBundleFile = version ? this.getBundleFilename(version) : undefined;
    bundleFolder.eachEntity((entity) => {
      if (!entity.name.startsWith(currentBundleFile) &&
          entity.name.startsWith(LifecycleManager.BUNDLE_FILE_PREFIX) &&
          (entity.name.endsWith(LifecycleManager.BUNDLE_FILE_SUFFIX) ||
          entity.name.endsWith(LifecycleManager.BUNDLE_SOURCEMAP_SUFFIX))) {
        entity.remove()
          .then((result) => {
            Logger.instance.lcms.info(`Successfully removed old definition file ${entity.name}`);
          }, (error) => {
            const message: string = `Error while attempting to remove an old definition file ${entity.name} - ${error}`;
            Logger.instance.lcms.error(message);
          });
      }
      return true;
    });
  }

  private versionChecker = () => {
    if (Application.isOnUpdateProcessing()) {
      this.setState(States.Stopped);
      return;
    }
    if (this.isStopped()) {
      this.setState(States.Stopped);
      return Promise.resolve('LCMS Stopped due to Application updating');
    }
    if (this.isPaused() || this.isPending()) {
      this.setState(States.Pending);
      Logger.instance.lcms.log('Version checker request initiated when not active, queuing up request');
      return Promise.resolve('LCMS Paused, queuing version checker request');
    }

    const requestUrl: string = this.getVersionCheckUrl();
    const param = { 'header': { 'Accept': 'application/xml,application/atom+xml' }};
    let appId = ClientSettings.getAppId();
    Logger.instance.lcms.info(`Requesting LCMS version info: ${requestUrl} with header X-SMP-APPID: ${appId}`);
    timer.clearTimeout(this._timerId);
    return CpmsSession.getInstance().sendRequest(requestUrl, param)
    .then(responseAndData => {
      let statusCode = HttpResponse.getStatusCode(responseAndData);
      if (statusCode === 200) {
        Logger.instance.lcms.info(`Response Recieved, httpStatus: ${statusCode}`);
        this.handleVersionInfo(HttpResponse.toString(responseAndData));
      } else {
        const versionResponseText: string = 'LCMS GET Version Response Error Response Status:';
        const bodyText = `Body: ${HttpResponse.toString(responseAndData)}`;
        if (bodyText.indexOf('<code>NotFoundException</code>') > 0 || bodyText.indexOf('Failed to find a matched endpoint') > 0) {
          this.setAppUpdateStatus(ActionStatus.Success, LifecycleManager.APPUPDATE_NOT_ENABLED_OR_NO_REVISION);
        } else {
          this.setAppUpdateStatus(ActionStatus.Failure, `${versionResponseText} ${statusCode} | ${bodyText}`);
        }
        Logger.instance.lcms.error(`${versionResponseText} ${statusCode} | ${bodyText}`);
        this.startVersionCheckerTimer();
      }
    }, (error) => {
      this.setAppUpdateStatus(ActionStatus.Failure, `LCMS GET Version Response failed: ${error}`);
      Logger.instance.lcms.error(`LCMS GET Version Response failed: ${error}`);
      this.startVersionCheckerTimer();
    });
  }

  private startVersionCheckerTimer(): void {
    // Pick a random timeout between min and (min + random max)
    // The intent is to prevent multiple devices attempting to connect at the same timeout.
    // This will spread out the version checks.
    let timeout = ClientSettings.getLcmsVersionCheckMinPeriod() +
      Math.floor(Math.random() * ClientSettings.getLcmsVersionCheckRandomMax());
    this._timerId = timer.setTimeout(this.versionChecker, timeout);
    Logger.instance.lcms.info(`Setting LCMS Version Checker timer: ${timeout} | timer id: ${this._timerId}`);
  }

  private getVersionCheckUrl(): string {
    return ClientSettings.getCpmsUrl() + LifecycleManager.VERSION_CHECK_PATH +
      ClientSettings.getAppId() + LifecycleManager.VERSION_CHECK_PATH_SUFFIX;
  }

  private handleVersionInfo(verionInfoXml: string): void {
    Logger.instance.lcms.info(`Received Version Data: ${verionInfoXml}`);
    const latestVersionInfo = new LifecycleAppVersionInfo(verionInfoXml);
    if (!latestVersionInfo.revision || !latestVersionInfo.url) {
      Logger.instance.lcms.error('Invalid LCMS XML data, skipping upgrade');
      Logger.instance.lcms.info(`LCMS XML revision: ${latestVersionInfo.revision} | url: ${latestVersionInfo.url}`);
      this.setAppUpdateStatus(ActionStatus.Success, LifecycleManager.APPUPDATE_NOT_ENABLED_OR_NO_REVISION);
      this.startVersionCheckerTimer();
      return;
    }

    if (this.isUpgradeNeeded(latestVersionInfo.revision)) {
      this.upgradeApplication(latestVersionInfo);
    } else {
      const log: string = `Current version is already up to date: ${ClientSettings.getCurrentApplicationVersion()}`;
      this.setAppUpdateStatus(ActionStatus.Success, log);
      Logger.instance.lcms.info(log);
      this.startVersionCheckerTimer();
    }
  }

  private isUpgradeNeeded(latestLcmsVersion: number) {
    const latestVersionText: string = `LCMS latest version is: ${latestLcmsVersion}`;
    const currentVersionText: string = `Current Application Version: ${this.getCurrentVersion()}`;
    const stagedVersionText: string = `Staged Application Version: ${this.getStagedVersion()}`;
    Logger.instance.lcms.info(`${latestVersionText} | ${currentVersionText} | ${stagedVersionText}`);
    return latestLcmsVersion > this.getCurrentVersion();
  }

  private getCurrentVersion(): number {
    return ClientSettings.getCurrentApplicationVersion();
  }

  private setCurrentVersion(version: number) {
    return ClientSettings.setCurrentApplicationVersion(version);
  }

  private getStagedVersion(): number {
    return ClientSettings.getStagedApplicationVersion();
  }

  private upgradeApplication(version: LifecycleAppVersionInfo): Promise<void> {
    Logger.instance.lcms.info(`Upgrading application to version ${version.revision} via ${version.url}`);

    this._appDownloadErrorCount = 0;
    return this.appDownloader(version);
  }

  private appDownloader = (version: LifecycleAppVersionInfo) => {
    if (this.isPaused()) {
      this.setState(States.Pending);
      Logger.instance.lcms.log('appDownloader request initiated when not active, queuing up request');
      return Promise.resolve();
    }
    if (this.getStagedVersion() >= version.revision) {
      if (this._isActionRunning) {
        this.setAppUpdateStatus(ActionStatus.Success, `${version.revision}`);
      }
      const updatePromise = Application.update(this.getBundlePath(version.revision));
      this.startVersionCheckerTimer();
      return updatePromise;
    } else {
      return CpmsSession.getInstance().sendRequest(version.url)
      .then((responseAndData) => {
        let statusCode = HttpResponse.getStatusCode(responseAndData);
        Logger.instance.lcms.info(`App download response code: ${statusCode}`);
        
        this.updateApplication(HttpResponse.toFile(responseAndData, version.url, LifecycleManager.TEMP_SAVE_PATH), version.revision);
        this.startVersionCheckerTimer();

      }, (e) => {
        Logger.instance.lcms.error(`file downloaded error: ${e}`);
        this.setAppUpdateStatus(ActionStatus.Failure, `file downloaded error: ${e}`);
        if (this._appDownloadErrorCount < ClientSettings.getLcmsAppDownloadRetryCount()) {
          this._appDownloadErrorCount++;
          const errorCount: number = this._appDownloadErrorCount;
          const retryAttemptText: string = `Attempting to retry application download.  Retry ${errorCount}`;
          Logger.instance.lcms.error(`${retryAttemptText} of ${ClientSettings.getLcmsAppDownloadRetryCount()}`);
          this._timerId = timer.setTimeout( () => {
            this.appDownloader(version);
          }, ClientSettings.getLcmsAppDownloadRetryPeriod());
          const retryPeriod: number = ClientSettings.getLcmsAppDownloadRetryPeriod();
          const retryTimerText: string = `Setting LCMS App Download retry timer: ${retryPeriod}`;
          Logger.instance.lcms.info(`${retryTimerText} | timer id: ${this._timerId}`);
        } else {
          Logger.instance.lcms.error('Max application download retries failed.');
          this.startVersionCheckerTimer();
        }
      });
    }
  }

  private getBundleFolder(): string {
    return RequireUtil.getDefinitionBundleFolder();
  }

  private getBundlePath(version: number): string {
    return fs.path.join(this.getBundleFolder(),
        this.getBundleFilename(version));
  }

  private getBundleFilename(version: number): string {
    return LifecycleManager.BUNDLE_FILE_PREFIX +
        '.' + version + '.' + LifecycleManager.BUNDLE_FILE_SUFFIX;
  }

  private updateApplication(sourceFile: fs.File, newVersion: number): void {
    Logger.instance.lcms.info('Updating Application');
    Logger.instance.lcms.info(`sourceFile: ${sourceFile.path}`);

    let appExtractWorker = new TsWorker();

    appExtractWorker.onmessage = msg => {
      if (msg.data.err) {
        Logger.instance.lcms.error(`App extraction failed: ${msg.data.err}`);
        if (this._isActionRunning) {
          this.setAppUpdateStatus(ActionStatus.Failure, `App extraction failed: ${msg.data.err}`);
        }
      } else {
        if (this._isActionRunning) {
          this.setAppUpdateStatus(ActionStatus.Success, `${newVersion}`);
        }
        Logger.instance.lcms.info(`App extracted successfully with new version: ${newVersion}`);
        ClientSettings.setStagedApplicationVersion(newVersion);
        Application.update(this.getBundlePath(newVersion));
      }
    };

    appExtractWorker.onerror = err => {
      Logger.instance.lcms.error(`Uncaught app extraction failure: ${err}`);
      this.setAppUpdateStatus(ActionStatus.Failure, `Uncaught app extraction failure: ${err}`);
      return true;
    };

    appExtractWorker.postMessage({
      bundleDest: this.getBundlePath(newVersion),
      zipDestPath: LifecycleManager.ZIP_EXTRACT_PATH,
      zipSource: LifecycleManager.TEMP_SAVE_PATH,
    });
  }
}
