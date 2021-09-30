# MDK client SDK

## Getting Started

To install the prerequisites for the MDK and build a MDK project, you may run MDK Dependencies installer to install required components.

### For MacOS:
At the root of the extracted MDK SDK folder, double click on the file "MDK Dependencies Installer" to start the installer. The installer will list all required components for iOS and Android platform and automatically check if they are already installed in the machine. Follow the installer UI to install the components you selected.

### For Windows:
At the root of the extracted MDK SDK folder, extract "MDKDependenciesInstallerWindows.zip" file, by default a new folder "MDK Dependencies Installer-win32-ia32" will be created. Enter the new folder and double click "MDK_Dependencies_Installer.exe" to start installer. The installer will list all required components for Windows platform and automatically check if they are already installed in the machine. Follow the installer UI to install the components you selected.

Once you've installed these prerequisites, your machine is ready to generate and build a MDK project.

## Installing the SDK dependencies
To use the SDK to generate a mobile development kit client, the first step is to install some dependencies. To do this, invoke `install.command` for Mac OS X / `install.cmd` for Windows, either from Terminal or from Finder. If you select the command from Finder, you may see the following message:

>“install.command” can’t be opened because it is from an unidentified developer. 

>Your security preferences allow installation of only apps from the App Store and identified developers."

To get around this, navigate to the Security & Privacy section of System Preferences. This can be found using Spotlight. Near the bottom of this dialog, click the "Open Anyway" button on the right side. Then select Open from the next prompt.

A terminal window will appear installs the SDK dependencies using NPM. Once this completes, close the window. Notice that the `create-client.command` for Mac OS X / `create-client.cmd` for Windows file has appeared in the SDK directory.

## Creating a mobile development kit client

You can create a client by running `create-client.command`for Mac OS X / `create-client.cmd` for Windows and providing the path to a valid `.mdkproject` directory. Use the included `template.mdkproject` as a starting point. First, modify the `MDKProject.json` file to specify build-time configurations such as the app name and version. Next, modify the `BrandedSettings.json` file to specify settings pertaining to how the application connects to SAP Mobile Services, its passcode policy, and more.

There are also several directories in the `.mdkproject` that can be configured, but these are all optional. See [Branding.md](./docs/branding/Branding.md) for more information.

Once the `.mdkproject` is configured, run `create-client.command` for Mac OS X / `create-client.cmd` for Windows to create the client. You will be asked to provide the path to the `.mdkproject` file and whether you'd like to build for simulator or device. You can also provide optional arguments such as output directory and log verbosity. You can run `create-client.command --help` for Mac OS X / `create-client.cmd --help` for Windows from Terminal to find out how to specify these options as arguments.

## Running from command line

Once the script completes successfully, you can use build and run the app using one of the commands below. First, enter the newly created project directly with the command `cd <app name>`.

### Running on the iOS Simulator

To run the app on the iOS Simulator from command line, use the command `tns run ios --emulator`. This command will open the Simulator app, install the app, and start it.

### Running on an iOS device

To run the app on a device, first attach the device to your Mac. Then run `tns device ios` to print a list of attached devices. Copy the "Device Identifier" value for your device. Then run the command `tns run ios --device <device identifier>`.

You can also run the app in Xcode. Open the project in Xcode with the command `open platforms/ios/<app name>.xcworkspace`, or open the workspace using the File -> Open... dialog in Xcode. Configure the application's code signing settings, then run the application for the target device.

### Running on the Android Emulator

To run the app on the Android Emulator from command line, use the command `tns run android --emulator`. This command will open the Emulator app, install the app, and start it.

### Running on an Android device

To run the app on a device, first attach the device to your Mac. Then run `tns device android` to print a list of attached devices. Copy the "Device Identifier" value for your device. Then run the command `tns run android --device <device identifier>`.

## Building for distribution

### Building the iOS application for distribution

To build an IPA for an iOS device, use `tns build ios --for-device --release`. This can also be accomplished in Xcode by opening the workspace and selecting the Archive option. More information about archiving can be found in Apple's documentation [here](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/UploadingYourApptoiTunesConnect/UploadingYourApptoiTunesConnect.html).

### Building the Android application for distribution

To build an APK for an Android device, use `tns build android --release`. More information about archiving can be found in NativeScript's documentation [here](https://v6.docs.nativescript.org/tooling/docs-cli/project/testing/build-android).
