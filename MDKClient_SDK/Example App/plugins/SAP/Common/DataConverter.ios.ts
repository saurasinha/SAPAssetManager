declare var NSDateFormatter: any;
declare var NSTimeZone: any;

export class DataConverter {
  public static fromNSDictToMap(nsDict: NSDictionary<NSString, any>): Map<String, any> {
    let map: Map<String, any> = new Map<String, any>();

    let keys: NSArray<NSString> = nsDict.allKeys;
    for (let i = 0; i < keys.count; i++) {
      let key = keys[i].toString();
      let value = nsDict.valueForKey(key);
      if (value !== undefined && value !== null) {
        map.set(key, value);
      }
    }

    return map;
  }

  public static fromNSDictToJavascriptObject(nsDict: NSDictionary<NSString, any>) {
    let node = {};

    let keys: NSArray<NSString> = nsDict.allKeys;
    for (let i = 0; i < keys.count; i++) {
      let key = keys[i].toString();
      let value = nsDict.valueForKey(key);
      if (value !== undefined && value !== null) {
        node[key] = value;
      }
    }

    return node;
  }

  public static fromNSDictWithNSArrayToJavascriptObject(nsDict: NSDictionary<NSString, any>) {
    let node = {};

    let keys: NSArray<NSString> = nsDict.allKeys;
    for (let i = 0; i < keys.count; i++) {
      let key = keys[i].toString();
      let value = nsDict.valueForKey(key);
      if (value !== undefined && value !== null) {
        if (value instanceof NSArray) {
          node[key] = DataConverter.toArray(value);
        } else {
          node[key] = value;
        }
      }
    }

    return node;
  }

  public static convertNSDictInNSArray(value: any): any[] {
    let result: any = [];
    if (value instanceof NSArray) {
      for (let i = 0; i < value.count; i++) {
        result.push(DataConverter.fromNSDictToJavascriptObject(value.objectAtIndex(i)));
      }
    } else {
      result = [value];
    }

    return result;
  }

  public static toArray(value: any, allowSplit: boolean = true): [any] {
    let result: any = [];
    if (Array.isArray(value)) {
      result = value;
    } else if (value instanceof NSArray) {
      for (let i = 0; i < value.count; i++) {
        result.push(value.objectAtIndex(i));
      }
    } else {
      result = [value];
    }

    return result;
  }

  public static toViewFacade(view: any) {
    return {
      android: undefined,
      ios: view,
    };
  }

  public static toUTCDate(dateString: string, serviceTimeZoneAbbreviation: string) {
    if (dateString && dateString.length > 0 && dateString[dateString.length - 1] === 'Z') {
      let formatter = NSDateFormatter.alloc().init();
      formatter.dateFormat = dateString.match(this.UTC_DATE_TIME_FULL_REGEX) ? 
        `yyyy-MM-dd'T'HH:mm:ss.SSS'Z'` : `yyyy-MM-dd'T'HH:mm:ss'Z'`;
      let date = formatter.dateFromString(dateString);
      formatter.dateFormat = `yyyy-MM-dd'T'HH:mm:ss`;
      return formatter.stringFromDate(date);
    } else {
      let formatter = NSDateFormatter.alloc().init();
      formatter.dateFormat = dateString.match(this.DATE_TIME_FULL_REGEX) ? 
        `yyyy-MM-dd'T'HH:mm:ss.SSS` : `yyyy-MM-dd'T'HH:mm:ss`;
      formatter.timeZone = NSTimeZone.alloc().initWithName(serviceTimeZoneAbbreviation);
      let date = formatter.dateFromString(dateString);
      formatter.timeZone = NSTimeZone.alloc().initWithName('UTC');
      formatter.dateFormat = `yyyy-MM-dd'T'HH:mm:ss`;
      return formatter.stringFromDate(date);
    }
  }

  private static DATE_TIME_FULL_REGEX = /^(\d{4})(\-)(\d\d)(\-)(\d\d)(\T)(\d\d)(\:)(\d\d)(\:)(\d\d).(\d\d\d)$/;
  private static UTC_DATE_TIME_FULL_REGEX = /^(\d{4})(\-)(\d\d)(\-)(\d\d)(\T)(\d\d)(\:)(\d\d)(\:)(\d\d).(\d\d\d)Z$/;
};
