//
//  OnboardingCustomizationBridge.h
//  SAPMDC
//
//  Created by Yao, Sheng on 2/2/18.
//  Copyright © 2018 SAP. All rights reserved.
//

#ifndef OnboardingCustomizationBridge_h
#define OnboardingCustomizationBridge_h

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface OnboardingCustomizationBridge : NSObject

/**
 Configure custmizable strings for onboarding
 
 @param params custmized strings

 */
+ (void) config: (NSDictionary*)params;

@end

#endif /* OnboardingCustomizationBridge_h */
