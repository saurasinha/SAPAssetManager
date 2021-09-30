import { setActivityCallbacks, AndroidActivityCallbacks } from 'tns-core-modules/ui/frame';
import { ActivityHandler } from 'mdk-sap';
import * as appModule from 'tns-core-modules/application';
import * as frameModule from 'tns-core-modules/ui/frame';
import { PushNotification } from 'mdk-sap';
import { PageRenderer } from 'mdk-core/pages/PageRenderer';
import { ClientSettings } from 'mdk-core/storage/ClientSettings';

declare var com: any;

@JavaProxy('sap.mdkclient.MDKAndroidActivity')
class Activity extends androidx.fragment.app.FragmentActivity {
  private _callbacks: AndroidActivityCallbacks;
  private _skipExit: boolean = false;

  get isNativeScriptActivity() {
    return true;
  }
  
  get skipExit(): boolean {
    return this._skipExit;
  }

  set skipExit(skip: boolean) {
    this._skipExit = skip;
  }

  public onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent): void {
    if (this._callbacks) {
      this._callbacks.onActivityResult(this, requestCode, resultCode, data, super.onActivityResult);
    }
    ActivityHandler.onActivityResult(requestCode, resultCode, data, this);
  }

  public onBackPressed(): void {
    this._callbacks.onBackPressed(this, super.onBackPressed);
  }

  public onCreate(savedInstanceState: android.os.Bundle): void {
    // To handle for MDK app launched from external (terminal or android installer)
    // Does not apply for QRCode Onboarding
    // TO-DO: to handle deeplink, use this.getIntent().getData().
    if (!this.isTaskRoot() && !this.intentDataStringExists()) {
      super.onCreate(savedInstanceState);

      if (frameModule.Frame.topmost()) {
        this.finish();
      } else {
        this.finishAffinity();
      }
      return;
    }
    PageRenderer.isControlComingFromOnCreate = true;
    appModule.android.init(this.getApplication());
    if (!this._callbacks) {
      setActivityCallbacks(this);
    }

    this._callbacks.onCreate(this, savedInstanceState, this.getIntent(), super.onCreate);

    ActivityHandler.onCreate(savedInstanceState, this);
    PushNotification.onNewIntent(this.getIntent());
  }

  // [MDK-4673] OnReceiveNotificationResponse event is not fired in Android Client
  // copy from com.tns.NativeScriptActivity
  // https://github.com/NativeScript/NativeScript/pull/5337
  public onNewIntent(intent: android.content.Intent): void {
    let linkData = intent.getDataString();
    if(linkData && linkData !== '') {
      ClientSettings.saveLinkDataObject(linkData);
    }
    if (this._callbacks) {
      this._callbacks.onNewIntent(this, intent, super.setIntent, super.onNewIntent);
    } else {
      super.onNewIntent(intent);
    }
    PushNotification.onNewIntent(intent);
  }
  
  public onDestroy(): void {
    if (this._callbacks) {
      this._callbacks.onDestroy(this, super.onDestroy);
    } else {
      super.onDestroy();
    }
  }

  // tslint:disable:max-line-length
  public onRequestPermissionsResult(requestCode: number, permissions, grantResults): void {
    if (this._callbacks) {
      this._callbacks.onRequestPermissionsResult(this, requestCode, permissions, grantResults, undefined);
    }
    ActivityHandler.onRequestPermissionsResult(requestCode, permissions, grantResults, this);
  }

  public onSaveInstanceState(outState: android.os.Bundle): void {
    if (this._callbacks) {
      this._callbacks.onSaveInstanceState(this, outState, super.onSaveInstanceState);
    } else {
      super.onSaveInstanceState(outState);
    }
  }

  public onStart(): void {
    if (this._callbacks) {
      this._callbacks.onStart(this, super.onStart);
    } else {
      super.onStart();
    }
  }

  public onStop(): void {
    if (this._callbacks) {
      this._callbacks.onStop(this, super.onStop);
    } else {
      super.onStop();
    }
  }

  private intentDataStringExists(): boolean {
    return this.getIntent() && this.getIntent().getData() && this.getIntent().getData().toString() !== '';
  }
}
