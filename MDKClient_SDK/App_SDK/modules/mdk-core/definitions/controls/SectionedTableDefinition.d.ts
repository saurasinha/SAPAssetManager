import { BaseContainerDefinition } from './BaseContainerDefinition';
import { BaseSectionDefinition } from '../sections/BaseSectionDefinition';
export declare class SectionedTableDefinition extends BaseContainerDefinition {
    private sections;
    private visibleSections;
    constructor(path: any, data: any, parent: any);
    getSectionCount(): number;
    getSections(): BaseSectionDefinition[];
    getVisibleSectionCount(): number;
    getVisibleSections(): BaseSectionDefinition[];
    getOnRenderedEvent(): any;
}
