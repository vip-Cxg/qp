#include "CrashReport.h"

#define BUGLY_CLASS @"BuglyAgent"
#define BUGLY_METHOD_EXCEPTION @"reportExceptionWithCategory:name:reason:callStack:extraInfo:terminateApp:"

CrashReport::CrashReport(){
   
}

void CrashReport::reportException(const char* msg, const char* traceback) {
    Class clazz = NSClassFromString(BUGLY_CLASS);
    if (clazz) {
        SEL selector = NSSelectorFromString(BUGLY_METHOD_EXCEPTION);
        NSMethodSignature* signature = [clazz methodSignatureForSelector:selector];
        
        NSInteger category = 5;
        NSString *name = @"JSError";
        NSString *reason = NULL == msg ? @"" : @(msg);
        NSString *track = NULL == traceback ? @"" : @(traceback);
        NSArray *trackArray = [track componentsSeparatedByString:@"\n"];
        NSDictionary *info = nil;
        BOOL terminate = NO;
        
        if (signature) {
            NSInvocation* invocation = [NSInvocation invocationWithMethodSignature:signature];
            if (invocation) {
                [invocation setTarget:clazz];
                [invocation setSelector:selector];
                [invocation setArgument:&category atIndex:2];
                [invocation setArgument:&name atIndex:3];
                [invocation setArgument:&reason atIndex:4];
                [invocation setArgument:&trackArray atIndex:5];
                [invocation setArgument:&info atIndex:6];
                [invocation setArgument:&terminate atIndex:7];
                [invocation invoke];
            }
        }
    }
}
