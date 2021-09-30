import { IBannerData } from './IBannerData';
import * as frameModule from 'tns-core-modules/ui/frame';

export class Banner {

  public static getInstance(): Banner {
    //
    return null;
  }

  public display(data: IBannerData, callback: any) {
    //
  }

  public dismiss(data?: IBannerData) {
    //
  }

  public prepareToRelocate() {
    //
  }

  public relocateTo(topFrame: frameModule.Frame, view: any) {
    //
  }

  public updateText(message: string, topFrame: frameModule.Frame) {
    //
  }
};
