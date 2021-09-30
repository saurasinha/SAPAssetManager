//
//  BannerMessageViewBridge.h
//  SAPMDCFramework
//
//  Copyright © 2017 SAP. All rights reserved.
//

#ifndef BannerMessageViewBridge_h
#define BannerMessageViewBridge_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "BannerDelegate.h"

@interface BannerMessageViewBridge : NSObject

/**
 Creates a new BannerMessageView, configures it with the given parameters and displays it
 */
-(void)displayBannerMessage:(NSDictionary*)params callback:(BannerDelegate*)callback;
-(void)dismissBanner:(NSDictionary*)params;
-(void)prepareToRelocate;
-(void)updateText:(NSDictionary*)params;
-(void)relocateTo:(UINavigationController*)target withParams: (UIView*)view;

@end

#endif
