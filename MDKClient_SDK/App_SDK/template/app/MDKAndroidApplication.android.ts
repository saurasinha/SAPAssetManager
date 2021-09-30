// the `JavaProxy` decorator specifies the package and the name for the native *.JAVA file generated. 
@JavaProxy('sap.mdkclient.MDKAndroidApplication')
class Application extends android.app.Application {
    public onCreate(): void {
        super.onCreate();
        // tslint:disable-next-line:no-string-literal
        let handler = com['sap'].cloud.mobile.foundation.authentication.AppLifecycleCallbackHandler.getInstance();
        this.registerActivityLifecycleCallbacks(handler);
    }
    public onConfigurationChanged(newConfig: android.content.res.Configuration) {
        super.onConfigurationChanged(newConfig);
        // tslint:disable-next-line:no-string-literal
        com['sap'].mdk.client.ui.common.LocaleManager.setLocale(this);
    }
    public attachBaseContext(baseContext: android.content.Context) {
        // tslint:disable-next-line:no-string-literal
        super.attachBaseContext(com['sap'].mdk.client.ui.common.LocaleManager.setLocale(baseContext));
        // This code enables MultiDex support for the application (if needed)
        // android.support.multidex.MultiDex.install(this);
    }
}
