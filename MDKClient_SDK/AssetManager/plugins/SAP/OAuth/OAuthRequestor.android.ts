import {DataConverter} from '../Common/DataConverter';
import * as application from 'tns-core-modules/application';

declare var com: any;
declare var java: any;
declare var org: any;

/**
 * Sends requests which can respond to OAuth challenges.
 * The normal http.request API in NativeScript can't be used for OAuth 
 * because it uses its own NSURLSession instead of an SAPURLSession.
 */
export class OAuthRequestor {
  public static getInstance(): OAuthRequestor {
    if (!OAuthRequestor._instance) {
      OAuthRequestor._instance = new OAuthRequestor();
    }
    return OAuthRequestor._instance;
  }
  private static _instance;
  
  private _bridge = null; // new com.sap.sapmdc.foundation.oauth.OAuthRequestorBridge(application.android.context);

  public initialize(params): void {
    let javaParams = DataConverter.toJavaObject(params);
    // return this._bridge.initialize(javaParams);
  }

  public updateConnectionParams(params): void {
    let javaParams = DataConverter.toJavaObject(params);
    // return this._bridge.updateConnectionParams(javaParams);
  }

  public sendRequest(url: string): Promise<any> {
    return Promise.resolve();

    // let javaParams = new org.json.JSONObject();
    // javaParams.put("url", url);

    // return new Promise((resolve, reject) => {
    //   return this._bridge.sendRequest(javaParams, new com.sap.sapmdc.common.SnowblindPromiseResolveBlock({
    //       onFinished: function(result) {
    //         resolve(result);
    //     }
    //   }), new com.sap.sapmdc.common.SnowblindPromiseRejectBlock({
    //     onError: function(message) {
    //       reject(message);
    //     }
    //   }));
    // });
  }
};
