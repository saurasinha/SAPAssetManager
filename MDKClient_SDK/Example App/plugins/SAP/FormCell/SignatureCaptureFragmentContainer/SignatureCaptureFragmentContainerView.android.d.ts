import { View } from 'tns-core-modules/ui/core/view';
import { Page } from 'tns-core-modules/ui/page/page';
export declare class SignatureCaptureFragmentContainerView extends View {
    nativeView: any;
    private _signatureFragmentContainerBridge;
    private _containerParams;
    private _signatureCaptureModel;
    constructor(page: Page, params: any);
    createNativeView(): Object;
    disposeNativeView(): void;
    initNativeView(): void;
    onLoaded(): void;
    onFragmentContainerLoaded(): void;
    onNavigatingBack(): void;
    collapseToolBarActionView(): void;
}
