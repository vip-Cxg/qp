//
//  jsb_agoraCreator.cpp
//  Created by on 20/8/3
//

#include "jsb_agoraCreator.h"

#if (CC_TARGET_PLATFORM == CC_PLATFORM_WINRT ||                                \
     CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID ||                              \
     CC_TARGET_PLATFORM == CC_PLATFORM_IOS ||                                  \
     CC_TARGET_PLATFORM == CC_PLATFORM_MAC ||                                  \
     CC_TARGET_PLATFORM == CC_PLATFORM_WIN32)

#include <cstdarg>
#include <cstddef>
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>

#include "base/CCScheduler.h"
#include "cocos2d.h"
#include "platform/CCApplication.h"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"

#if defined(_WIN32)
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#define AGORA_CALL __cdecl
#if defined(AGORARTC_EXPORT)
#define AGORA_API extern "C" __declspec(dllexport)
#else
#define AGORA_API extern "C" __declspec(dllimport)
#endif
#elif defined(__APPLE__)
#define AGORA_API __attribute__((visibility("default"))) extern "C"
#define AGORA_CALL
#elif defined(__ANDROID__) || defined(__linux__) || defined(__linux)
#define AGORA_API extern "C" __attribute__((visibility("default")))
#define AGORA_CALL
#else
#define AGORA_API extern "C"
#define AGORA_CALL
#endif

#include "Extensions.h"
#include "VideoFrameObserver.h"
#include "callback/rtcEngineCallback/RtcEngineEventHandler.h"
#include "include/IAgoraRtcEngine.h"
#include "include/IAgoraRtcEngine2.h"
#include "rtcEngine/RtcEngineBridge.h"
#include "test/ApiTester.h"
#include "test/EventTester.h"

using namespace cocos2d;
using namespace agora::rtc;
using namespace agora::common;

class MyMetadataObserver : public IMetadataObserver {
public:
  explicit MyMetadataObserver(EngineEventHandler *EventHandler)
      : eventHandler(EventHandler) {}

  int getMaxMetadataSize() override { return 0; }

  bool onReadyToSendMetadata(Metadata &metadata) override { return false; }

  void onMetadataReceived(const Metadata &metadata) override {
    eventHandler->functionCall("onMetadataReceived", metadata);
  }

private:
  EngineEventHandler *eventHandler;
};

RtcEngineEventHandler *rtcEngineEventHandler;
EngineEventHandler *eventHandler;
MyMetadataObserver *metadataObserver;
agora::cocos::VideoFrameObserver *videoFrameObserver;

se::Class *js_cocos2dx_agoraCreator_class = nullptr;

static bool js_cocos2dx_extension_agoraCreator_finalize(se::State &s) {
  auto *cobj = (RtcEngineBridge *)s.nativeThisObject();
  if (cobj) {
    cobj->release(true);
  }

  if (metadataObserver) {
    delete metadataObserver;
    metadataObserver = nullptr;
  }

  if (videoFrameObserver) {
    delete videoFrameObserver;
    videoFrameObserver = nullptr;
  }

  if (eventHandler) {
    delete eventHandler;
    eventHandler = nullptr;
  }

  if (rtcEngineEventHandler) {
    delete rtcEngineEventHandler;
    rtcEngineEventHandler = nullptr;
  }

  return true;
}

SE_BIND_FINALIZE_FUNC(js_cocos2dx_extension_agoraCreator_finalize)

static bool js_cocos2dx_extension_agoraCreator_constructor(se::State &s) {
  auto *obj = s.thisObject();

  if (!eventHandler) {
    // link the native object with the javascript object
    eventHandler = new EngineEventHandler(obj);
  }

  if (!metadataObserver) {
    metadataObserver = new MyMetadataObserver(eventHandler);
  }

  if (!videoFrameObserver) {
    videoFrameObserver = new agora::cocos::VideoFrameObserver;
  }

  if (!rtcEngineEventHandler) {
    rtcEngineEventHandler = new RtcEngineEventHandler(eventHandler);
  }

  auto *mAgoraEngine = new RtcEngineBridge();
  mAgoraEngine->initEventHandler(rtcEngineEventHandler);

  if (obj) {
    obj->setPrivateData(mAgoraEngine);
    se::Value func;
    if (obj->getProperty("_ctor", &func)) {
      func.toObject()->call(se::EmptyValueArray, obj);
    }
  }

  return true;
}

SE_BIND_CTOR(js_cocos2dx_extension_agoraCreator_constructor,
             js_cocos2dx_agoraCreator_class,
             js_cocos2dx_extension_agoraCreator_finalize)

static bool js_cocos2dx_extension_agoraCreator_callNativeMethod(se::State &s) {
  auto *cobj = (RtcEngineBridge *)s.nativeThisObject();
  SE_PRECONDITION2(cobj, false,
                   "js_cocos2dx_extension_agoraCreator_callNativeMethod: "
                   "Invalid Native Object");

  const auto &args = s.args();
  size_t argc = args.size();
  CC_UNUSED bool ok = true;
  if (argc >= 2) {
    int api;
    ok &= seval_to_int32(args[0], &api);

    std::string parameters;
    ok &= seval_to_std_string(args[1], &parameters);

    switch ((API_TYPE)api) {
    case GET_VERSION:
    case GET_ERROR_DESCRIPTION:
    case GET_CALL_ID: {
      auto ret = cobj->callApi_str((API_TYPE)api, parameters);
      std_string_to_seval(ret, &s.rval());
    } break;

    case GET_USER_INFO_BY_USER_ACCOUNT:
    case GET_USER_INFO_BY_UID: {
      auto *p = new UserInfo;

      cobj->callApi((API_TYPE)api, parameters, p);
      s.rval() = toSeValue(*p);

      delete p;
    } break;

    case CREATE_DATA_STREAM: {
      auto *p = new int;

      cobj->callApi((API_TYPE)api, parameters, p);
      s.rval() = se::Value(*p);

      delete p;
    } break;

    case SEND_STREAM_MESSAGE: {
      std::vector<int> bytes;
      seval_to_std_vector_int(args[2], &bytes);
      std::string bytesStr(bytes.begin(), bytes.end());

      auto ret = cobj->callApi((API_TYPE)api, parameters,
                               const_cast<char *>(bytesStr.c_str()));
      int32_to_seval(ret, &s.rval());
    } break;

    case SET_UP_LOCAL_VIDEO: {
      // TODO
    } break;

    case SET_UP_REMOTE_VIDEO: {
      // TODO
    } break;

    case REGISTER_PACKET_OBSERVER: {
      // TODO
    } break;

    case SEND_METADATA: {
      std::vector<int> bytes;
      seval_to_std_vector_int(args[2], &bytes);
      std::string bytesStr(bytes.begin(), bytes.end());

      auto ret = cobj->callApi((API_TYPE)api, parameters,
                               const_cast<char *>(bytesStr.c_str()));
      int32_to_seval(ret, &s.rval());
    } break;

    case SET_MAX_META_SIZE: {
      auto ptr = new int;

      auto ret = cobj->callApi((API_TYPE)api, parameters, ptr);
      int32_to_seval(ret, &s.rval());

      delete ptr;
    } break;

    case REGISTER_MEDIA_META_DATA_OBSERVER: {
      auto ret = cobj->callApi((API_TYPE)api, parameters, metadataObserver);
      int32_to_seval(ret, &s.rval());
    } break;

    case INITIALIZE: {
      auto ret = cobj->callApi((API_TYPE)api, parameters);
      int32_to_seval(ret, &s.rval());
      cobj->setAppType(APP_TYPE_COCOSCREATOR);
      if (!videoFrameObserver) {
        videoFrameObserver = new agora::cocos::VideoFrameObserver;
      }
      cobj->registerVideoFrameObserver(videoFrameObserver);
    } break;

    case RELEASE: {
      cobj->registerVideoFrameObserver(nullptr);
      if (videoFrameObserver) {
        delete videoFrameObserver;
        videoFrameObserver = nullptr;
      }
      auto ret = cobj->callApi((API_TYPE)api, parameters);
      int32_to_seval(ret, &s.rval());
    } break;

    default: {
      auto ret = cobj->callApi((API_TYPE)api, parameters);
      int32_to_seval(ret, &s.rval());
    } break;
    }

    SE_PRECONDITION2(ok, false,
                     "js_cocos2dx_extension_agoraCreator_callNativeMethod: "
                     "Error processing arguments");
    return true;
  }

  SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc,
                  0);
  return false;
}

SE_BIND_FUNC(js_cocos2dx_extension_agoraCreator_callNativeMethod)

static bool
js_cocos2dx_extension_agoraCreator_callNativeMethodAudioEffect(se::State &s) {
  auto *cobj = (RtcEngineBridge *)s.nativeThisObject();
  SE_PRECONDITION2(cobj, false,
                   "js_cocos2dx_extension_agoraCreator_"
                   "callNativeMethodAudioEffect: Invalid Native Object");

  const auto &args = s.args();
  size_t argc = args.size();
  CC_UNUSED bool ok = true;
  if (argc == 2) {
    int api;
    ok &= seval_to_int32(args[0], &api);

    std::string parameters;
    ok &= seval_to_std_string(args[1], &parameters);

    auto ret =
        cobj->callApi_audioEffect((API_TYPE_AUDIO_EFFECT)api, parameters);
    int32_to_seval(ret, &s.rval());

    SE_PRECONDITION2(ok, false,
                     "js_cocos2dx_extension_agoraCreator_"
                     "callNativeMethodAudioEffect: Error processing arguments");
    return true;
  }

  SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc,
                  0);
  return false;
}

SE_BIND_FUNC(js_cocos2dx_extension_agoraCreator_callNativeMethodAudioEffect)

#ifdef AGORO_ENABLE_TEST

class TestHandler : public APICaseHandler {
public:
  void handleAPICase(int apiType, const char *paramter) override {
    CCLOG("[Agora] js_cocos2dx_extension_agoraCreator_startTest %d %s", apiType,
          paramter);
    std::string params = paramter;
    eventHandler->functionCall("handleAPICase", apiType, params);
  }
};

static bool js_cocos2dx_extension_agoraCreator_beginApiTest(se::State &s) {
  const auto &args = s.args();
  size_t argc = args.size();
  CC_UNUSED bool ok = true;
  if (argc == 1) {
    std::string path;
    ok &= seval_to_std_string(args[0], &path);

    TestHandler handler;
    BeginApiTest(path.c_str(), &handler);

    SE_PRECONDITION2(ok, false,
                     "js_cocos2dx_extension_agoraCreator_beginApiTest: Error "
                     "processing arguments");
    return true;
  }

  SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc,
                  0);
  return false;
}

SE_BIND_FUNC(js_cocos2dx_extension_agoraCreator_beginApiTest)

static bool
js_cocos2dx_extension_agoraCreator_compareAndDumpApiTestResult(se::State &s) {
  const auto &args = s.args();
  size_t argc = args.size();
  CC_UNUSED bool ok = true;
  if (argc == 2) {
    std::string casePath;
    ok &= seval_to_std_string(args[0], &casePath);

    std::string dumpPath;
    ok &= seval_to_std_string(args[1], &dumpPath);

    CompareAndDumpApiTestResult(casePath.c_str(), dumpPath.c_str(), nullptr);

    SE_PRECONDITION2(ok, false,
                     "js_cocos2dx_extension_agoraCreator_"
                     "compareAndDumpApiTestResult: Error processing arguments");
    return true;
  }

  SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc,
                  0);
  return false;
}

SE_BIND_FUNC(js_cocos2dx_extension_agoraCreator_compareAndDumpApiTestResult)

static bool
js_cocos2dx_extension_agoraCreator_beginRtcEngineEventTest(se::State &s) {
  const auto &args = s.args();
  size_t argc = args.size();
  CC_UNUSED bool ok = true;
  if (argc == 1) {
    std::string path;
    ok &= seval_to_std_string(args[0], &path);

    BeginRtcEngineEventTest(path.c_str(), rtcEngineEventHandler);

    SE_PRECONDITION2(ok, false,
                     "js_cocos2dx_extension_agoraCreator_"
                     "beginRtcEngineEventTest: Error processing arguments");
    return true;
  }

  SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc,
                  0);
  return false;
}

SE_BIND_FUNC(js_cocos2dx_extension_agoraCreator_beginRtcEngineEventTest)

static bool
js_cocos2dx_extension_agoraCreator_compareAndDumpRtcEngineEventTestResult(
    se::State &s) {
  const auto &args = s.args();
  size_t argc = args.size();
  CC_UNUSED bool ok = true;
  if (argc == 2) {
    std::string casePath;
    ok &= seval_to_std_string(args[0], &casePath);

    std::string dumpPath;
    ok &= seval_to_std_string(args[1], &dumpPath);

    CompareAndDumpRtcEngineEventTestResult(casePath.c_str(), dumpPath.c_str(),
                                           nullptr);

    SE_PRECONDITION2(
        ok, false,
        "js_cocos2dx_extension_agoraCreator_"
        "compareAndDumpRtcEngineEventTestResult: Error processing arguments");
    return true;
  }

  SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc,
                  0);
  return false;
}

SE_BIND_FUNC(
    js_cocos2dx_extension_agoraCreator_compareAndDumpRtcEngineEventTestResult)

static bool
js_cocos2dx_extension_agoraCreator_logEngineEventCase(se::State &s) {
  const auto &args = s.args();
  size_t argc = args.size();
  CC_UNUSED bool ok = true;
  if (argc == 2) {
    std::string event;
    ok &= seval_to_std_string(args[0], &event);

    std::string parameter;
    ok &= seval_to_std_string(args[1], &parameter);

    LogEngineEventCase(event.c_str(), parameter.c_str());

    SE_PRECONDITION2(ok, false,
                     "js_cocos2dx_extension_agoraCreator_"
                     "logEngineEventCase: Error processing arguments");
    return true;
  }

  SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc,
                  0);
  return false;
}

SE_BIND_FUNC(js_cocos2dx_extension_agoraCreator_logEngineEventCase)

#endif

static bool js_cocos2dx_extension_agoraCreator_bindTextureId(se::State &s) {
  const auto &args = s.args();
  size_t argc = args.size();
  CC_UNUSED bool ok = true;
  if (argc == 2) {
    uint32_t textureId;
    ok &= seval_to_uint32(args[0], &textureId);

    uint32_t uid;
    ok &= seval_to_uint32(args[1], &uid);

    if (videoFrameObserver) {
      videoFrameObserver->bindTextureId(textureId, uid);
    }

    SE_PRECONDITION2(ok, false,
                     "js_cocos2dx_extension_agoraCreator_"
                     "bindTextureId: Error processing arguments");
    return true;
  }

  SE_REPORT_ERROR("wrong number of arguments: %d, was expecting %d", (int)argc,
                  0);
  return false;
}

SE_BIND_FUNC(js_cocos2dx_extension_agoraCreator_bindTextureId)

bool js_register_cocos2dx_extension_agoraCreator(se::Object *obj) {
  CCLOG("[Agora] js_register_cocos2dx_extension_agoraCreator");

  auto cls =
      se::Class::create("agoraCreator", obj, nullptr,
                        _SE(js_cocos2dx_extension_agoraCreator_constructor));

  cls->defineFunction("callNativeMethod",
                      _SE(js_cocos2dx_extension_agoraCreator_callNativeMethod));

  cls->defineFunction(
      "callNativeMethodAudioEffect",
      _SE(js_cocos2dx_extension_agoraCreator_callNativeMethodAudioEffect));

#ifdef AGORO_ENABLE_TEST
  cls->defineFunction("beginApiTest",
                      _SE(js_cocos2dx_extension_agoraCreator_beginApiTest));
  cls->defineFunction(
      "beginRtcEngineEventTest",
      _SE(js_cocos2dx_extension_agoraCreator_beginRtcEngineEventTest));
  cls->defineFunction(
      "compareAndDumpApiTestResult",
      _SE(js_cocos2dx_extension_agoraCreator_compareAndDumpApiTestResult));
  cls->defineFunction(
      "compareAndDumpRtcEngineEventTestResult",
      _SE(js_cocos2dx_extension_agoraCreator_compareAndDumpRtcEngineEventTestResult));
  cls->defineFunction(
      "logEngineEventCase",
      _SE(js_cocos2dx_extension_agoraCreator_logEngineEventCase));
#endif

  cls->defineFunction("bindTextureId",
                      _SE(js_cocos2dx_extension_agoraCreator_bindTextureId));

  cls->defineFinalizeFunction(_SE(js_cocos2dx_extension_agoraCreator_finalize));
  cls->install();

  js_cocos2dx_agoraCreator_class = cls;

  se::ScriptEngine::getInstance()->clearException();
  return true;
}

bool register_jsb_agoraCreator(se::Object *obj) {
  CCLOG("[Agora] register_jsb_agoraCreator");
  return js_register_cocos2dx_extension_agoraCreator(obj);
}

#endif
