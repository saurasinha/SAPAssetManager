//
//  EnumPropertyWrapper.h
//  SAPOfflineOData
//
//  Copyright © 2017 SAP SE or an SAP affiliate company. All rights reserved.
//
//  No part of this publication may be reproduced or transmitted in any form or for any purpose
//  without the express permission of SAP SE.  The information contained herein may be changed
//  without prior notice.
//

#import "PropertyWrapper.h"
#import "EnumTypeWrapper.h"

#if __cplusplus

namespace lodata
{
    class EnumProperty;
}

#endif
@interface EnumPropertyWrapper : PropertyWrapper

#if __cplusplus

- (instancetype) initWithCppInstance: (const lodata::EnumProperty * ) enumProp;

#endif
- (EnumTypeWrapper *) getEnumTypeWrapper;

@end
