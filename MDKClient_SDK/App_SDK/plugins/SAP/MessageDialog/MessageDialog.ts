export class MessageDialog {
  public static getInstance(): MessageDialog {
    return MessageDialog._instance;
  }

  private static _instance: MessageDialog = new MessageDialog();

  public alert(arg: any): Promise<void> {
    //
    return Promise.resolve();
  }

  public confirm(arg: any): Promise<boolean> {
    //
    return Promise.resolve(false);
  } 

  public setScreenSharing(screenSharing: boolean) {
    // no action
  }

  public closeAll() {
    // no action
  }
};
