//
//  PushNotificationBridge.h
//  SAPMDC
//
//  Created by Ng, HuiXiong on 27/9/17.
//  Copyright © 2017 SAP. All rights reserved.
//

#ifndef PushNotificationBridge_h
#define PushNotificationBridge_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "BridgeCommon.h"

@interface PushNotificationBridge : NSObject
-(void)registerForPushNotification:(NSString*)applicationId :(NSURL*)baseURL :(NSString*)deviceId resolve: (SnowblindPromiseResolveBlock)resolve reject: (SnowblindPromiseRejectBlock)reject;
-(void)didRegisterForRemoteNotifications:(NSData*)deviceToken;
-(void)didFailToRegisterNotifications:(NSError*)error;
-(void)unregisterForPushNotification:(NSString*)applicationId :(NSURL*)baseURL :(NSString*)deviceId resolve: (SnowblindPromiseResolveBlock)resolve reject: (SnowblindPromiseRejectBlock)reject;

@end

#endif

