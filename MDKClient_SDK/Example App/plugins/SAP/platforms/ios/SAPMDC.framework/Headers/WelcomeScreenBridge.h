//
//  WelcomeScreenBridge.h
//  SAPMDCFramework
//
//  Created by Thyagarajan, Ramesh on 2/18/17.
//  Copyright © 2017 SAP. All rights reserved.
//

#ifndef WelcomeScreenBridge_h
#define WelcomeScreenBridge_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "WelcomeScreenDelegate.h"
#import "BridgeCommon.h"

@interface WelcomeScreenBridge : NSObject

/**
 Creates a new WelcomeScreenBridge
 */
-(UIViewController*) create:(NSDictionary *)params callback: (WelcomeScreenDelegate*) callback;

/**
 Re-inits a new WelcomeScreenBridge
 */
-(void) reInitializePage:(NSDictionary *)params;

/**
 Show/remove a blurred screen when app backgrounds/foregrounds.
 */
-(void) manageBlurScreen:(NSDictionary *)params;

/**
 App is foregrounding
 */
- (void) applicationWillEnterForeground: (SnowblindPromiseResolveBlock)resolve
                                 reject: (SnowblindPromiseRejectBlock)reject;

/**
 User attempt passcode change
 */
 -(void) changeUserPasscode: (SnowblindPromiseResolveBlock)resolve reject: (SnowblindPromiseRejectBlock)reject;

/**
 Verify passcode
*/
-(void) verifyPasscode: (NSDictionary *)params
                  resolve: (SnowblindPromiseResolveBlock)resolve
                  reject: (SnowblindPromiseRejectBlock)reject;

/**
 User onboarded app, exited and re-launched
 */
- (void) restoreOnRelaunch: (NSDictionary *)params
                  resolve: (SnowblindPromiseResolveBlock)resolve
                  reject: (SnowblindPromiseRejectBlock)reject;

@end

#endif /* WelcomeScreenBridge_h */
