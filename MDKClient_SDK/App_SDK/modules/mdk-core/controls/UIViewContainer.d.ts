import { View } from 'tns-core-modules/ui/core/view';
export declare class UIViewContainer extends View {
    nativeView: UIView;
    private _view;
    private _viewController;
    constructor(view: any);
    createNativeView(): Object;
    initNativeView(): void;
    disposeNativeView(): void;
}
