import { ActionBar } from 'tns-core-modules/ui/action-bar';
export declare class MDKActionBar extends ActionBar {
    private _titleColor;
    setTitleColor(color: string): void;
    update(): void;
    private _updateColorsByBarAppearance;
}
