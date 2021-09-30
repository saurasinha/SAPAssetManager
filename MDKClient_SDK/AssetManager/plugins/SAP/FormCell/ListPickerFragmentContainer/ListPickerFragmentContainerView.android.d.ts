import { View } from 'tns-core-modules/ui/core/view';
import { Page } from 'tns-core-modules/ui/page/page';
export declare class ListPickerFragmentContainerView extends View {
    nativeView: any;
    private _listPickerFragmentContainerBridge;
    private _containerParams;
    private _listPickerModel;
    constructor(page: Page, params: any);
    createNativeView(): Object;
    disposeNativeView(): void;
    initNativeView(): void;
    onLoaded(): void;
    onFragmentContainerLoaded(): void;
    onNavigatingBack(): void;
    collapseToolBarActionView(): void;
}
