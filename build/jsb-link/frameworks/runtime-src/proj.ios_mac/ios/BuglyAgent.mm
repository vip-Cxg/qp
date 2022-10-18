#import "BuglyAgent.h"
#import <Bugly/Bugly.h>

@implementation BuglyAgent

+ (void)initSdk:(NSString *)appId
{
    [Bugly startWithAppId:appId];
}

+ (void)reportExceptionWithCategory:(NSUInteger)category name:(NSString *)name reason:(NSString *)reason callStack:(NSArray *)stackArray  extraInfo:(NSDictionary *)info terminateApp:(BOOL)terminate
{
    [Bugly reportExceptionWithCategory:category name:name reason:reason callStack:stackArray extraInfo:info terminateApp:terminate];
}

@end
