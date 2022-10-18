//
// Created by LXH on 2020/8/7.
//

#include "Extensions.h"
#include "scripting/js-bindings/manual/jsb_conversions.hpp"

namespace agora {
namespace common {
using namespace agora::rtc;

se::Value toSeValue(const std::vector<int> &value, int length) {
  se::HandleObject obj(se::Object::createArrayObject(length));
  for (int i = 0; i < length; ++i) {
    obj->setArrayElement(i, se::Value(value[i]));
  }
  return se::Value(obj);
}

se::Value toSeValue(const std::vector<char> &byteValue, int length) {
  se::HandleObject obj(se::Object::createTypedArray(
      se::Object::TypedArrayType::UINT8, (void *)byteValue.data(), length));
  return se::Value(obj);
}

se::Value toSeValue(const RtcStats &rtcStats) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("duration", se::Value(rtcStats.duration));
  obj->setProperty("txBytes", se::Value(rtcStats.txBytes));
  obj->setProperty("rxBytes", se::Value(rtcStats.rxBytes));
  obj->setProperty("txAudioBytes", se::Value(rtcStats.txAudioBytes));
  obj->setProperty("txVideoBytes", se::Value(rtcStats.txVideoBytes));
  obj->setProperty("rxAudioBytes", se::Value(rtcStats.rxAudioBytes));
  obj->setProperty("rxVideoBytes", se::Value(rtcStats.rxVideoBytes));
  obj->setProperty("txKBitRate", se::Value(rtcStats.txKBitRate));
  obj->setProperty("rxKBitRate", se::Value(rtcStats.rxKBitRate));
  obj->setProperty("txAudioKBitRate", se::Value(rtcStats.txAudioKBitRate));
  obj->setProperty("rxAudioKBitRate", se::Value(rtcStats.rxAudioKBitRate));
  obj->setProperty("rxVideoKBitRate", se::Value(rtcStats.rxVideoKBitRate));
  obj->setProperty("txVideoKBitRate", se::Value(rtcStats.txVideoKBitRate));
  obj->setProperty("lastmileDelay", se::Value(rtcStats.lastmileDelay));
  obj->setProperty("txPacketLossRate", se::Value(rtcStats.txPacketLossRate));
  obj->setProperty("rxPacketLossRate", se::Value(rtcStats.rxPacketLossRate));
  obj->setProperty("userCount", se::Value(rtcStats.userCount));
  obj->setProperty("cpuAppUsage", se::Value(rtcStats.cpuAppUsage));
  obj->setProperty("cpuTotalUsage", se::Value(rtcStats.cpuTotalUsage));
  obj->setProperty("gatewayRtt", se::Value(rtcStats.gatewayRtt));
  obj->setProperty("memoryAppUsageRatio",
                   se::Value(rtcStats.memoryAppUsageRatio));
  obj->setProperty("memoryTotalUsageRatio",
                   se::Value(rtcStats.memoryTotalUsageRatio));
  obj->setProperty("memoryAppUsageInKbytes",
                   se::Value(rtcStats.memoryAppUsageInKbytes));
  return se::Value(obj);
}

se::Value toSeValue(const MyAudioVolumeInfo &audioVolumeInfo) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("uid", se::Value(audioVolumeInfo.uid));
  obj->setProperty("volume", se::Value(audioVolumeInfo.volume));
  obj->setProperty("vad", se::Value(audioVolumeInfo.vad));
  obj->setProperty("channelId", se::Value(audioVolumeInfo.channelId));
  return se::Value(obj);
}

se::Value toSeValue(const std::vector<MyAudioVolumeInfo> &audioVolumeInfo,
                    int length) {
  se::HandleObject obj(se::Object::createArrayObject(length));
  for (int i = 0; i < length; ++i) {
    obj->setArrayElement(i, toSeValue(audioVolumeInfo[i]));
  }
  return se::Value(obj);
}

se::Value toSeValue(const LastmileProbeResult &lastmileProbeResult) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("state", se::Value(lastmileProbeResult.state));
  obj->setProperty("uplinkReport", toSeValue(lastmileProbeResult.uplinkReport));
  obj->setProperty("downlinkReport",
                   toSeValue(lastmileProbeResult.downlinkReport));
  obj->setProperty("rtt", se::Value(lastmileProbeResult.rtt));
  return se::Value(obj);
}

se::Value
toSeValue(const LastmileProbeOneWayResult &lastmileProbeOneWayResult) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("packetLossRate",
                   se::Value(lastmileProbeOneWayResult.packetLossRate));
  obj->setProperty("jitter", se::Value(lastmileProbeOneWayResult.jitter));
  obj->setProperty("availableBandwidth",
                   se::Value(lastmileProbeOneWayResult.availableBandwidth));
  return se::Value(obj);
}

se::Value toSeValue(const LocalVideoStats &localVideoStats) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("sentBitrate", se::Value(localVideoStats.sentBitrate));
  obj->setProperty("sentFrameRate", se::Value(localVideoStats.sentFrameRate));
  obj->setProperty("encoderOutputFrameRate",
                   se::Value(localVideoStats.encoderOutputFrameRate));
  obj->setProperty("rendererOutputFrameRate",
                   se::Value(localVideoStats.rendererOutputFrameRate));
  obj->setProperty("targetBitrate", se::Value(localVideoStats.targetBitrate));
  obj->setProperty("targetFrameRate",
                   se::Value(localVideoStats.targetFrameRate));
  obj->setProperty("qualityAdaptIndication",
                   se::Value(localVideoStats.qualityAdaptIndication));
  obj->setProperty("encodedBitrate", se::Value(localVideoStats.encodedBitrate));
  obj->setProperty("encodedFrameWidth",
                   se::Value(localVideoStats.encodedFrameWidth));
  obj->setProperty("encodedFrameHeight",
                   se::Value(localVideoStats.encodedFrameHeight));
  obj->setProperty("encodedFrameCount",
                   se::Value(localVideoStats.encodedFrameCount));
  obj->setProperty("codecType", se::Value(localVideoStats.codecType));
  obj->setProperty("txPacketLossRate",
                   se::Value(localVideoStats.txPacketLossRate));
  obj->setProperty("captureFrameRate",
                   se::Value(localVideoStats.captureFrameRate));
  return se::Value(obj);
}

se::Value toSeValue(const RemoteVideoStats &remoteVideoStats) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("uid", se::Value(remoteVideoStats.uid));
  obj->setProperty("delay", se::Value(remoteVideoStats.delay));
  obj->setProperty("width", se::Value(remoteVideoStats.width));
  obj->setProperty("height", se::Value(remoteVideoStats.height));
  obj->setProperty("receivedBitrate",
                   se::Value(remoteVideoStats.receivedBitrate));
  obj->setProperty("decoderOutputFrameRate",
                   se::Value(remoteVideoStats.decoderOutputFrameRate));
  obj->setProperty("rendererOutputFrameRate",
                   se::Value(remoteVideoStats.rendererOutputFrameRate));
  obj->setProperty("packetLossRate",
                   se::Value(remoteVideoStats.packetLossRate));
  obj->setProperty("rxStreamType", se::Value(remoteVideoStats.rxStreamType));
  obj->setProperty("totalFrozenTime",
                   se::Value(remoteVideoStats.totalFrozenTime));
  obj->setProperty("frozenRate", se::Value(remoteVideoStats.frozenRate));
  obj->setProperty("totalActiveTime",
                   se::Value(remoteVideoStats.totalActiveTime));
  obj->setProperty("publishDuration",
                   se::Value(remoteVideoStats.publishDuration));
  return se::Value(obj);
}

se::Value toSeValue(const LocalAudioStats &localAudioStats) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("numChannels", se::Value(localAudioStats.numChannels));
  obj->setProperty("sentSampleRate", se::Value(localAudioStats.sentSampleRate));
  obj->setProperty("sentBitrate", se::Value(localAudioStats.sentBitrate));
  obj->setProperty("txPacketLossRate",
                   se::Value(localAudioStats.txPacketLossRate));
  return se::Value(obj);
}

se::Value toSeValue(const RemoteAudioStats &remoteAudioStats) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("uid", se::Value(remoteAudioStats.uid));
  obj->setProperty("quality", se::Value(remoteAudioStats.quality));
  obj->setProperty("networkTransportDelay",
                   se::Value(remoteAudioStats.networkTransportDelay));
  obj->setProperty("jitterBufferDelay",
                   se::Value(remoteAudioStats.jitterBufferDelay));
  obj->setProperty("audioLossRate", se::Value(remoteAudioStats.audioLossRate));
  obj->setProperty("numChannels", se::Value(remoteAudioStats.numChannels));
  obj->setProperty("receivedSampleRate",
                   se::Value(remoteAudioStats.receivedSampleRate));
  obj->setProperty("receivedBitrate",
                   se::Value(remoteAudioStats.receivedBitrate));
  obj->setProperty("totalFrozenTime",
                   se::Value(remoteAudioStats.totalFrozenTime));
  obj->setProperty("frozenRate", se::Value(remoteAudioStats.frozenRate));
  obj->setProperty("totalActiveTime",
                   se::Value(remoteAudioStats.totalActiveTime));
  obj->setProperty("publishDuration",
                   se::Value(remoteAudioStats.publishDuration));
  return se::Value(obj);
}

se::Value toSeValue(const UserInfo &userInfo) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("uid", se::Value(userInfo.uid));
  obj->setProperty("userAccount", se::Value(userInfo.userAccount));
  return se::Value(obj);
}

se::Value toSeValue(const Rectangle &rectangle) {
  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("x", se::Value(rectangle.x));
  obj->setProperty("y", se::Value(rectangle.y));
  obj->setProperty("width", se::Value(rectangle.width));
  obj->setProperty("height", se::Value(rectangle.height));
  return se::Value(obj);
}

se::Value toSeValue(const std::vector<Rectangle> &rectangle, int length) {
  se::HandleObject obj(se::Object::createArrayObject(length));
  for (int i = 0; i < length; ++i) {
    obj->setArrayElement(i, toSeValue(rectangle[i]));
  }
  return se::Value(obj);
}

se::Value toSeValue(const MyMetadata &metadata) {
  se::HandleObject buffer(se::Object::createTypedArray(
      se::Object::TypedArrayType::UINT8, (void *)metadata.buffer.data(),
      metadata.size));
  se::Value timeStampMs;
  longlong_to_seval(metadata.timeStampMs, &timeStampMs);

  se::HandleObject obj(se::Object::createPlainObject());
  obj->setProperty("uid", se::Value(metadata.uid));
  obj->setProperty("size", se::Value(metadata.size));
  obj->setProperty("buffer", se::Value(buffer));
  obj->setProperty("timeStampMs", timeStampMs);
  return se::Value(obj);
}
} // namespace common
} // namespace agora
