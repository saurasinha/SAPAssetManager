export class SharedLoggerManager {
  public static log(message, severity = undefined): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public static pluginError(message, ...args): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public static pluginDebug(message, ...args): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public static pluginInfo(message, ...args): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }

  public static pluginWarn(message, ...args): Promise<any> {
    return new Promise((resolve, reject) => resolve(''));
  }
}
