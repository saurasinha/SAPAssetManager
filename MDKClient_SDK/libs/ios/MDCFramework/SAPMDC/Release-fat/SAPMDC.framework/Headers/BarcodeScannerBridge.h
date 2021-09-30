//
//  BarcodeScannerBridge.h
//  SAPMDC
//
//  Created by Zhou, Daniel on 18/1/18.
//  Copyright © 2018 SAP. All rights reserved.
//

#ifndef BarcodeScannerBridge_h
#define BarcodeScannerBridge_h

#import <Foundation/Foundation.h>
#import "BridgeCommon.h"
#import "BarcodeScannerDelegate.h"

@interface BarcodeScannerBridge : NSObject

-(void) create: (NSDictionary *)params callback: (BarcodeScannerDelegate*) callback;
-(void) check: (NSDictionary *)params callback: (BarcodeScannerDelegate*) callback;

@end

#endif /* BarcodeScannerBridge_h */
