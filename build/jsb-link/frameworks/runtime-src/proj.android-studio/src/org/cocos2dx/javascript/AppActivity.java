package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.cocos2dx.okhttp3.MediaType;
import org.cocos2dx.okhttp3.MultipartBody;
import org.cocos2dx.okhttp3.OkHttpClient;
import org.cocos2dx.okhttp3.Request;
import org.cocos2dx.okhttp3.RequestBody;
import org.cocos2dx.okhttp3.Response;
import org.json.JSONException;
import org.json.JSONObject;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Bundle;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Environment;
import android.provider.Settings;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;


import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.tencent.bugly.crashreport.CrashReport;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.wildma.pictureselector.PermissionUtils;
import com.wildma.pictureselector.PictureBean;
import com.wildma.pictureselector.PictureSelector;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Map;

public class AppActivity extends Cocos2dxActivity implements AMapLocationListener {
    @SuppressLint("StaticFieldLeak")
    private static Cocos2dxActivity sCocos2dxActivity;

    public static String inviter = "";
    @SuppressLint("StaticFieldLeak")
    public static ImageView sSplashBgImageView = null;

    public static boolean isUploadAvatar = true;
    public AMapLocationClient mlocationClient;

    private static final int PERMISSION_CODE_LOCATION = 0x15;
    private static final int PERMISSION_CODE_SAVEIMAGE = 0x16;

    //????????????
    public static String wx_appid = "wx1f66a2276a8c673e";//"wx064c4712c743554c";
    public static IWXAPI wx_api;

    private static final String TAG = "XYQP";
    private static final String TAG_LOCATION = "GAME_LOCATION";

    private static void showSplash() {
        sSplashBgImageView = new ImageView(sCocos2dxActivity);
        int id = getContext().getResources().getIdentifier("splash", "drawable", "org.cocos2d.demo");
        sSplashBgImageView.setImageResource(id);
        sSplashBgImageView.setScaleType(ImageView.ScaleType.FIT_XY);
        sCocos2dxActivity.addContentView(sSplashBgImageView,
                new WindowManager.LayoutParams(
                        FrameLayout.LayoutParams.MATCH_PARENT,
                        FrameLayout.LayoutParams.MATCH_PARENT
                )
        );
    }

    @Override
    public void onLocationChanged(AMapLocation amapLocation) {
        if (amapLocation != null) {
            if (amapLocation.getErrorCode() == 0) {
                //?????????????????????????????????????????????
                amapLocation.getLocationType();//??????????????????????????????????????????????????????????????????????????????
                amapLocation.getLatitude();//????????????
                amapLocation.getLongitude();//????????????
                amapLocation.getAccuracy();//??????????????????

//                Toast.makeText(this, "??????????????????", Toast.LENGTH_SHORT).show();
//                Log.d(TAG_LOCATION, String.format("onLocationChanged (%f, %f)",amapLocation.getLatitude(),amapLocation.getLongitude()));
                String CALLBACK_PATTERN = "window.__require('native-extend').Social.getLocationCallback(%s,%s);";
                final String evalStr = String.format(CALLBACK_PATTERN, amapLocation.getLatitude(), amapLocation.getLongitude());
                sCocos2dxActivity.runOnGLThread(new Runnable() {
                    @Override
                    public void run() {
                        Cocos2dxJavascriptJavaBridge.evalString(evalStr);
                    }
                });
            } else {
                //??????????????????ErrCode???????????????errInfo???????????????????????????????????????
//                Toast.makeText(this, "location Error, ErrCode:"
//                        + amapLocation.getErrorCode() + ", errInfo:"
//                        + amapLocation.getErrorInfo(), Toast.LENGTH_LONG).show();
                // Log.e(TAG_LOCATION, "location Error, ErrCode:"
                //         + amapLocation.getErrorCode() + ", errInfo:"
                //         + amapLocation.getErrorInfo());
            }
        }
    }

    /**
     * ????????? CC JS ??????????????????????????????????????????
     */
    public static void hideSplash() {
        sCocos2dxActivity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (sSplashBgImageView != null) {
                    sSplashBgImageView.setVisibility(View.GONE);
                }
            }
        });
    }

    public static void sendWXAuthReq() {
        Log.e(TAG, "AppActivity wechat_login");
        SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "wx_oauth_authorization_state";
        //    System.out.println("reqxxxxxxxxx  is " + req);
        //????????????api????????????
        wx_api.sendReq(req);

    }

    //????????????(????????????)
    public static void callJsFunction(final String value) {
        Log.e(TAG, "AppActivity wechat222_login");

        sCocos2dxActivity.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                String CALLBACK_PATTERN = "window.__require('native-extend').Social.wechatCallback('%s');";
                String evalStr = String.format(CALLBACK_PATTERN, value);
                Cocos2dxJavascriptJavaBridge.evalString(evalStr);
            }
        });

    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        initSDK(this, "cd89d34935");
        // Workaround in
        // https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            // so just quietly finish and go away, dropping the user back into the activity
            // at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        //screen on
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        // ????????????????????????????????????????????????View
        sCocos2dxActivity = this;

        wx_api = WXAPIFactory.createWXAPI(this, wx_appid, true);
        wx_api.registerApp(wx_appid);
        showSplash();
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);

        //???????????????
        boolean checkPermissionFirst = PermissionUtils.checkPermissionFirst(this, PERMISSION_CODE_LOCATION,
                new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.RECORD_AUDIO});

        Log.e(TAG_LOCATION, "checkPermissionFirst " + checkPermissionFirst);


        mlocationClient = new AMapLocationClient(this);
        //?????????????????????
        mLocationOption = new AMapLocationClientOption();
        //??????????????????
        mlocationClient.setLocationListener(this);

        //???????????????????????????????????????Battery_Saving?????????????????????Device_Sensors??????????????????
        mLocationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);
        //??????????????????,????????????,?????????2000ms
        mLocationOption.setInterval(2000);
        //??????????????????
        mlocationClient.setLocationOption(mLocationOption);
        // ????????????????????????????????????????????????????????????????????????????????????????????????????????????
        // ??????????????????????????????????????????????????????????????????1000ms?????????????????????????????????stopLocation()???????????????????????????
        // ???????????????????????????????????????????????????onDestroy()??????
        // ?????????????????????????????????????????????????????????????????????stopLocation()???????????????????????????sdk???????????????
        //????????????
        if (checkPermissionFirst) {
            this.startLocation();
        }
    }

    public AMapLocationClientOption mLocationOption = null;

    private void startLocation() {
        mlocationClient.startLocation();
        Log.e(TAG_LOCATION, "startLocation");
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    public static String getInviter() {
        Log.d(TAG, "getInviter: " + inviter);
        return inviter;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();

    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();

    }


    @Override
    protected void onDestroy() {
        super.onDestroy();

        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }

        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
        if (requestCode == PictureSelector.SELECT_REQUEST_CODE) {
            String path = "";
            if (data != null) {
                PictureBean pictureBean = data.getParcelableExtra(PictureSelector.PICTURE_RESULT);
                if (pictureBean.isCut()) {
                    path = pictureBean.getPath();
                } else {
                    path = pictureBean.getUri().getPath();
                }
            }

            final String filePath = path;
            final String scope = isUploadAvatar?"avatar":"qrcode";
            sCocos2dxActivity.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    String CALLBACK_PATTERN = "window.__require('native-extend').Social.getPhotoCallback('%s','%s');";
                    String evalStr = String.format(CALLBACK_PATTERN, filePath, scope);
                    Cocos2dxJavascriptJavaBridge.evalString(evalStr);
                }
            });
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    @SuppressLint("HardwareIds")
    public static String getUUID() {
        return Settings.Secure.getString(getContext().getContentResolver(), Settings.Secure.ANDROID_ID);
    }

    public static void selectPicture() {
        isUploadAvatar = true;
        PictureSelector
                .create(sCocos2dxActivity, PictureSelector.SELECT_REQUEST_CODE)
                .selectPicture(true, 100, 100, 1, 1);
    }

    public static void selectQRCode() {
        isUploadAvatar = false;
        PictureSelector
                .create(sCocos2dxActivity, PictureSelector.SELECT_REQUEST_CODE)
                .selectPicture(true, 400, 400, 1, 1);
    }


    private static ClipboardManager getClipboardService() {
        return (ClipboardManager) getContext().getSystemService(CLIPBOARD_SERVICE);
    }

    public static void setCopy(String text) {
        ClipData clipdata = ClipData.newPlainText(null, text);
        ClipboardManager clipboard = getClipboardService();
        clipboard.setPrimaryClip(clipdata);
    }

    /**
     * ??????????????????????????????????????????????????????????????????
     *
     * @param phoneNum ????????????
     */
    public static void makeCall(String phoneNum) {
        Intent intent = new Intent(Intent.ACTION_DIAL);
        Uri data = Uri.parse("tel:" + phoneNum);
        intent.setData(data);
        sCocos2dxActivity.startActivity(intent);
    }

    /**???????????????????????????*/
    public static void openUrl(String url) {
        Uri uri = Uri.parse(url);
        Intent intent = new Intent(Intent.ACTION_VIEW,uri);
        sCocos2dxActivity.startActivity(intent);
    }

    public static String getCopy() {
        String empStr = "";
        try {

            ClipboardManager clipboard = getClipboardService();
            ClipData clipData = clipboard.getPrimaryClip();
            if (clipData != null && clipData.getItemCount() >= 1) {
                ClipData.Item firstItem = clipboard.getPrimaryClip().getItemAt(0);
                empStr = "" + firstItem.getText();
            }
        } catch (Exception e) {
            Log.d(TAG, "getCopy: " + e.getMessage());
        }
        return empStr;
    }

    public static String uploadImage(String url, String token, String imagePath) throws IOException, JSONException {
        try {
            OkHttpClient okHttpClient = new OkHttpClient();
            Log.d(TAG, "imagePath " + imagePath);
            File file = new File(imagePath);
            if (!file.exists()) {
                return "";
            }
            RequestBody image = RequestBody.create(MediaType.parse("image/png"), file);
            RequestBody requestBody = new MultipartBody.Builder()
                    .setType(MultipartBody.FORM)
                    .addFormDataPart("file", imagePath, image)
                    .build();
            Request request = new Request.Builder()
                    .url(url)
                    .header("Authorization", "Bearer " + token)
                    .post(requestBody)
                    .build();
            Response response = okHttpClient.newCall(request).execute();
            JSONObject jsonObject = new JSONObject(response.body().string());
            return jsonObject.optString("image");
        } catch (Exception ex) {
            return "";
        }
    }

    private boolean isToast = true;//??????????????????????????????for??????????????????

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        boolean isPermissions = true;
        for (int i = 0; i < permissions.length; i++) {
            if (grantResults[i] == PackageManager.PERMISSION_DENIED) {
                isPermissions = false;
                if (!ActivityCompat.shouldShowRequestPermissionRationale(this, permissions[i])) { //???????????????"????????????"
                    // if (isToast) {
                        Toast.makeText(this, "???????????????????????????????????????", Toast.LENGTH_SHORT).show();
                    //     isToast = false;
                    // }
                }
            }
        }
        isToast = true;
        if (isPermissions && requestCode == PERMISSION_CODE_LOCATION) {
            Log.d("onRequestPermission", "onRequestPermissionsResult: " + "??????????????????");
            this.startLocation();
        } else {
            Log.d("onRequestPermission", "onRequestPermissionsResult: " + "??????????????????");
//            finish();
        }
    }
    public static int saveTextureToLocal( String imgPath) {
        Log.d("????????????", imgPath);
        //???????????????????????? ??????????????????  ?????????????????????????????????

        boolean checkPermissionFirst = PermissionUtils.checkPermissionFirst(sCocos2dxActivity, PERMISSION_CODE_SAVEIMAGE,
                new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE});

        if (!checkPermissionFirst) {
            // Toast.makeText(sCocos2dxActivity, "????????????", Toast.LENGTH_SHORT).show();
            return 0;
        }
        //?????????????????? ??????
        Bitmap bmp = BitmapFactory.decodeFile(imgPath);
        if (AppActivity.saveImageToGallery(sCocos2dxActivity, bmp)) {
            sCocos2dxActivity.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString("window.__require('native-extend').Social.saveImageCallback(true);");
                }
            });
        } else {
            sCocos2dxActivity.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString("window.__require('native-extend').Social.saveImageCallback(false);");
                }
            });
        }
        return 1;
    }

    public static boolean saveImageToGallery(Context context, Bitmap bmp) {
        // ??????????????????
        String storePath = Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "dearxy";
        File appDir = new File(storePath);
        if (!appDir.exists()) {
            appDir.mkdir();
        }
        String fileName = System.currentTimeMillis() + ".jpg";
        File file = new File(appDir, fileName);
        try {
            FileOutputStream fos = new FileOutputStream(file);
            //??????io?????????????????????????????????
            boolean isSuccess = bmp.compress(Bitmap.CompressFormat.JPEG, 60, fos);
            fos.flush();
            fos.close();

            //??????????????????????????????
            //MediaStore.Images.Media.insertImage(context.getContentResolver(), file.getAbsolutePath(), fileName, null);

            //????????????????????????????????????????????????
            Uri uri = Uri.fromFile(file);
            context.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, uri));
            MediaScannerConnection.scanFile(sCocos2dxActivity,
                    new String[]{file.getAbsolutePath()},
                    new String[]{"image/jpeg"},
                    new MediaScannerConnection.OnScanCompletedListener() {

                        public void onScanCompleted(String path, Uri uri) {
                            Log.i("TAG", "Finished scanning " + path);
                        }
                    });
            return isSuccess;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return false;
    }

    public static void initSDK(Context context, String appId) {
        CrashReport.initCrashReport(context.getApplicationContext(), appId, false);
    }

    public static void postException(int category, String name, String reason, String stack){
        postException(category, name, reason, stack, null);
    }

    public static void postException(int category, String name, String reason, String stack, Map<String, String> extraInfo){
        CrashReport.postException(category, name, reason, stack, extraInfo);
    }
}
