import { ErrorMessage } from '../ErrorHandling/ErrorMessage';
declare var ToastMessageViewBridge: any;

export class Toaster {
  public static getInstance(): Toaster {
    return Toaster._instance;
  }

  private static _instance: Toaster = new Toaster();
  private toasterBridge = ToastMessageViewBridge.new();

  private constructor() {
    if (Toaster._instance) {
      throw new Error(ErrorMessage.TOASTER_INSTANTIATION_FAILED);
    }
    Toaster._instance = this;
  }

  public display(params: any) {
    this.toasterBridge.displayToastMessage(params);
  }

  public relocate(frame: any, bottomOffset: number) {
    //
  }
};
