declare var com;

export class ActivityHandler {
  
  public static onCreate(savedInstanceState: any, context: android.content.Context): void {
    ActivityHandler.bridge.onCreate(savedInstanceState, context);
  }

  // tslint:disable:max-line-length
  public static onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent, context: android.content.Context): void {
    ActivityHandler.bridge.onActivityResult(requestCode, resultCode, data, context);
  }
  
  // tslint:disable:max-line-length
  public static onRequestPermissionsResult(requestCode: number, permissions: Array<String>, grantResults: Array<number>, context: android.content.Context): void {
    ActivityHandler.bridge.onRequestPermissionsResult(requestCode, permissions, grantResults, context);
  }

  private static bridge = com.sap.mdk.client.ui.fiori.activityHandler.ActivityHandler;

}
