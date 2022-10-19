//
// Created by LXH on 2020/8/7.
//

#pragma once

#include "include/IAgoraRtcEngine.h"
#include "scripting/js-bindings/manual/jsb_global.h"

#include <vector>

namespace agora {
namespace common {
struct MyAudioVolumeInfo {
  uid_t uid;
  unsigned int volume;
  unsigned int vad;
  std::string channelId;
};

struct MyMetadata {
  unsigned int uid;
  unsigned int size;
  std::vector<unsigned char> buffer;
  long long timeStampMs;
};

se::Value toSeValue(const std::vector<int> &value, int length);

se::Value toSeValue(const std::vector<char> &byteValue, int length);

se::Value toSeValue(const rtc::RtcStats &rtcStats);

se::Value toSeValue(const MyAudioVolumeInfo &audioVolumeInfo);

se::Value toSeValue(const std::vector<MyAudioVolumeInfo> &audioVolumeInfo,
                    int length);

se::Value toSeValue(const rtc::LastmileProbeResult &lastmileProbeResult);

se::Value
toSeValue(const rtc::LastmileProbeOneWayResult &lastmileProbeOneWayResult);

se::Value toSeValue(const rtc::LocalVideoStats &localVideoStats);

se::Value toSeValue(const rtc::RemoteVideoStats &remoteVideoStats);

se::Value toSeValue(const rtc::LocalAudioStats &localAudioStats);

se::Value toSeValue(const rtc::RemoteAudioStats &remoteAudioStats);

se::Value toSeValue(const rtc::UserInfo &userInfo);

se::Value toSeValue(const rtc::Rectangle &rectangle);

se::Value toSeValue(const std::vector<rtc::Rectangle> &rectangle, int length);

se::Value toSeValue(const MyMetadata &metadata);
} // namespace common
} // namespace agora
