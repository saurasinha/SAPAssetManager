import * as application from 'tns-core-modules/application';
import { DataConverter } from '../Common/DataConverter';
import { PressedItem } from '../Common/PressedItem';
import { CommonUtil } from '../ErrorHandling/CommonUtil';
import { messageType, write } from 'tns-core-modules/trace';

declare var com: any;
const foundationPkg = com.sap.mdk.client.foundation;
const openDocumentPkg = com.sap.mdk.client.ui.opendocument;

export class OpenDocument {
  private static _instance: OpenDocument = new OpenDocument();

  private _openDocumentBridge = null;
  
  public static getInstance(): OpenDocument {
    return OpenDocument._instance;
  }

  /**
   * Presents an OpenDocument with action items.
   * The path can be prefixed with 'res://', it means a resource file, which is embedded in the main bundle.
   * Or can be a full path, pointing to an existing file in the application's sandbox.
   * 
   * @param {PressedItem} pressedItem Item that was pressed to trigger the menu to be shown.
   * @param {string} path The document's path
   * @returns {Promise<string>} A Promise, fulfilled with an empty string on success or an error message
   */
  public openWithPath(pressedItem: PressedItem, path: string): Promise<string> {
    if (this._openDocumentBridge === null) {
      this._openDocumentBridge =
        new openDocumentPkg.OpenDocumentBridge(application.android.foregroundActivity);
    }
    let params = DataConverter.toJavaObject({ uri: path });

    return new Promise<string>((resolve, reject) => {
      let successHandler =
        new foundationPkg.IPromiseCallback({
          onResolve(result) {
            write('open document succeeded', 'mdk.trace.core', messageType.log);
            resolve(result);
          },
        });
      let failureHandler = new foundationPkg.IPromiseCallback({
        onRejected(code, message, error) {
          write(`open document with path failed: ${message}`, 'mdk.trace.core', messageType.error);
          reject(CommonUtil.toJSError(code, message, error));
        },
      });
      return this._openDocumentBridge.openDocument(params, successHandler, failureHandler);
    });
  }

  public clearCache(): void {
    if (this._openDocumentBridge === null) {
      this._openDocumentBridge =
        new openDocumentPkg.OpenDocumentBridge(application.android.foregroundActivity);
    }
    this._openDocumentBridge.clearCache();
    this._openDocumentBridge = null;
  }
}
