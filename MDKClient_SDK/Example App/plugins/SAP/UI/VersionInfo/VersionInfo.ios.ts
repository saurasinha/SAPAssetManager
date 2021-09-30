declare var VersionInfoBridge: any;

export class VersionInfo {
  public static getVersionInfo(): any {
    // temp. solution to solve the bug faced after nativescript 6.3.3 update  
    let nsDict = JSON.parse(VersionInfoBridge.getVersionInfo());
    return nsDict;
  }
  
  public static setVersionInfo(buildVersion: string) {
    VersionInfoBridge.setVersionInfo(buildVersion);
  }
}
