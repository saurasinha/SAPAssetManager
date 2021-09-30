import { PressedItem } from '../Common/PressedItem';
import { CommonUtil } from '../ErrorHandling/CommonUtil';
import { messageType, write } from 'tns-core-modules/trace';

declare var OpenDocumentBridge: any;

export class OpenDocument {
  private static _instance: OpenDocument = new OpenDocument();

  private _openDocumentBridge = OpenDocumentBridge.new();

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
    return new Promise<string>((resolve, reject) => {
      return this._openDocumentBridge.openDocumentResolveReject(path, result => {
        write('open document succeeded', 'mdk.trace.core', messageType.log);
        resolve(result);
      }, (code, message, error) => {
        write(`open document with path failed: ${message}`, 'mdk.trace.core', messageType.error);
        reject(CommonUtil.toJSError(code, message, error));
      });
    });
  }

  public clearCache(): void {
    this._openDocumentBridge.clearCache();
  }
}
