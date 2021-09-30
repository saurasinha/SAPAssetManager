//
//  PopoverBridge.h
//  SAPMDCFramework
//
//  Copyright © 2017 SAP. All rights reserved.
//

#ifndef PopoverBridge_h
#define PopoverBridge_h

#import <Foundation/Foundation.h>
#import "BridgeCommon.h"

@interface PopoverBridge : NSObject

/**
 * displays a popover menu
 */
-(void) show: (NSDictionary*)params resolve: (SnowblindPromiseResolveBlock)resolve reject: (SnowblindPromiseRejectBlock)reject;

@end

#endif

