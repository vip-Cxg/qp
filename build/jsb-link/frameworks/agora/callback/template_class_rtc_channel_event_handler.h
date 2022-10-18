#pragma once

#include "base/CCScheduler.h"
#include "cocos2d.h"
#include "platform/CCApplication.h"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"
#include "scripting/js-bindings/manual/jsb_global.h"

#include "../Extensions.h"
#include "../include/IAgoraRtcEngine.h"

namespace agora {
namespace common {
class ChannelEventHandler {
private:
  se::Object *_refObj;

public:
  ChannelEventHandler(se::Object *refObj) : _refObj(refObj) {}

  virtual ~ChannelEventHandler() { _refObj = nullptr; };

  void functionCall(std::string callbackName, std::string channelId) {
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

  template <typename T>
  void functionCall(std::string callbackName, std::string channelId, T t) {
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
  void functionCall(std::string callbackName, std::string channelId, T t,
                    T1 t1) {
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
  void functionCall(std::string callbackName, std::string channelId, T t, T1 t1,
                    T2 t2) {
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
  void functionCall(std::string callbackName, std::string channelId, T t, T1 t1,
                    T2 t2, T3 t3) {
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
  void functionCall(std::string callbackName, std::string channelId, T t, T1 t1,
                    T2 t2, T3 t3, T4 t4) {
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
  void functionCall(std::string callbackName, std::string channelId, T t, T1 t1,
                    T2 t2, T3 t3, T4 t4, T5 t5) {
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
  void functionCall(std::string callbackName, std::string channelId, T t, T1 t1,
                    T2 t2, T3 t3, T4 t4, T5 t5, T6 t6) {
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
  void functionCall(std::string callbackName, std::string channelId, T t, T1 t1,
                    T2 t2, T3 t3, T4 t4, T5 t5, T6 t6, T7 t7) {
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

  void functionCall(std::string callbackName, std::string channelId,
                    const rtc::RtcStats &stats) {
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

  void functionCall(std::string callbackName, std::string channelId,
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

  void functionCall(std::string callbackName, std::string channelId,
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
};
} // namespace common
} // namespace agora
