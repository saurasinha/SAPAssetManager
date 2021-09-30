export declare class ActivityIndicator {
    static get instance(): ActivityIndicator;
    private static _instance;
    private _activityIndicatorBridge;
    private _shownItems;
    private _isHidden;
    private _currentId;
    private _screenSharing;
    private constructor();
    dismiss(indicatorDisplayer: {}): void;
    dismissWithId(id: number): void;
    show(text: string, indicatorDisplayer?: {}, subText?: string): number;
    hide(): void;
    unhide(): void;
    setScreenSharing(screenSharing: boolean): void;
    private get _isActive();
    private _showCurrentItem;
}
