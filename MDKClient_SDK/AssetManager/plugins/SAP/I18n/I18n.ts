export class I18n {

  /**
   * This method is to override system language
   * 
   * @param languageCode language code to override
   * 
   */
  public static applyLanguage(languageCode: string) {
    // apply language
  }

  /**
   * This method is to display datetime into format based on selected style and locale
   * 
   * @param date date object to be formatted into locale string
   * @param format one of [DT, D, T], default is DT
   * @param customLocale overrides app locale
   * @param customTimeZone overrides device TimeZone
   * @return {string} formatted datetime string
   * 
   */
  public static formatDateToLocaleString(
    date: Date, format?: string, customLocale?: string,
    customTimeZone?: string, customOptions?: any): string {
    return '';
  }

  /**
   * This method is to display value in number format based on selected style and locale
   * 
   * @param value numeric value to be formatted
   * @param options number format options, optional
   * @param customLocale overrides app locale
   * @param patterns set number in specific pattern
   * i.e. 0.##, 0.00, ¤#,##0.00, (¤0.00)
   * @return {string} formatted number in selected style
   * 
   */
  public static formatNumberToLocaleString(
    value: number, options?: any,
    customLocale?: string, patterns?: string): string {
    return '';
  }

  /**
   * This method is to get device language code
   * 
   * @return {string} device language code
   * 
   */
  public static getDeviceLanguageCode(): string {
    return '';
  }

  /**
   * This method is to get device region code
   * 
   * @return {string} device region code
   * 
   */
  public static getDeviceRegionCode(): string {
    return '';
  }

  /**
   * This method is to get device font scale
   * 
   * @return {number} device font scale
   * 
   */
  public static getDeviceFontScale(): number {
    return 1;
  }

  /**
   * This method is to get device region code
   * 
   * @return {string} device region code
   * 
   */
  public static getDeviceRegionCodeList(): string[] {
    return [];
  }

  /**
   * This method is to get name of the region
   * 
   * @return {string} device name of the region
   * 
   */
  public static getDeviceRegionName(currentAppLocale: string, countryCode: string) {
    return '';
  }

  /**
   * This method is to get localized language name based on language code
   * 
   * @param currentAppLocale current locale
   * @param languageCode language code
   * 
   */
  public static getLocalizedLanguageName(currentAppLocale: string, languageCode: string) {
    return '';
  }
};
