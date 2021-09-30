import { Frame } from 'tns-core-modules/ui/frame';
import { MDKPage } from './MDKPage';
import { FlexibleColumnLayout } from '../controls/FlexibleColumnLayout';
export declare class FlexibleColumnFrame extends Frame {
    private _parentPage;
    private _parentLayoutControl;
    static COLUMN_TAG: string;
    constructor(id: string, page: MDKPage);
    parentPage: MDKPage;
    getParentLayoutControl(): FlexibleColumnLayout;
    getNextFlexibileColumnFrame(): FlexibleColumnFrame;
    isTopMostFlexibleColumnFrame(): boolean;
    getTopMostFlexibleColumnFrame(): FlexibleColumnFrame;
    getAllFlexibleColumnFrames(): FlexibleColumnFrame[];
    static isFlexibleColumnFrame(id: string): boolean;
    static isLastFrameWithinFlexibleColumnLayout(frameId: string): boolean;
    static isEndColumnWithinFlexibleColumnLayout(frameId: string): boolean;
}
