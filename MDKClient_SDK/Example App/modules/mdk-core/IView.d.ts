import { IContext } from './context/IContext';
import { ValueResolver } from './utils/ValueResolver';
import { IControlData } from './controls/IControlData';
export declare abstract class IView {
    context: IContext;
    protected _props: any;
    abstract view(): any;
    initialize(controlData: IControlData): void;
    definition(): any;
    onDisplayingModal(isFullPage: boolean): void;
    onDismissingModal(): void;
    onNavigatedTo(initialLoading: boolean): void;
    onNavigatedFrom(pageExists: boolean): void;
    onNavigatingTo(initialLoading: boolean): void;
    onNavigatingFrom(pageExists: boolean): void;
    onPageUnloaded(pageExists: boolean): void;
    onPress(...args: any[]): void;
    onPageLoaded(initialLoading: boolean): void;
    valueResolver(): typeof ValueResolver;
    setStyle(): void;
    viewIsNative(): boolean;
    androidContext(): any;
    protected executeAction(actionOrRulePath: any): Promise<any>;
    protected executeActionOrRule(actionOrRulePath: any): Promise<any>;
}
