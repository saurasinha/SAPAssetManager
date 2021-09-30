//
//  BarcodeScannerDelegate.h
//  SAPMDC
//
//  Created by Zhou, Daniel on 18/1/18.
//  Copyright © 2018 SAP. All rights reserved.
//

#ifndef BarcodeScannerDelegate_h
#define BarcodeScannerDelegate_h

@interface BarcodeScannerDelegate: NSObject

- (void)finishedScanningWithResults:(NSString * _Nonnull) result;
- (void)finishedCheckingWithResults:(BOOL) result;
- (void)finishedScanningWithErrors:(NSString * _Nonnull) error;
- (void)finishedCheckingWithErrors:(NSString * _Nonnull) error;

@end

#endif /* BarcodeScannerDelegate_h */
