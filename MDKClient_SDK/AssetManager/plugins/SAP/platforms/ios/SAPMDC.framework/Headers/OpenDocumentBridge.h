//
//  OpenDocumentBridge.h
//  SAPMDC
//
//  Copyright © 2017 SAP. All rights reserved.
//

#ifndef OpenDocumentBridge_h
#define OpenDocumentBridge_h

#import <Foundation/Foundation.h>
#import "BridgeCommon.h"

@interface OpenDocumentBridge : NSObject 

-(void) openDocument: (NSString*)path resolve: (SnowblindPromiseResolveBlock)resolve reject: (SnowblindPromiseRejectBlock)reject;
-(void)clearCache;

@end

#endif /* OpenDocumentBridge_h */
