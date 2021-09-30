import { Page } from 'tns-core-modules/ui/page/page';
export declare class ListPickerFragmentContainerView {
    protected page: Page;
    protected containerCallback: any;
    protected params: any;
    constructor(page: Page, params: any);
    createNativeView(): Object;
    disposeNativeView(): void;
    initNativeView(): void;
    onFragmentContainerLoaded(): void;
    onNavigatingBack(): void;
    collapseToolBarActionView(): void;
}
