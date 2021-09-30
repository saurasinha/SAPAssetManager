import { View } from 'tns-core-modules/ui/core/view';
export declare class ViewWrapper extends View {
    private _iosView;
    private _androidView;
    get ios(): any;
    get android(): any;
    setView(view: any): void;
}
