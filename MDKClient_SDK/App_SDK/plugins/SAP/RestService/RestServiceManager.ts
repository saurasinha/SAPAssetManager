import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { CpmsSession } from '../Cpms/CpmsSession';
import { HttpResponse } from '../Cpms/HttpResponse';
import { RestServiceUtil } from './RestServiceUtil';

declare var java: any;
declare var NSUUID: any;

export class RestServiceManager {
  public sendRequest(params): Promise<any> {
    if (!params) {
      throw new Error(ErrorMessage.format(ErrorMessage.FUNCTION_HAS_NULL_PARAMETERS, 'RestServiceManager.sendRequest()'));
    }

    return new Promise((resolve, reject) => {
      let url = params.serviceUrl + params.path;
      let requestProperties = params.requestProperties;
      let method = requestProperties.Method;
      let apiHeaders = requestProperties.Headers;
      let body = requestProperties.Body;
      let serviceHeaders = params.headers;

      let header = {};
      if (apiHeaders) {
        Object.assign(header, apiHeaders);
      }
      if (serviceHeaders) {
        Object.assign(header, serviceHeaders);
      }

      return CpmsSession.getInstance().sendRequest(url, {method, header, body}).then((responseAndData) => {
        let mimeType = HttpResponse.getMimeType(responseAndData);
        let statusCode = HttpResponse.getStatusCode(responseAndData);

        if (statusCode >= 300) {
          let error = new Error(HttpResponse.toString(responseAndData));
          // tslint:disable-next-line:no-string-literal
          error['responseCode'] = statusCode;
          // tslint:disable-next-line:no-string-literal
          error['responseBody'] = error.message;
          return reject(error);
        } else {
          if (RestServiceUtil.isTextContent(mimeType)) {
            return resolve(HttpResponse.toString(responseAndData));
          } else {
            return resolve(HttpResponse.getData(responseAndData));
          }
        }
      }).catch(error => {
        return reject(error);
      });
    });
  }
};