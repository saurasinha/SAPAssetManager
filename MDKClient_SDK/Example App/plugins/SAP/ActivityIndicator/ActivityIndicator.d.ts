export interface IIndicatorItem {
    id: number;
    indicatorDisplayer: {};
    text: string;
    subText: string;
}
export declare class ActivityIndicator {
    static get instance(): ActivityIndicator;
    dismiss(indicatorDisplayer: {}): void;
    dismissWithId(id: number): void;
    show(text: string, indicatorDisplayer?: {}, subText?: string): number;
    hide(): void;
    unhide(): void;
    setScreenSharing(screenSharing: boolean): void;
}
