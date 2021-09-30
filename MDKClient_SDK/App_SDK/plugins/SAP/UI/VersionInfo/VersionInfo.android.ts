import * as application from 'tns-core-modules/application';

declare var com;
declare var android;

const foundationPkg = com.sap.mdk.client.foundation;

export class VersionInfo {
  public static getVersionInfo(): any {
    let info = foundationPkg.VersionInfoBridge.getVersionInfo(application.android.context);
    let json = JSON.parse(info);

    let result = new Object();
    let mergeResult = new Object();
    let item;
    let key;
    for (let i = 0; i < json.Root.length; i++) {
      item = json.Root[i];
      key = Object.keys(item);
      result[key] = item[key];
      mergeResult = Object.assign(mergeResult, result);
    }
    return mergeResult;
  }
  
  public static setVersionInfo(buildVersion: string) {
    foundationPkg.VersionInfoBridge.setDefinitionVersionInfo(application.android.context, buildVersion);
  }
}
