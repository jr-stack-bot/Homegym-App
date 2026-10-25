package de.joschy.homegym;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.PictureInPictureParams;
import android.content.Context;
import android.content.res.Configuration;
import android.media.AudioManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Rational;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {
    static volatile MainActivity inst;
    /** true while the activity is started (also true in picture-in-picture). */
    static volatile boolean visible;
    /** set by the web app: an active training is running and the mini window is enabled. */
    static volatile boolean pipWanted;

    WebView web;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        inst = this;
        setVolumeControlStream(AudioManager.STREAM_MUSIC);
        Window w = getWindow();
        w.addFlags(0x80); // FLAG_KEEP_SCREEN_ON
        w.setStatusBarColor(0xFF03060B);
        w.setNavigationBarColor(0xFF03060B);
        web = new WebView(this);
        web.setBackgroundColor(0xFF03060B);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setTextZoom(100);
        web.setWebViewClient(new WebViewClient());
        web.addJavascriptInterface(new Bridge(this), "Android");
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
    }

    @Override
    protected void onStart() {
        super.onStart();
        visible = true;
        try {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.cancel(TimerService.AID);
        } catch (Throwable t) { }
        js("window.appResume&&window.appResume()");
    }

    @Override
    protected void onStop() {
        visible = false;
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        if (inst == this) inst = null;
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        js("window.appBack&&window.appBack()");
    }

    @Override
    protected void onUserLeaveHint() {
        super.onUserLeaveHint();
        if (pipWanted && Build.VERSION.SDK_INT >= 26) {
            try {
                PictureInPictureParams p = new PictureInPictureParams.Builder()
                        .setAspectRatio(new Rational(3, 4)).build();
                enterPictureInPictureMode(p);
            } catch (Throwable t) { }
        }
    }

    @Override
    public void onPictureInPictureModeChanged(boolean inPip, Configuration cfg) {
        super.onPictureInPictureModeChanged(inPip, cfg);
        js("window.appPip&&window.appPip(" + (inPip ? "true" : "false") + ")");
    }

    void js(final String code) {
        final WebView w = web;
        if (w == null) return;
        w.post(new Runnable() {
            public void run() {
                try { w.evaluateJavascript(code, null); } catch (Throwable t) { }
            }
        });
    }

    void askNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33) {
            runOnUiThread(new Runnable() {
                public void run() {
                    try {
                        if (checkSelfPermission("android.permission.POST_NOTIFICATIONS") != 0) {
                            requestPermissions(new String[]{"android.permission.POST_NOTIFICATIONS"}, 7);
                        }
                    } catch (Throwable t) { }
                }
            });
        }
    }
}
