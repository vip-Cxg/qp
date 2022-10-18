//
//  BuglyAgent.h
//  xyqp_client-mobile
//
//  Created by James Edwards on 2021/1/26.
//

#ifndef BuglyAgent_h
#define BuglyAgent_h

@interface BuglyAgent : NSObject
    + (void)initSdk:(NSString *)appId;
    + (void)reportExceptionWithCategory:(NSUInteger)category name:(NSString *)name reason:(NSString *)reason callStack:(NSArray *)stackArray extraInfo:(NSDictionary *)info terminateApp:(BOOL)terminate;
@end

#endif /* BuglyAgent_h */
