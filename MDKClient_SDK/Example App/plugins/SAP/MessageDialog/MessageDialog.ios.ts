import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
import * as dialogs from 'tns-core-modules/ui/dialogs';

export class MessageDialog {
  public static getInstance(): MessageDialog {
    return MessageDialog._instance;
  }

  private static _instance: MessageDialog = new MessageDialog();

  private constructor() {
    if (MessageDialog._instance) {
      throw new Error(ErrorMessage.MESSAGEDIALIOG_INSTANTIATION_FAILED);
    }
    MessageDialog._instance = this;
  }

  public alert(arg: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        dialogs.alert(arg).then(() => {
          resolve();
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public confirm(arg: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        dialogs.confirm(arg).then((result) => {
          resolve(result);
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public closeAll() {
    // TO-DO
  }
};
