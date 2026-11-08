/* Homegym 2.1 · @ Joschy */
package de.joschy.homegym;

import android.app.Activity;
import android.app.NotificationManager;
import android.app.PictureInPictureParams;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import org.json.JSONObject;
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
    static final int REQ_SAVE = 41, REQ_OPEN = 42;
    /** JSON waiting for the "save as" dialog (Android 7-9). */
    private String pendingBackup;
    /** true while the system file dialog is open: no picture-in-picture then. */
    private volatile boolean pickerOpen;

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
        if (pipWanted && !pickerOpen && Build.VERSION.SDK_INT >= 26) {
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

    /* ================= Backup (no storage permission needed on API 24-34) ================= */
    void saveBackup(final String json, final String rawName) {
        final String name = (rawName == null || rawName.length() == 0) ? "homegym-backup.json" : rawName;
        if (Build.VERSION.SDK_INT >= 29) {
            new Thread(new Runnable() {
                public void run() {
                    try {
                        backupDone(true, writeDownloads(name, json));
                    } catch (Throwable t) {
                        backupDone(false, "Datei konnte nicht geschrieben werden");
                    }
                }
            }).start();
            return;
        }
        // Android 7-9: public Downloads would need WRITE_EXTERNAL_STORAGE -> use the system "save as" dialog instead
        runOnUiThread(new Runnable() {
            public void run() {
                try {
                    pendingBackup = json;
                    Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType("application/json");
                    i.putExtra(Intent.EXTRA_TITLE, name);
                    pickerOpen = true;
                    startActivityForResult(i, REQ_SAVE);
                } catch (Throwable t) {
                    pickerOpen = false;
                    pendingBackup = null;
                    backupDone(false, "Kein Dateidialog verfügbar");
                }
            }
        });
    }

    /** Android 10+: MediaStore Downloads, overwrites our own earlier backup with the same name. */
    private String writeDownloads(String name, String json) throws Exception {
        ContentResolver cr = getContentResolver();
        Uri coll = MediaStore.Downloads.EXTERNAL_CONTENT_URI;
        String dir = Environment.DIRECTORY_DOWNLOADS + "/";
        Uri uri = null;
        Cursor c = null;
        try {
            c = cr.query(coll, new String[]{MediaStore.MediaColumns._ID},
                    MediaStore.MediaColumns.DISPLAY_NAME + "=? AND " + MediaStore.MediaColumns.RELATIVE_PATH + "=?",
                    new String[]{name, dir}, null);
            if (c != null && c.moveToFirst()) uri = ContentUris.withAppendedId(coll, c.getLong(0));
        } catch (Throwable t) {
            uri = null;
        } finally {
            if (c != null) c.close();
        }
        boolean fresh = uri == null;
        if (fresh) {
            ContentValues v = new ContentValues();
            v.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
            v.put(MediaStore.MediaColumns.MIME_TYPE, "application/json");
            v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
            v.put(MediaStore.MediaColumns.IS_PENDING, 1);
            uri = cr.insert(coll, v);
            if (uri == null) throw new Exception("insert failed");
        }
        writeUri(uri, json);
        if (fresh) {
            ContentValues v = new ContentValues();
            v.put(MediaStore.MediaColumns.IS_PENDING, 0);
            cr.update(uri, v, null, null);
        }
        return "Downloads/" + name;
    }

    private void writeUri(Uri uri, String text) throws Exception {
        OutputStream os = null;
        try {
            try { os = getContentResolver().openOutputStream(uri, "wt"); } catch (Throwable t) { os = null; }
            if (os == null) os = getContentResolver().openOutputStream(uri, "w");
            if (os == null) throw new Exception("no stream");
            os.write(text.getBytes("UTF-8"));
            os.flush();
        } finally {
            if (os != null) try { os.close(); } catch (Throwable t) { }
        }
    }

    void openBackup() {
        runOnUiThread(new Runnable() {
            public void run() {
                try {
                    Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType("*/*");
                    i.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/json", "text/plain", "application/octet-stream"});
                    pickerOpen = true;
                    startActivityForResult(i, REQ_OPEN);
                } catch (Throwable t) {
                    pickerOpen = false;
                    js("window.hgBackupLoaded&&window.hgBackupLoaded(null)");
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int req, int res, Intent data) {
        super.onActivityResult(req, res, data);
        pickerOpen = false;
        final Uri uri = (res == RESULT_OK && data != null) ? data.getData() : null;
        if (req == REQ_SAVE) {
            final String json = pendingBackup;
            pendingBackup = null;
            if (uri == null || json == null) { backupDone(false, "abgebrochen"); return; }
            new Thread(new Runnable() {
                public void run() {
                    try {
                        writeUri(uri, json);
                        String n = uri.getLastPathSegment();
                        backupDone(true, n != null && n.length() < 80 ? n : "homegym-backup.json");
                    } catch (Throwable t) {
                        backupDone(false, "Datei konnte nicht geschrieben werden");
                    }
                }
            }).start();
        } else if (req == REQ_OPEN) {
            if (uri == null) { js("window.hgBackupLoaded&&window.hgBackupLoaded(null)"); return; }
            new Thread(new Runnable() {
                public void run() {
                    String arg = "null";
                    String err = "null";
                    InputStream in = null;
                    try {
                        in = getContentResolver().openInputStream(uri);
                        if (in == null) throw new Exception("no stream");
                        ByteArrayOutputStream bo = new ByteArrayOutputStream();
                        byte[] buf = new byte[16384];
                        int n, total = 0;
                        while (in != null && (n = in.read(buf)) > 0) {
                            total += n;
                            if (total > 30 * 1024 * 1024) throw new Exception("too big");
                            bo.write(buf, 0, n);
                        }
                        arg = jsString(new String(bo.toByteArray(), "UTF-8"));
                    } catch (Throwable t) {
                        arg = "null";
                        err = jsString("Datei konnte nicht gelesen werden");
                    } finally {
                        if (in != null) try { in.close(); } catch (Throwable t) { }
                    }
                    js("window.hgBackupLoaded&&window.hgBackupLoaded(" + arg + "," + err + ")");
                }
            }).start();
        }
    }

    private void backupDone(boolean ok, String where) {
        js("window.hgBackupSaved&&window.hgBackupSaved(" + (ok ? "true" : "false") + "," + jsString(where) + ")");
    }

    /** JSON string literal that is also a safe JS literal (line separators escaped for older WebViews). */
    static String jsString(String s) {
        return JSONObject.quote(s == null ? "" : s).replace("\u2028", "\\u2028").replace("\u2029", "\\u2029");
    }
}
