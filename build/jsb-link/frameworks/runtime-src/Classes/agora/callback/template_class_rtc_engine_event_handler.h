#pragma once

#include "base/CCScheduler.h"
#include "cocos2d.h"
#include "platform/CCApplication.h"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"

#include "../Extensions.h"
#include "../include/IAgoraRtcEngine.h"

#include <vector>

namespace agora {
namespace common {
class EngineEventHandler {
private:
  se::Object *_refObj;

public:
  EngineEventHandler(se::Object *refObj) : _refObj(refObj) {}

  virtual ~EngineEventHandler() { _refObj = nullptr; };

  void functionCall(std::string callbackName) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;

            func.toObject()->call(args, _refObj);
          }
        });
  }

  template <typename T> void functionCall(std::string callbackName, T t) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(t));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  template <typename T, typename T1>
  void functionCall(std::string callbackName, T t, T1 t1) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(t));
            args.push_back(se::Value(t1));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  template <typename T, typename T1, typename T2>
  void functionCall(std::string callbackName, T t, T1 t1, T2 t2) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(t));
            args.push_back(se::Value(t1));
            args.push_back(se::Value(t2));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  template <typename T, typename T1, typename T2, typename T3>
  void functionCall(std::string callbackName, T t, T1 t1, T2 t2, T3 t3) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(t));
            args.push_back(se::Value(t1));
            args.push_back(se::Value(t2));
            args.push_back(se::Value(t3));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  template <typename T, typename T1, typename T2, typename T3, typename T4>
  void functionCall(std::string callbackName, T t, T1 t1, T2 t2, T3 t3, T4 t4) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(t));
            args.push_back(se::Value(t1));
            args.push_back(se::Value(t2));
            args.push_back(se::Value(t3));
            args.push_back(se::Value(t4));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  template <typename T, typename T1, typename T2, typename T3, typename T4,
            typename T5>
  void functionCall(std::string callbackName, T t, T1 t1, T2 t2, T3 t3, T4 t4,
                    T5 t5) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(t));
            args.push_back(se::Value(t1));
            args.push_back(se::Value(t2));
            args.push_back(se::Value(t3));
            args.push_back(se::Value(t4));
            args.push_back(se::Value(t5));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  template <typename T, typename T1, typename T2, typename T3, typename T4,
            typename T5, typename T6>
  void functionCall(std::string callbackName, T t, T1 t1, T2 t2, T3 t3, T4 t4,
                    T5 t5, T6 t6) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(t));
            args.push_back(se::Value(t1));
            args.push_back(se::Value(t2));
            args.push_back(se::Value(t3));
            args.push_back(se::Value(t4));
            args.push_back(se::Value(t5));
            args.push_back(se::Value(t6));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  template <typename T, typename T1, typename T2, typename T3, typename T4,
            typename T5, typename T6, typename T7>
  void functionCall(std::string callbackName, T t, T1 t1, T2 t2, T3 t3, T4 t4,
                    T5 t5, T6 t6, T7 t7) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(t));
            args.push_back(se::Value(t1));
            args.push_back(se::Value(t2));
            args.push_back(se::Value(t3));
            args.push_back(se::Value(t4));
            args.push_back(se::Value(t5));
            args.push_back(se::Value(t6));
            args.push_back(se::Value(t7));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName, const rtc::RtcStats &stats) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(toSeValue(stats));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName,
                    const rtc::AudioVolumeInfo *speakers,
                    unsigned int speakerNumber, int totalVolume) {
    std::vector<MyAudioVolumeInfo> temp(speakerNumber);
    for (int i = 0; i < speakerNumber; ++i) {
      temp[i].uid = speakers[i].uid;
      temp[i].volume = speakers[i].volume;
      temp[i].vad = speakers[i].vad;
      temp[i].channelId = speakers[i].channelId ? speakers[i].channelId : "";
    }

    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(toSeValue(temp, speakerNumber));
            args.push_back(se::Value(speakerNumber));
            args.push_back(se::Value(totalVolume));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName,
                    const rtc::LastmileProbeResult &lastmileProbeResult) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(toSeValue(lastmileProbeResult));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName,
                    const rtc::LocalVideoStats &stats) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(toSeValue(stats));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName,
                    const rtc::RemoteVideoStats &stats) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(toSeValue(stats));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName,
                    const rtc::RemoteAudioStats &stats) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(toSeValue(stats));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName, rtc::uid_t uid,
                    const rtc::UserInfo &info) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(uid));
            args.push_back(toSeValue(info));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName,
                    const rtc::LocalAudioStats &stats) {
    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(toSeValue(stats));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName, int imageWidth, int imageHeight,
                    rtc::Rectangle *vecRectangle, int *vecDistance,
                    int numFaces) {
    std::vector<rtc::Rectangle> temp0(vecRectangle, vecRectangle + numFaces);
    std::vector<int> temp1(vecDistance, vecDistance + numFaces);

    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(imageWidth));
            args.push_back(se::Value(imageHeight));
            args.push_back(toSeValue(temp0, numFaces));
            args.push_back(toSeValue(temp1, numFaces));
            args.push_back(se::Value(numFaces));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName, rtc::uid_t uid, int streamId,
                    const char *data, size_t length) {
    std::vector<char> temp(data, data + length);

    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(se::Value(uid));
            args.push_back(se::Value(streamId));
            args.push_back(toSeValue(temp, length));
            args.push_back(se::Value(length));

            func.toObject()->call(args, _refObj);
          }
        });
  }

  void functionCall(std::string callbackName,
                    const rtc::IMetadataObserver::Metadata &metadata) {
    MyMetadata temp;
    temp.uid = metadata.uid;
    temp.size = metadata.size;
    temp.buffer.insert(temp.buffer.begin(), metadata.buffer,
                       metadata.buffer + metadata.size);
    temp.timeStampMs = metadata.timeStampMs;

    cocos2d::Application::getInstance()
        ->getScheduler()
        ->performFunctionInCocosThread([=]() {
          se::Value func;
          if (_refObj->getProperty(callbackName.c_str(), &func)) {
            se::ScriptEngine::getInstance()->clearException();
            se::AutoHandleScope hs;

            se::ValueArray args;
            args.push_back(toSeValue(temp));

            func.toObject()->call(args, _refObj);
          }
        });
  }
};
} // namespace common
} // namespace agora
