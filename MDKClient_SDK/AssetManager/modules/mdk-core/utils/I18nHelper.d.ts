import { IContext } from '../context/IContext';
export declare enum LocalizationStringSource {
    Bundle = 1,
    Extension = 2,
    MDK = 3
}
export declare class I18nHelper {
    static getDefinition(languageCode: string, stringSource?: LocalizationStringSource, localizationFolder?: string): any;
    static getI18nStringReference(languageCode: string, localizationStringRef: string): string[];
    static localizeDefinitionText(key: string, dynamicParams?: string[], context?: IContext): string;
    static localizeExtensionText(key: string, localizationFolder?: string, dynamicParams?: string[], context?: IContext): string;
    static localizeMDKText(key: string, dynamicParams?: string[], context?: IContext): string;
    static parseLocalizableString(value: string, context?: IContext): string;
    static getLocalizableKey(value: string): string;
    private static mdkI18nPath;
    private static defaultMDKFileName;
    private static _defaultExtensionFolderName;
    private static _defaultI18nFolderName;
    private static _getBundleDefinition;
    private static _getExtensionDefinition;
    private static _getExtensionBundleDefPath;
    private static _getMDKDefinition;
    private static _i18nMatchKeyValuePair;
    private static _localize;
    private static _localizeString;
    private static _localizeText;
    private static _manageLocalizableString;
    private static _onParseFail;
    private static _parseStringToJSObject;
}
