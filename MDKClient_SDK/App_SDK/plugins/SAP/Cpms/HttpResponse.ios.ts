import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import * as http from 'tns-core-modules/http';
import * as fsModule from 'tns-core-modules/file-system';
import { DataConverter } from '../Common/DataConverter';

export class HttpResponse {
  public static getHeaders(responseAndData): any {
    return DataConverter.fromNSDictToJavascriptObject(responseAndData.valueForKey('headers'));
  }

  public static getMimeType(responseAndData): any {
    const response = responseAndData.valueForKey('response');
    return response.MIMEType
  }

  public static getStatusCode(responseAndData): any {
    const response = responseAndData.valueForKey('response');
    return response.statusCode;
  }

  public static getData(responseAndData): any {
    return responseAndData.valueForKey('data');
  }

  public static toFile(responseAndData, url: string, destinationFilePath?: string): any {
    const fs: typeof fsModule = require('tns-core-modules/file-system');
    const fileName = url;
    if (!destinationFilePath) {
      destinationFilePath = fs.path.join(fs.knownFolders.documents().path,
                                         fileName.substring(fileName.lastIndexOf('/') + 1));
    }
    const data = responseAndData.valueForKey('data');
    if (data instanceof NSData) {
      data.writeToFileAtomically(destinationFilePath, true);
      return fs.File.fromPath(destinationFilePath);
    } else {
      throw new Error(ErrorMessage.format(ErrorMessage.FILE_SAVE_FAILED, destinationFilePath));
    }
  }

  public static toImage(responseAndData): any {
    const data = responseAndData.valueForKey('data');
    if (data instanceof NSData) {
      let uiImage = UIImage.imageWithData(data);
      return uiImage;
    }
  }

  public static toString(responseAndData, encoding?): string {
    const data = responseAndData.valueForKey('data');
    return NSDataToString(data, encoding)
  }
};

// Taken from http-request.ios.ts. See comment above.
function NSDataToString(data: any, encoding?: http.HttpResponseEncoding): string {
  let code = 4; // UTF8
  if (encoding === http.HttpResponseEncoding.GBK) {
    code = 1586;
  }
  return NSString.alloc().initWithDataEncoding(data, code).toString();
}