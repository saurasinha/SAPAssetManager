//
//  PassportBridge.h
//  SAPMDC
//
//  Created by ., Michael on 6/7/20.
//  Copyright © 2020 SAP. All rights reserved.
//

#ifndef PassportBridge_h
#define PassportBridge_h

#import <Foundation/Foundation.h>
#import "BridgeCommon.h"

@interface PassportBridge: NSObject

-(NSString*) getHeaderValue: (NSDictionary *) params;

@end

#endif /* PassportBridge_h */
