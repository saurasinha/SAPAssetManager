/**
 * i18n functions for iOS.
 */
import { ios } from 'tns-core-modules/utils/utils';

export class I18n {
    
  /**
   * This method is to override system language
   * 
   * @param languageCode language code to override
   * 
   */
  public static applyLanguage(languageCode: string) {
    if (NSUserDefaults.standardUserDefaults) {
      NSUserDefaults.standardUserDefaults.removeObjectForKey('AppleLanguages');
      
      if (languageCode) {
        const languageArr = [languageCode];
        NSUserDefaults.standardUserDefaults.setObjectForKey(languageArr, 'AppleLanguages');
        NSUserDefaults.standardUserDefaults.synchronize();
      }
    }
  }

  /**
   * This method is to display datetime into format based on selected style and locale
   * 
   * @param date date object to be formatted into locale string
   * @param format one of [DT, D, T], default is DT
   * @param customLocale overrides app locale
   * @param customTimeZone overrides device TimeZone
   * @param customOptions custom options to be used in formatting the value
   * @return {string} formatted datetime string
   * 
   */
  public static formatDateToLocaleString(
                  date: Date, format?: string, customLocale?: string,
                  customTimeZone?: string, customOptions?: any): string {
    let formatter = NSDateFormatter.alloc().init();
    let customStyle = (customOptions ? customOptions.format : '').toLowerCase();

    if (customLocale) {
      formatter.locale = NSLocale.alloc().initWithLocaleIdentifier(customLocale);
    }
    
    switch (customStyle) {
      case 'short':
        formatter.dateStyle = NSDateFormatterStyle.ShortStyle;
        formatter.timeStyle = NSDateFormatterStyle.ShortStyle;
        break;
      case 'medium':
        formatter.dateStyle = NSDateFormatterStyle.MediumStyle;
        formatter.timeStyle = NSDateFormatterStyle.MediumStyle;
        break;
      case 'long':
        formatter.dateStyle = NSDateFormatterStyle.LongStyle;
        formatter.timeStyle = NSDateFormatterStyle.LongStyle;
        break;
      case 'full':
        formatter.dateStyle = NSDateFormatterStyle.FullStyle;
        formatter.timeStyle = NSDateFormatterStyle.FullStyle;
        break;
      default:
        formatter.dateStyle = NSDateFormatterStyle.MediumStyle;
        formatter.timeStyle = NSDateFormatterStyle.ShortStyle;
    }

    if (format === 'D') {
      formatter.timeStyle = NSDateFormatterStyle.NoStyle;   
    } else if (format === 'T') {
      formatter.dateStyle = NSDateFormatterStyle.NoStyle;
    }

    if (customTimeZone) {
      let timeZone = NSTimeZone.alloc().initWithName(customTimeZone);
      if (timeZone) {
        formatter.timeZone = timeZone;
      }
    }
    return formatter.stringFromDate(date);
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
    // the code below is based on https://github.com/NativeScript/nativescript-intl
    let numberFormat = NSNumberFormatter.alloc().init();
    if (customLocale) {
      numberFormat.locale = NSLocale.alloc().initWithLocaleIdentifier(customLocale);
    }

    if (options) {
      if (options.style !== void 0) {
        switch (options.style.toLowerCase()) {
          case 'decimal':
            numberFormat.numberStyle = NSNumberFormatterStyle.DecimalStyle;
            break;
          case 'percent':
            numberFormat.numberStyle = NSNumberFormatterStyle.PercentStyle;
            break;
          case 'scientific':
            numberFormat.numberStyle = NSNumberFormatterStyle.ScientificStyle;
            // BCP-1980383502 - Scientific number formatting display extra digits
            // Previous workaround not needed for iOS 13
            if (ios.MajorVersion < 13) {
              // the fraction digits are not working properly, need to plus 1 to get it work.
              if (options.minimumFractionDigits !== void 0 && options.minimumFractionDigits !== null) {
                options.minimumFractionDigits = options.minimumFractionDigits + 1;
              }
              if (options.maximumFractionDigits !== void 0 && options.maximumFractionDigits !== null) {
                options.maximumFractionDigits = options.maximumFractionDigits + 1;
              }
            }
            break;
          case 'currency':
            numberFormat.numberStyle = NSNumberFormatterStyle.CurrencyStyle;
            if (options.currency !== void 0) {
              numberFormat.currencyCode = options.currency;
            }
            if (!patterns && options.currencyDisplay === 'code') {
              let tempPattern = numberFormat.positiveFormat;
              tempPattern = tempPattern.replace('¤', '¤¤');
              numberFormat.positiveFormat = tempPattern;
            }
            break;
          default:
            numberFormat.numberStyle = NSNumberFormatterStyle.DecimalStyle;
            break;
        }
      } else {
        numberFormat.numberStyle = NSNumberFormatterStyle.DecimalStyle;
      }
      if (options.minimumIntegerDigits !== void 0 && options.minimumIntegerDigits !== null) {
        numberFormat.minimumIntegerDigits = options.minimumIntegerDigits;
      }
      if (options.minimumFractionDigits !== void 0 && options.minimumFractionDigits !== null) {
        numberFormat.minimumFractionDigits = options.minimumFractionDigits;
      }
      if (options.maximumFractionDigits !== void 0 && options.maximumFractionDigits !== null) {
        numberFormat.maximumFractionDigits = options.maximumFractionDigits;
      }
      if (options.useGrouping !== void 0 && options.useGrouping !== null) {
        numberFormat.usesGroupingSeparator = options.useGrouping;
      }
    }

    if (patterns) {
      numberFormat.positiveFormat = patterns;
    }

    return numberFormat.stringFromNumber(value);
  }

  /**
   * This method is to get device language code
   * 
   * @return {string} device language code
   * 
   */
  public static getDeviceLanguageCode(): string {
    let originalNSDefaultLanguage = this.getNSDefaultLanguage();
    // reset NS default language to be based on current device setting.
    this.applyLanguage('');
    let deviceLanguage = this.getNSDefaultLanguage();
    if (deviceLanguage !== originalNSDefaultLanguage) {
      // set the original language back to NS default.
      this.applyLanguage(originalNSDefaultLanguage);
    }
    return deviceLanguage;
  }

  /**
   * This method is to get device region code
   * 
   * @return {string} device region code
   * 
   */
  public static getDeviceRegionCode(): string {
    return NSLocale.currentLocale.countryCode;
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
   * This method is to get device region code list
   * 
   * @return {string} device region code list
   * 
   */
  public static getDeviceRegionCodeList(): string[] {
    let arrayCount = NSLocale.ISOCountryCodes.count;
    let regionCodeList: string[] = [];
    for (let i = 0; i < arrayCount; i++) {
      let countryCode: string = NSLocale.ISOCountryCodes.objectAtIndex(i);
      regionCodeList.push(countryCode);
   }
    return regionCodeList;
 }

 /**
  * This method is to get name of the region
  * 
  * @param currentAppLocale current locale
  * @param countryCode region code
  * 
  */
  public static getDeviceRegionName(currentAppLocale: string, countryCode: string) {
    const locale: NSLocale = NSLocale.alloc().initWithLocaleIdentifier(currentAppLocale);
    return locale.displayNameForKeyValue(NSLocaleCountryCode, countryCode);
  }

  /**
   * This method is to get localized language name based on language code
   * 
   * @param currentAppLocale current locale
   * @param languageCode language code
   * 
   */
  public static getLocalizedLanguageName(currentAppLocale: string, languageCode: string) {
    const appNSLocale = NSLocale.alloc().initWithLocaleIdentifier(currentAppLocale);
    return appNSLocale.localizedStringForLocaleIdentifier(languageCode);
  }

  private static getNSDefaultLanguage() {
    let languageCode = '';
    const languageObj = NSUserDefaults.standardUserDefaults.objectForKey('AppleLanguages');
    if (languageObj) {
      languageCode = languageObj.count > 0 ? languageObj[0] : '';
    }
    return languageCode;
  }
};
