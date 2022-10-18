LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

#======================================= 
#=========Agora import segment==========
ifeq ($(USE_AGORA), 1)
include $(CLEAR_VARS)
LOCAL_MODULE := agora-rtc-sdk
LOCAL_SRC_FILES := $(LOCAL_PATH)/agora/$(TARGET_ARCH_ABI)/libagora-rtc-sdk.so
include $(PREBUILT_SHARED_LIBRARY)
include $(CLEAR_VARS)
LOCAL_MODULE := agora-soundtouch
LOCAL_SRC_FILES := $(LOCAL_PATH)/agora/$(TARGET_ARCH_ABI)/libagora-soundtouch.so
include $(PREBUILT_SHARED_LIBRARY)
include $(CLEAR_VARS)
LOCAL_MODULE := agora-mpg123
LOCAL_SRC_FILES := $(LOCAL_PATH)/agora/$(TARGET_ARCH_ABI)/libagora-mpg123.so
include $(PREBUILT_SHARED_LIBRARY)
include $(CLEAR_VARS)
LOCAL_MODULE := agora-fdkaac
LOCAL_SRC_FILES := $(LOCAL_PATH)/agora/$(TARGET_ARCH_ABI)/libagora-fdkaac.so
include $(PREBUILT_SHARED_LIBRARY)
include $(CLEAR_VARS)
LOCAL_MODULE := agora_ai_denoise_extension
LOCAL_SRC_FILES := $(LOCAL_PATH)/agora/$(TARGET_ARCH_ABI)/libagora_ai_denoise_extension.so
include $(PREBUILT_SHARED_LIBRARY)
include $(CLEAR_VARS)
LOCAL_MODULE := agora-core
LOCAL_SRC_FILES := $(LOCAL_PATH)/agora/$(TARGET_ARCH_ABI)/libagora-core.so
include $(PREBUILT_SHARED_LIBRARY)

endif
#=======================================
        

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

ifeq ($(USE_ARM_MODE),1)
LOCAL_ARM_MODE := arm
endif

LOCAL_SRC_FILES := hellojavascript/main.cpp \
				   ../../Classes/AppDelegate.cpp \
				   ../../Classes/jsb_module_register.cpp \

LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes


#======================================
#==========Agora use segment===========
ifeq ($(USE_AGORA),1)
#traverse all the directory and subdirectory
define walk
  $(wildcard $(1)) $(foreach e, $(wildcard $(1)/*), $(call walk, $(e)))
endef

#find all the file recursively under jni/

ALLFILES = $(call walk, $(LOCAL_PATH)/../../Classes/agora)
FILE_LIST := $(filter %.cpp, $(ALLFILES))

LOCAL_SRC_FILES += $(FILE_LIST:$(LOCAL_PATH)/%=%)
LOCAL_C_INCLUDES += ../../Classes/agora \
        ../../Classes/agora/callback \
        ../../Classes/agora/common \
        ../../Classes/agora/include \
        ../../Classes/agora/observer \
        ../../Classes/agora/rtcChannel \
        ../../Classes/agora/rtcEngine \
        ../../Classes/agora/test
LOCAL_SHARED_LIBRARIES := agora-rtc-sdk agora-soundtouch agora-mpg123 agora-fdkaac agora_ai_denoise_extension agora-core
endif
#======================================
        
LOCAL_STATIC_LIBRARIES := cocos2dx_static

include $(BUILD_SHARED_LIBRARY)

$(call import-module, cocos)
