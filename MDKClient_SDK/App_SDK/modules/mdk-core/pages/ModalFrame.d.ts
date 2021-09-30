import { Frame } from 'tns-core-modules/ui/frame';
import { MDKPage } from './MDKPage';
import { PressedItem } from 'mdk-sap';
export declare class ModalFrame extends Frame {
    private _parentPage;
    private _isFullScreen;
    private _currentModalPage;
    static isModal(frame: any): boolean;
    static isPartialModal(frame: Frame): boolean;
    static isTopMostModal(): boolean;
    static close(page: MDKPage, canceled?: boolean, allowIndicator?: boolean): void;
    static setCurrentModalPage(modalPage: MDKPage): void;
    _dialogFragment: any;
    private _popOverAnchorItem;
    constructor(_parentPage: MDKPage, _isFullScreen: boolean, _currentModalPage: MDKPage);
    readonly isFullScreen: boolean;
    getCurrentModalPage(): MDKPage;
    onUnloaded(): void;
    parentPage: MDKPage;
    currentModalPage: MDKPage;
    popOverAnchorItem: PressedItem;
    private _clearPageNavigationFlagsForListPickerFragment;
    private _canceled;
    private _shownModally;
}
