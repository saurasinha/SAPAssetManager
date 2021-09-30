import { BaseJSONDefinition } from '../BaseJSONDefinition';
import { BaseControlDefinition } from '../controls/BaseControlDefinition';
export declare class BaseSectionDefinition extends BaseJSONDefinition {
    static type: {
        AnalyticCardCollection: string;
        ButtonSection: string;
        ChartContent: string;
        ContactCell: string;
        Extension: string;
        GridTable: string;
        ImageCollection: string;
        KPIHeader: string;
        KeyValue: string;
        ObjectCollection: string;
        ObjectHeader: string;
        ObjectTable: string;
        ProfileHeader: string;
        SimplePropertyCollection: string;
        FormCellSection: string;
        KPISection: string;
    };
    private parent;
    constructor(path: any, data: any, parent: any);
    readonly emptySectionCaption: String;
    readonly emptySectionHidesFooter: {
        IsPropertyDefined: boolean;
        Visible: boolean;
    };
    readonly emptySectionFooterVisible: {
        IsPropertyDefined: boolean;
        Visible: boolean;
    };
    readonly footerVisible: boolean;
    readonly emptySectionStyle: String;
    readonly footerAccessoryType: String;
    readonly footerAttributeLabel: String;
    readonly footerCaption: any;
    readonly footerStyle: string;
    readonly onFooterPress: any;
    readonly headerCaption: String;
    readonly maxItemCount: number;
    readonly name: any;
    readonly sectionTable: BaseControlDefinition;
    readonly target: any;
    readonly dataSubscriptions: Array<any>;
    readonly type: any;
    readonly usesAttributeLabel: boolean;
    readonly usesHeader: boolean;
    readonly useHeaderTopPadding: boolean;
    readonly useFooterBottomPadding: boolean;
    readonly visible: boolean;
    readonly sectionIndex: number;
}
