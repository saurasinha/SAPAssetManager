import { View } from 'tns-core-modules/ui/core/view';
export declare class ViewContainer extends View {
    private _view;
    constructor(view: any);
    createNativeView(): Object;
    initNativeView(): void;
    disposeNativeView(): void;
}
