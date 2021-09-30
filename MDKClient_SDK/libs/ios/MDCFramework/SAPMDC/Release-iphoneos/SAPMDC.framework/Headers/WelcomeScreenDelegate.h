//
//  WelcomeScreenDelegate.h
//  SAPMDCFramework
//
//  Created by Thyagarajan, Ramesh on 2/24/17.
//  Copyright © 2017 SAP. All rights reserved.
//

#ifndef WelcomeScreenDelegate_h
#define WelcomeScreenDelegate_h

@interface WelcomeScreenDelegate : NSObject

- (void)finishedOnboardingWithParams:(NSDictionary<NSString *, NSString *> * _Nonnull) offlineStoreEncKey;
- (void)finishedLoadingRegistrationInfo:(NSDictionary<NSString *, NSString *> * _Nonnull) data;
- (void)qrCodeScanComplete:(NSString * _Nonnull) queryString;
- (void)setOnboardingStage:(NSString * _Nonnull) stage;

@end

#endif /* WelcomeScreenDelegate_h */
