import { ISegment } from './ISegment';
import { IContext } from '../../context/IContext';
export declare class PageSegment extends ISegment {
    resolve(): IContext;
    private findPageByName;
    private isTargetPage;
    private findPageFromFrameStack;
    private findPageFromTabParent;
    private findPageWithinTabs;
    private pageFromContext;
    private findPreviousPage;
}
