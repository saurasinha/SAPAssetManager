import { RestServiceUtil } from '../RestService/RestServiceUtil';

declare var com: any;
declare var org: any;
declare var android;
const foundationPkg = com.sap.mdk.client.foundation;

/**
 * Sends requests which can respond to OAuth challenges.
 * The normal http.request API in NativeScript can't be used for OAuth 
 * because it uses its own NSURLSession instead of an SAPURLSession.
 */
export class CpmsSession {

  public static createIPromiseCallback(args): any {
    return new foundationPkg.IPromiseCallback(args);
  }

  public static getInstance(): CpmsSession {
    return new CpmsSession();
  }

  private _bridge = foundationPkg.CPmsSession.getInstance();

  public initialize(params): void {
    // do nothing
  }

  public updateConnectionParams(params): void {
        // do nothing
  }

  public sendRequest(url: string, params?: object): Promise<any> {

    return new Promise((resolve, reject) => {
      let urlKey = 'url';
      let methodKey = 'method';
      let bodyKey = 'body';
      let headerKey = 'header';
      let reqParams = new org.json.JSONObject();
      reqParams.put(urlKey, url);
      let header = {}
      let isFormData = false;

      if (params) {
        if (params.hasOwnProperty(methodKey)) {
          reqParams.put(methodKey, params[methodKey]);
        }
        if (params.hasOwnProperty(headerKey)) {
          for (var key in params[headerKey]) {
            if (key.toLowerCase() === 'content-type' && params[headerKey][key] === 'multipart/form-data') {
              isFormData = true;
            } else {
              header[key] = params[headerKey][key];
            }
          }
        }
        if (params.hasOwnProperty(bodyKey)) {
          let body = params[bodyKey];
          if (Array.isArray(body) && isFormData) {
            body = RestServiceUtil.getAndroidFormData(body);
          } else if (body && (Array.isArray(body) || body.constructor === Object)) {
            header['Content-Type'] = 'application/json';
            body = JSON.stringify(body);
          }
          reqParams.put(bodyKey, body);
        }
        
        if (Object.keys(header).length > 0) {
          let headerParams = new org.json.JSONObject();
          Object.keys(header).forEach((key) => {
            headerParams.put(key, header[key]);
          });

          reqParams.put(headerKey, headerParams);
        }
      }

      let successHandler = CpmsSession.createIPromiseCallback({
        onResolve(responseAndData) {
          resolve(responseAndData);
        }});

      let failureHandler = CpmsSession.createIPromiseCallback({
        onRejected(code, message, error) {
          reject(error);
        }});

      return this._bridge.sendRequest(reqParams, successHandler, failureHandler);
    });
  }
};
