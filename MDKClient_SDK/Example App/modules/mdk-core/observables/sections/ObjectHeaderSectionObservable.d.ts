import { BaseSectionObservable } from './BaseSectionObservable';
export declare class ObjectHeaderSectionObservable extends BaseSectionObservable {
    private static readonly BODY_TEXT_PARAM_KEY;
    private static readonly DESCRIPTION_TEXT_PARAM_KEY;
    private static readonly DETAIL_CONTENT_CONTAINER_PARAM_KEY;
    private static readonly DETAIL_IMAGE_PARAM_KEY;
    private static readonly DETAIL_IMAGE_IS_CIRCULAR_PARAM_KEY;
    private static readonly FOOTNOTE_TEXT_PARAM_KEY;
    private static readonly HEADLINE_TEXT_PARAM_KEY;
    private static readonly ITEMS_PARAM_KEY;
    private static readonly STATUS_IMAGE_PARAM_KEY;
    private static readonly STATUS_TEXT_PARAM_KEY;
    private static readonly SUBHEADLINE_TEXT_PARAM_KEY;
    private static readonly SUBSTATUS_IMAGE_PARAM_KEY;
    private static readonly SUBSTATUS_TEXT_PARAM_KEY;
    private static readonly TAGS_PARAM_KEY;
    private static readonly STYLES_PARAM_KEY;
    private static readonly STYLES_SECTIONPARAM_KEY;
    private static readonly ANALYTIC_VIEW_CONTAINER_PARAM_KEY;
    private static readonly ONPRESS_PARAM_KEY;
    private _resolveSectionTarget;
    bind(): Promise<Object>;
    onAnalyticViewPress(): Promise<any>;
    getTargetSpecifier(): any;
    protected _resolveData(definition: any): Promise<Object>;
}
