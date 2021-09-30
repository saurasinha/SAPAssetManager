declare var PassportBridge: any;

/**
 * Sends requests which can respond to OAuth challenges.
 * The normal http.request API in NativeScript can't be used for OAuth 
 * because it uses its own NSURLSession instead of an SAPURLSession.
 */
export class Passport {
  private static _bridge = PassportBridge.new();
  private static _componentNameKey = 'componentName';
  private static _actionKey = 'action';
  private static _traceFlagKey = 'traceFlag';
  private static _componentTypeKey = 'componentType';
  private static _prevComponentNameKey = 'prevComponentName';
  private static _userIdKey = 'userId';
  
  public static getHeaderValue(componentName: string, action: string, traceFlag: string, componentType: string, prevComponentName?: string, userId?: string): string {
    let params = {};
    params[this._componentNameKey] = componentName ? componentName : '';
    params[this._actionKey] = action ? action : '';
    params[this._traceFlagKey] = traceFlag ? traceFlag : '';
    params[this._componentTypeKey] = componentType ? componentType : '';
    params[this._prevComponentNameKey] = prevComponentName ? prevComponentName : '';
    params[this._userIdKey] = userId ? userId : '';
    return this._bridge.getHeaderValue(params);
  }
}