/* Homegym 2.3 · @ Joschy */
package de.joschy.homegym;

import android.app.Activity;
import android.content.Context;
import android.os.Vibrator;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import java.util.Locale;
import org.json.JSONObject;

public class Bridge {
    private final Activity a;
    private TextToSpeech tts;
    private boolean askedPermission;

    public Bridge(Activity a) {
        this.a = a;
        try { tts = new TextToSpeech(a, null); } catch (Throwable t) { tts = null; }
    }

    @JavascriptInterface
    public void exit() { a.finish(); }

    @JavascriptInterface
    public void vibrate(int ms) {
        try {
            Vibrator v = (Vibrator) a.getSystemService(Context.VIBRATOR_SERVICE);
            if (v != null) v.vibrate((long) ms);
        } catch (Throwable t) { }
    }

    @JavascriptInterface
    public void speak(String s) {
        if (tts == null) return;
        try {
            tts.setLanguage(Locale.GERMAN);
            tts.speak(s, TextToSpeech.QUEUE_FLUSH, null, "hg");
        } catch (Throwable t) { }
    }

    /** Training state from the web app (JSON). active:false ends the timer service. */
    @JavascriptInterface
    public void trainingState(String json) {
        try {
            JSONObject o = new JSONObject(json);
            boolean active = o.optBoolean("active", false);
            MainActivity.pipWanted = active && o.optBoolean("pip", true);
            if (!active || !o.optBoolean("notif", true)) {
                TimerService.stop(a.getApplicationContext());
                return;
            }
            if (!askedPermission && a instanceof MainActivity) {
                askedPermission = true;
                ((MainActivity) a).askNotificationPermission();
            }
            TimerService.update(a.getApplicationContext(), json);
        } catch (Throwable t) { }
    }

    /** true while the app is on screen (also in picture-in-picture). */
    @JavascriptInterface
    public boolean isVisible() { return MainActivity.visible; }

    /** true if the service already announced the end of the rest that ends at endTime. */
    @JavascriptInterface
    public boolean wasPlayed(String endTime) {
        try {
            long e = Long.parseLong(endTime);
            return e > 0 && Math.abs(TimerService.playedFor - e) < 1500;
        } catch (Throwable t) { return false; }
    }

    /** current rest end as seen by the service (changes with the +15 s action), "0" if none. */
    @JavascriptInterface
    public String restEnd() { return String.valueOf(TimerService.endTime); }

    /** Design colours from the web app: "#rrggbb" for status and navigation bar, lightIcons = dark icons for a light design. */
    @JavascriptInterface
    public void setSystemBars(String statusHex, String navHex, boolean lightIcons) {
        try {
            int status = parseColor(statusHex);
            int nav = navHex == null || navHex.length() == 0 ? status : parseColor(navHex);
            if (a instanceof MainActivity) ((MainActivity) a).setSystemBars(status, nav, lightIcons);
        } catch (Throwable t) { }
    }

    /** "#rrggbb" -> opaque ARGB int; throws on anything else. */
    static int parseColor(String s) {
        String h = s == null ? "" : s.trim();
        if (h.startsWith("#")) h = h.substring(1);
        if (h.length() != 6) throw new IllegalArgumentException("colour " + s);
        return 0xFF000000 | Integer.parseInt(h, 16);
    }

    /** Backup: writes the JSON to Download/<name> (MediaStore on Android 10+, system "save as" dialog below). Result: window.hgBackupSaved(ok, where). */
    @JavascriptInterface
    public void saveBackup(String json, String name) {
        if (a instanceof MainActivity) ((MainActivity) a).saveBackup(json, name);
    }

    /** Backup import: opens the system file picker; the text comes back via window.hgBackupLoaded(text|null). */
    @JavascriptInterface
    public void openBackup() {
        if (a instanceof MainActivity) ((MainActivity) a).openBackup();
    }
}
