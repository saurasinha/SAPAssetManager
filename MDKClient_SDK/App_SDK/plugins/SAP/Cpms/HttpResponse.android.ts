import * as fsModule from 'tns-core-modules/file-system';
import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import { messageType, write } from 'tns-core-modules/trace';
import { DataConverter } from '../Common/DataConverter';
import { RestServiceUtil } from '../RestService/RestServiceUtil';

export class HttpResponse {
  public static getHeaders(responseAndData): any {
    return DataConverter.toJavaScriptObject(responseAndData.headers());
  }

  public static getMimeType(responseAndData): any {
    return responseAndData.contentType();
  }

  public static getStatusCode(responseAndData): any {
    return parseInt(responseAndData.statusCode(), 10);
  }
  
  public static getData(responseAndData): any {
    let contentType = responseAndData.contentType()
    if (RestServiceUtil.isTextContent(contentType)) {
      return responseAndData.getString();
    } else {
      return responseAndData.getBytes();
    }
  }

  public static toFile(responseAndData, url: string, destinationFilePath?: string): any {
    const fs: typeof fsModule = require('tns-core-modules/file-system');
    const fileName = url;
    if (!destinationFilePath) {
      destinationFilePath = fs.path.join(fs.knownFolders.documents().path,
                                         fileName.substring(fileName.lastIndexOf('/') + 1));
    }
    let file = fs.File.fromPath(destinationFilePath);
    try {
      const bytes = responseAndData.getBytes();
      file.writeSync(bytes, (err) => {
        write(err, 'mdk.trace.core', messageType.error);
        throw new Error(ErrorMessage.format(ErrorMessage.FILE_SAVE_FAILED, destinationFilePath));
      });
    } catch (err) {
      throw new Error(ErrorMessage.format(ErrorMessage.FILE_SAVE_FAILED, destinationFilePath));
    }
    return file;
  }

  public static toImage(responseAndData): any {
    const bytes = responseAndData.getBytes();
    let imageBitmap = android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
    return imageBitmap;
  }

  public static toString(responseAndData): string {
    return responseAndData.getString();
  }
};
