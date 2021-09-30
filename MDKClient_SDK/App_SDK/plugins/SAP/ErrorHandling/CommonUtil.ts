import * as app from 'tns-core-modules/application';

declare var NSError: any;
declare var java;

export class CommonUtil {
  public static toJSError(code: string, message: string, error: any): any {
    if (app.ios) {
      if (error && error instanceof NSError) {
        let jsError =  new Error(error.userInfo.valueForKey('message') ? error.userInfo.valueForKey('message') : message);
        return CommonUtil.formatJSError(jsError);
      } else {
        return new Error(message);
      }
    } else {
      if (error && error instanceof java.lang.Exception) {
        return new Error(error.getMessage());
      } else {
        return new Error(message);
      }
    }
  }

  public static formatJSError(jsError: any): any {
    if (jsError.message && jsError.message.indexOf('Error ') >= 0) {
      let idx = jsError.message.indexOf('Error ');
      let errCode: number = parseInt(jsError.message.slice(idx + 6, idx + 9), 10);
      if (errCode > 0) {
        // tslint:disable-next-line:no-string-literal
        jsError['responseCode'] = errCode;
        let idx1 = jsError.message.indexOf('{');
        let idx2 = jsError.message.lastIndexOf('}');
        if (idx2 > idx1) {
          // tslint:disable-next-line:no-string-literal
          jsError['responseBody'] = jsError.message.slice(idx1, idx2 + 1);
        } else {
          // check DataServiceException
          idx1 = jsError.message.indexOf('<message');
          idx2 = jsError.message.indexOf('</message>');
          if (idx2 > idx1) {
            let rawMessage = jsError.message.slice(idx1, idx2 + 10);
            idx1 = rawMessage.indexOf('>');
            idx2 = rawMessage.indexOf('</');
            // tslint:disable-next-line:no-string-literal
            jsError['responseBody'] = 'message: ' + rawMessage.slice(idx1 + 1, idx2);
          } else {
            // default value, if error code is set
            // tslint:disable-next-line:no-string-literal
            jsError['responseBody'] = jsError.message
          }
        }
      }
    }
    return jsError;
  }

  public static formatOfflineError(jsError: any): any {
    if (jsError.message) {
      let errCode;
      let idx = jsError.message.indexOf('HTTP code, ');
      if (idx > 0){
        errCode = parseInt(jsError.message.slice(idx + 11, idx + 14), 10);
      }
      if (errCode > 0 || jsError.message.indexOf('SERVER_SYNCHRONIZATION_ERROR') > 0) {
        // format offline Sychronization Error
        jsError['responseCode'] = errCode > 0 ? errCode : 500;
        jsError['responseBody'] = jsError.message;
      }
    }
    return jsError;
  }
};
