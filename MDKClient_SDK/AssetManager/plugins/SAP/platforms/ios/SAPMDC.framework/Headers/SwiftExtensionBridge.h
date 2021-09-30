//
//  SwiftExtensionBridge.h
//  SAPMDC
//
//  Created by Wonderley, Lucas on 2/26/18.
//  Copyright © 2018 SAP. All rights reserved.
//

#ifndef SwiftExtensionBridge_h
#define SwiftExtensionBridge_h

#import <UIKit/UIKit.h>

@protocol MDKExtension;
@protocol SwiftExtensionDelegate;

@interface SwiftExtensionBridge : NSObject
@property id<MDKExtension> extension;
-(void) create:(NSString *)className withParams:(NSDictionary*) params andDelegate: (NSObject*) delegate;
-(void) updateParams:(NSDictionary*) params;
-(void) onControlValueChanged:(NSDictionary*) value;
-(void) actionOrRuleResult:(NSString*) result;
-(void) resolvedValue:(NSString*) result;
@end

#endif /* SwiftExtensionBridge_h */
