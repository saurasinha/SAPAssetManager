import { View } from 'tns-core-modules/ui/core/view';
import { messageType, write } from 'tns-core-modules/trace';
import { Page } from 'tns-core-modules/ui/page/page';

declare var com: any;
declare var org: any;

export class SignatureCaptureFragmentContainerView extends View {
  public nativeView: any;
  private _signatureFragmentContainerBridge = new com.sap.mdk.client.ui.fiori.formCell.SignatureCaptureFragmentContainer();
  private _containerParams: org.json.JSONObject;
  private _signatureCaptureModel: any;

  constructor(page: Page, params: any) {
    super();
    this._signatureCaptureModel = params.model;
    write(`Container params in createWithParams: ${this._containerParams}`, 'mdk.trace.ui', messageType.log);
  }

  // This is part of {N} view lifecycle calls, therefore, its invoked by {N}
  // when the view needs to be created.
  public createNativeView(): Object {
    try {
      let parent = (this.parent.android as android.view.ViewGroup);
      write(`Container params in createNativeView: ${this._containerParams}`, 'mdk.trace.ui', messageType.log);
      return this._signatureFragmentContainerBridge.create(this._signatureCaptureModel, this._context, parent);
    } catch (error) {
      write(error, 'mdk.trace.ui', messageType.error);
    }
  }

  public disposeNativeView(): void {
    // Remove reference from native view to this instance.
    if (this.nativeView) {
      (<any> this.nativeView).owner = null;
    }

    // If you want to recycle nativeView and have modified the nativeView 
    // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
    // you have to reset it to its initial state here.
    super.disposeNativeView();
  }

  public initNativeView(): void {
    (<any> this.nativeView).owner = this;
    super.initNativeView();
  }

  public onLoaded() {
    super.onLoaded();
  }

  public onFragmentContainerLoaded(): void {
    this._signatureFragmentContainerBridge.onFragmentContainerLoaded();
  }

  public onNavigatingBack(): void {
    this._signatureFragmentContainerBridge.onNavigatingBack();
  }

  public collapseToolBarActionView(): void {
    this._signatureFragmentContainerBridge.collapseToolBarActionView();
  }
};
