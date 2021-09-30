import { messageType, write } from 'tns-core-modules/trace';
import { File, path, knownFolders } from 'tns-core-modules/file-system'
declare var java: any;
declare var org: any;

export class DataConverter {
  public static toJavaObject(params) {
    let obj = new org.json.JSONObject();

    for (let prop in params) {
      if (params[prop] === null || params[prop] === undefined) {
        obj.put(prop, null);
      } else if (typeof params[prop] === 'string' || typeof params[prop] === 'number' 
                                                  || typeof params[prop] === 'boolean') {
        obj.put(prop, params[prop]);
      } else if (typeof params[prop] === 'object') {
        if (params[prop] && params[prop].constructor === {}.constructor) {
          obj.put(prop, DataConverter.toJavaObject(params[prop]));
        } else if (Array.isArray(params[prop])) {
          obj.put(prop, DataConverter.toJavaArray(params[prop]));
        }
      } else {
        write(`DataConverter.toJavaObject - Unsupported type ${prop}`, 'mdk.trace.core', messageType.log);
      }
    }
    return obj;
  }

  public static toJavaArray(params) {
    let obj = new org.json.JSONArray();
    for (let prop in params) {
      if (params[prop] === null || params[prop] === undefined) {
        obj.put(null);
      } else if (typeof params[prop] === 'string' || typeof params[prop] === 'number' 
                                                  || typeof params[prop] === 'boolean') {
        obj.put(params[prop]);
      } else if (typeof params[prop] === 'object') {
        if (params[prop] && params[prop].constructor === {}.constructor) {
          obj.put(DataConverter.toJavaObject(params[prop]));
        } else if (Array.isArray(params[prop])) {
          obj.put(DataConverter.toJavaArray(params[prop]));
        } else if (Array.isArray(params[prop])) {
          obj.put(DataConverter.toJavaArray(params[prop]));
        }
      } else {
        const message: string = 'DataConverter.toJavaObject - Unsupported type ${typeof params[prop]}`';
        write(message, 'mdk.trace.core', messageType.log);
      }
    }
    return obj;
  }

  public static toJavaScriptObject(javaObj) {
    let node = {};
    let obj = new org.json.JSONObject(javaObj);
    let iterator = obj.keys();
    let key;
    while (iterator.hasNext()) {
      key = iterator.next();
      node[key] = obj.get(key);
    }

    return node;
  }

  public static jsonObjectToJavascriptObject(jsonObject) {
    let node = {};
    let iterator = jsonObject.keys();
    let key;
    while (iterator.hasNext()) {
      key = iterator.next();
      node[key] = jsonObject.get(key);
    }

    return node;
  }

  public static toJavaScriptMap(javaObj) {
    const aMap = new Map();
    let node = DataConverter.toJavaScriptObject(javaObj);
    Object.keys(node).forEach(key => {
      if (key === 'PasscodeSource') {
        aMap.set(key, Number(node[key]));
      } else {
        aMap.set(key, node[key]);
      }
    });

    return aMap;
  }

  public static toViewFacade(view: any) {
    return {
      android: view,
      ios: undefined,
    };
  }

  public static toArray(value: any, allowSplit: boolean = true): [any] {
    let result: any = [];
    if (Array.isArray(value)) {
      result = value;
    } else if (value instanceof Object) {
      for (let item of value) {
        result.push(item);
      }
    }  else {
      result = [value];
    }

    return result;
  }

  public static toUTCDate(dateString: string, serviceTimeZoneAbbreviation: string) {
    if (dateString && dateString.length > 0 && dateString[dateString.length - 1] === 'Z') {
      let formatter = dateString.match(this.UTC_DATE_TIME_FULL_REGEX) ? 
        new java.text.SimpleDateFormat(`yyyy-MM-dd'T'HH:mm:ss.SSS'Z'`) :
        new java.text.SimpleDateFormat(`yyyy-MM-dd'T'HH:mm:ss'Z'`);
      let date = formatter.parse(dateString);
      formatter = new java.text.SimpleDateFormat(`yyyy-MM-dd'T'HH:mm:ss`);
      return formatter.format(date);
    } else {
      let formatter = dateString.match(this.DATE_TIME_FULL_REGEX) ? 
        new java.text.SimpleDateFormat(`yyyy-MM-dd'T'HH:mm:ss.SSS`) :
        new java.text.SimpleDateFormat(`yyyy-MM-dd'T'HH:mm:ss`);
      formatter.setTimeZone(java.util.TimeZone.getTimeZone(serviceTimeZoneAbbreviation));
      let date = formatter.parse(dateString);
      formatter = new java.text.SimpleDateFormat(`yyyy-MM-dd'T'HH:mm:ss`);
      formatter.setTimeZone(java.util.TimeZone.getTimeZone('UTC'));
      return formatter.format(date);
    }
  }

  public static toJavaScriptValue(value: any) {
    if (value instanceof java.util.Date) {
      return new Date(value.getTime());
    } else if (value instanceof java.lang.Object && value.getClass() && value.getClass().getSimpleName() === 'JSONObject' && value.length() >= 0) {
      return this.jsonObjectToJavascriptObject(value);
    } else if (value instanceof java.lang.Object && value.length >= 0) {
      // Listpicker return Array
      let result: any = [];
      for (let item of value) {
          result.push(item);
      }
      return result;
    } else {
      return value;
    }
  }

  public static javaJsonObjectToJavascriptObject(javaJsonObj: any) {
    let obj = {};
    let iterator = javaJsonObj.keys();
    let key, value;
    while (iterator.hasNext()) {
      key = iterator.next();
      value = javaJsonObj.get(key);
      if (value instanceof java.lang.Object && value.getClass()) {
        if (value.getClass().getSimpleName() === 'Integer') {
          obj[key] = value.intValue();
        } else if (value.getClass().getSimpleName() === 'Boolean') {
          obj[key] = value.booleanValue();
        } else if (value.getClass().getSimpleName() === 'int[]') {
          let result: any = [];
          for (let item of value) {
              result.push(item);
          }
          obj[key] = result;
        }
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }

  private static DATE_TIME_FULL_REGEX = /^(\d{4})(\-)(\d\d)(\-)(\d\d)(\T)(\d\d)(\:)(\d\d)(\:)(\d\d).(\d\d\d)$/;
  private static UTC_DATE_TIME_FULL_REGEX = /^(\d{4})(\-)(\d\d)(\-)(\d\d)(\T)(\d\d)(\:)(\d\d)(\:)(\d\d).(\d\d\d)Z$/;
};
