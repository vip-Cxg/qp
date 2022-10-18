package org.cocos2dx.javascript.service;

import android.os.Build;
import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
// import android.support.annotation.NonNull;
// import android.support.v4.content.ContextCompat;

import java.util.ArrayList;
import java.util.List;

import io.agora.rtc.internal.RtcEngineImpl;

public class ServiceAgora extends SDKClass {
  @Override
  public void init(Context context) {
    super.init(context);
    RtcEngineImpl.initializeNativeLibs();
  }

  public static boolean checkAndRequestAppPermission(Activity activity, String[] permissions, int reqCode) {
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return true;
      List<String> permissionList = new ArrayList<>();
      for (String permission : permissions) {
          // if (ContextCompat.checkSelfPermission(activity, permission) != PackageManager.PERMISSION_GRANTED)
              permissionList.add(permission);
      }
      if (permissionList.size() == 0) return true;
      String[] requestPermissions = permissionList.toArray(new String[permissionList.size()]);
      activity.requestPermissions(requestPermissions, reqCode);
      return false;
  }

  @Override
  public void onStart() {
      super.onStart();
      String[] needPermissions = {Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.RECORD_AUDIO};
      ServiceAgora.checkAndRequestAppPermission((Activity)this.getContext(), needPermissions, 1000);
  }
}