import * as utils from 'tns-core-modules/utils/utils';
declare var com: any;
/**
 * i18n functions for Android.
 */
export class I18n {
  
  /**
   * This method is to override system language
   * 
   * @param languageCode language code to override
   * 
   */
  public static applyLanguage(languageCode: string) {
    let finalLocale;
    if (languageCode === '') {
      // reset to system language.      
      finalLocale = this.getDeviceLocale();
    } else {
      // convert language code to native recognizable format using forLanguageTag.
      const locale = java.util.Locale.forLanguageTag(languageCode);
      const finalLanguageCode = locale ? locale.getLanguage() : languageCode;
      const script = locale.getScript();
      if (script) {
        finalLocale = new java.util.Locale.Builder().setLanguage(finalLanguageCode).setScript(script)
        .setRegion(this.getDeviceRegionCode()).build();
      } else {
         // will always use device region code for now, until we implement override region scenario.
        finalLocale = new java.util.Locale(finalLanguageCode, this.getDeviceRegionCode());
      }
    }
  
    if (finalLocale) {
      com.sap.mdk.client.ui.common.LocaleManager.setNewLocale(utils.ad.getApplicationContext(), finalLocale);
    }
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
    if (date) {
      let dateTimePattern = this.getDateTimePattern(format, customLocale, customOptions);
      let simpleDateFormat = customLocale ?
                              new java.text.SimpleDateFormat(dateTimePattern,  this.getLocale(customLocale)) :
                              new java.text.SimpleDateFormat(dateTimePattern);
      if (customTimeZone) {
        let timeZone = java.util.TimeZone.getTimeZone(customTimeZone);
        if (timeZone) {
          simpleDateFormat.setTimeZone(timeZone);
        }
      }

      return simpleDateFormat.format(new java.util.Date(date.valueOf())).toString();
    }
    
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
    // the code below is based on https://github.com/NativeScript/nativescript-intl
    let numberFormat;
    let locale = this.getLocale(customLocale);

    if (patterns) {
      numberFormat = new java.text.DecimalFormat(patterns);
    } else {
      if (options) {
        if (options.style !== void 0) {
          switch (options.style.toLowerCase()) {
            case 'decimal':
              numberFormat = java.text.NumberFormat.getNumberInstance(locale);
              break;
            case 'percent':
              numberFormat = java.text.NumberFormat.getPercentInstance(locale);
              break;
            case 'scientific':
              const eHashCount =  value.toString().length - 1;
              let eHash = '';
              for (let i = 0; i < eHashCount; i++) {
                eHash += '#';
              }
              numberFormat = new java.text.DecimalFormat('0.' + eHash + 'E0');
              break;
            case 'currency':
              numberFormat = java.text.NumberFormat.getCurrencyInstance(locale);
              if (options.currency !== void 0) {
                numberFormat.setCurrency(java.util.Currency.getInstance(options.currency));
              }
              break;
            default:
              numberFormat = java.text.NumberFormat.getNumberInstance(locale);
              break;
          }
        } else {
          numberFormat = java.text.NumberFormat.getNumberInstance(locale);
        }
      }
    }
    
    let decimalFormatSymbols = locale ?
                                new java.text.DecimalFormatSymbols(locale) :
                                new java.text.DecimalFormatSymbols();
    
    if (options && (options.style.toLowerCase() === 'currency' && options.currencyDisplay)) {
      if (!patterns && options.currencyDisplay === 'code') {
        let currrentPattern = numberFormat.toPattern();
        // this will display currency code instead of currency symbol
        currrentPattern = currrentPattern.replace('¤', '¤¤');
        numberFormat = new java.text.DecimalFormat(currrentPattern);
      }

      if (options.currency !== void 0) {
        decimalFormatSymbols.setCurrency(java.util.Currency.getInstance(options.currency));
      }
    }

    numberFormat.setDecimalFormatSymbols(decimalFormatSymbols);

    if (options) {
      if (options.minimumIntegerDigits !== void 0 && options.minimumIntegerDigits !== null) {
        numberFormat.setMinimumIntegerDigits(options.minimumIntegerDigits);
      }
      if (options.minimumFractionDigits !== void 0 && options.minimumFractionDigits !== null) {
        numberFormat.setMinimumFractionDigits(options.minimumFractionDigits);
      }
      if (options.maximumFractionDigits !== void 0 && options.maximumFractionDigits !== null) {
        numberFormat.setMaximumFractionDigits(options.maximumFractionDigits);
      }
      if (options.useGrouping !== void 0 && options.useGrouping !== null) {
        numberFormat.setGroupingUsed(options.useGrouping);
      }
    }

    return numberFormat.format(value);
  }

  /**
   * This method is to get device language code
   * 
   * @return {string} device language code
   * 
   */
  public static getDeviceLanguageCode(): string {
    return this.getDeviceLocale().toLanguageTag();
  }

  /**
   * This method is to get device region code
   * 
   * @return {string} device region code
   * 
   */
  public static getDeviceRegionCode(): string {
    return android.content.res.Resources.getSystem().getConfiguration().locale.getCountry();
  }

  /**
   * This method is to get device font scale
   * 
   * @return {number} device font scale
   * 
   */
  public static getDeviceFontScale(): number {
    return android.content.res.Resources.getSystem().getConfiguration().fontScale;
  }

  /**
   * This method is to get device region code list
   * 
   * @return {string} device region code list
   * 
   */
  public static getDeviceRegionCodeList(): string[] {
    let regionCodeList: string[] = [];
    let isoCountries = java.util.Locale.getISOCountries();
    for (let i = 0; i < isoCountries.length; i++) {
      regionCodeList[i] = isoCountries[i];
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
    const locale = this.getLocale(currentAppLocale);
    return new java.util.Locale('en', countryCode).getDisplayCountry(locale);
  }

  /**
   * This method is to get localized language name based on language code
   * 
   * @param currentAppLocale current locale
   * @param languageCode language code
   * 
   */
  public static getLocalizedLanguageName(currentAppLocale: string, languageCode: string) {
    let sourcelocale = java.util.Locale.forLanguageTag(currentAppLocale);
    let targetLocale = java.util.Locale.forLanguageTag(languageCode);
    return sourcelocale.getDisplayName(targetLocale);
  }

  private static localesCache: Map<string, any> = new Map<string, any>();

  /**
   * This method is to get locale object based on locale string
   * 
   * @param locale custom locale
   * 
   */
  private static getLocale(locale: string): any {
    if (this.localesCache.has(locale)) {
        return this.localesCache.get(locale);
    }
    let result;
    if (locale) {
        locale = locale.replace(/_/g, '-');
        let firstHypenIndex = locale.indexOf('-');
        let lang = '';
        let country = '';
        if (firstHypenIndex > -1) {
            lang = locale.substr(0, firstHypenIndex);
            let nextHypenIndex = locale.substr(firstHypenIndex + 1).indexOf('-');
            country = locale.substr(firstHypenIndex + 1, (nextHypenIndex > -1) ? nextHypenIndex : undefined);
        } else {
            lang = locale;
        }
        if (country !== '') {
            result = new java.util.Locale(lang, country);
        } else {
            result = new java.util.Locale(lang);
        }
    } else {
        result = new java.util.Locale('en', 'US');
    }
    this.localesCache.set(locale, result);
    return result;
  }

  /**
   * This method is to get device locale
   * 
   * @return {java.util.Locale} device locale
   * 
   */
  private static getDeviceLocale(): java.util.Locale {
    return android.content.res.Resources.getSystem().getConfiguration().locale;
  }

  /**
   * This method is to get the correct pattern for DateTime format
   * 
   * @param format Date format requested (DT, D, T)
   * @param locale custom locale
   * 
   */
  private static getDateTimePattern(format: string, locale?: string, customOptions?: any): string {
    let result = '';
    let nativeLocale = undefined;
    let dateOption = undefined;
    let timeOption = undefined;
    let customStyle = (customOptions ? customOptions.format : '').toLowerCase();
  
    if (locale) {
      nativeLocale = this.getLocale(locale);
    }
    
    // 0 for full, 3 for Short date format using default locale
    switch (customStyle) {
      case 'short':
        dateOption = java.text.DateFormat.SHORT;
        timeOption = java.text.DateFormat.SHORT;
        break;
      case 'medium':
        dateOption = java.text.DateFormat.MEDIUM;
        timeOption = java.text.DateFormat.MEDIUM;
        break;
      case 'long':
        dateOption = java.text.DateFormat.LONG;
        timeOption = java.text.DateFormat.LONG;
        break;
      case 'full':
        dateOption = java.text.DateFormat.FULL;
        timeOption = java.text.DateFormat.FULL;
        break;
      default:
        dateOption = java.text.DateFormat.DEFAULT;
        timeOption = java.text.DateFormat.SHORT;
    }
  
    if (format === 'D') {
      timeOption = undefined;
    } else if (format === 'T') {
      dateOption = undefined;
    }
    let dateFormat;

    if (nativeLocale) {
      if (dateOption !== undefined && timeOption !== undefined) {
        dateFormat = java.text.DateFormat.getDateTimeInstance(dateOption, timeOption, nativeLocale);
      } else if (dateOption !== undefined) {
        dateFormat = java.text.DateFormat.getDateInstance(dateOption, nativeLocale);
      } else if (timeOption !== undefined) {
        dateFormat = java.text.DateFormat.getTimeInstance(timeOption, nativeLocale);
      }
    } else {
      if (dateOption !== undefined && timeOption !== undefined) {
        dateFormat = java.text.DateFormat.getDateTimeInstance(dateOption, timeOption);
      } else if (dateOption !== undefined) {
        dateFormat = java.text.DateFormat.getDateInstance(dateOption);
      } else if (timeOption !== undefined) {
        dateFormat = java.text.DateFormat.getTimeInstance(timeOption);
      }
    }

    result = dateFormat.toPattern();

    // BCP-1870499554: The 24 and 12 hour format are inconsistent on Android.
    // If user change the setting to be automatic 24hour format and the locale default is 12hour format
    // when the user go back to app and display the page with datetimepicker, the display is correct,
    // but if user kill and reopen the app, the datetimepicker display will show incorrect hour format.
    // The selected datetime would show in 24hour format, while the selection would show in 12hour format.
    // This is only happening on API 28, as the automatic 24hour format is newly introduced on API 28.
    // Below is the workaround for android.text.format.DateFormat bug to force the correct pattern on the hour format.
    if (timeOption !== undefined) {
      if (android.text.format.DateFormat.is24HourFormat(utils.ad.getApplicationContext())) {
        if (result.indexOf('a') > -1) {
          result = result.replace('h:mm a', 'HH:mm');
        }
      } else {
        if (result.indexOf('a') === -1) {
          result = result.replace('HH:mm', 'h:mm a');
        }
      }
    }

    return result;
  }
};
