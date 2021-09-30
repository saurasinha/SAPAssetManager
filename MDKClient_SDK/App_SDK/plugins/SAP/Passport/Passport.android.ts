
declare var com;

const foundationPkg = com.sap.mdk.client.foundation;

export class Passport {
  public static getHeaderValue(componentName: string, action: string, traceFlag: string, componentType: string, prevComponentName?: string, userId?: string): string {
    return foundationPkg.PassportBridge.getHeaderValue(componentName, action, traceFlag, componentType, prevComponentName, userId);
  }
}
