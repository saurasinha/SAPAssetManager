import { CommonUtil } from '../ErrorHandling/CommonUtil';
import { RestServiceUtil } from '../RestService/RestServiceUtil';

// ios native class
declare var CpmsSessionSwift: any;
declare var NSUUID: any;

/**
 * Sends requests which can respond to OAuth challenges.
 * The normal http.request API in NativeScript can't be used for OAuth 
 * because it uses its own NSURLSession instead of an SAPURLSession.
 */
export class CpmsSession {
  public static getInstance(): CpmsSession {
    if (!CpmsSession._instance) {
      CpmsSession._instance = new CpmsSession();
    }
    return CpmsSession._instance;
  }
  private static _instance;
  
  private _bridge = CpmsSessionSwift.sharedInstance;

  public initialize(params): void {
    return this._bridge.initializeWithParams(params);
  }

  public updateConnectionParams(params): void {
    return this._bridge.updateWithParams(params);
  }

  public sendRequest(url: string, params?: object): Promise<any> {

    return new Promise((resolve, reject) => {
      let urlKey = 'url';
      let methodKey = 'method';
      let bodyKey = 'body';
      let headerKey = 'header';
      let reqParams = {};
      reqParams[urlKey] = url;
      let header = {}
      let isFormData = false;

      if (params) {
        if (params.hasOwnProperty(methodKey)) {
          reqParams[methodKey] = params[methodKey];
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
            let boundry = 'R_' + NSUUID.alloc().init().UUIDString;
            header['Content-Type'] = 'multipart/form-data; boundary=' + boundry;
            body = RestServiceUtil.getIOSFormData(boundry, body);
          } else if (body && body.constructor === Object) {
            header['Content-Type'] = 'application/json';
            body = JSON.stringify(body);
          }
          reqParams[bodyKey] = body;
        }
      }
      reqParams[headerKey] = header;

      return this._bridge.sendRequestWithParamsResolveReject(reqParams, (responseAndData: NSDictionary<string, any>) => {
        // responseAndData is an object with NSHTTPURLResponse and NSData.
        // Create an object similar to NativeScript's
        // HttpResponse from this response so that it has the same API.
        // This adapts code from http-request.ios.ts.
        resolve(responseAndData);
      }, (code, message, error) => {
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }
};
