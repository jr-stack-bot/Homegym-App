package de.joschy.homegym;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.graphics.drawable.Icon;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;
import org.json.JSONArray;
import org.json.JSONObject;

/** Foreground service that shows the training / rest timer while the app is in the background
 *  and announces the end of a rest even when the app is not on screen. */
public class TimerService extends Service {
    static final String CH_T = "hg_timer";
    static final String CH_A = "hg_alert";
    static final int NID = 1;
    static final int AID = 2;
    static final String ACTION_ADD15 = "de.joschy.homegym.ADD15";

    static volatile TimerService inst;
    static volatile String pending;
    /** end of the current rest in ms epoch, 0 if no rest is running. */
    static volatile long endTime;
    /** end time of the rest whose end was already announced by the service. */
    static volatile long playedFor;
    /** set by stop(); a service that is just starting goes foreground first and then stops itself. */
    static volatile boolean stopRequested;

    final Handler h = new Handler(Looper.getMainLooper());
    JSONObject st = new JSONObject();
    boolean ended;
    PowerManager.WakeLock wl;
    MediaPlayer mp;
    volatile boolean stopping;
    int lastStartId;

    final Runnable endR = new Runnable() {
        public void run() { onRestEnd(); }
    };

    static void update(Context c, String json) {
        pending = json;
        stopRequested = false;
        final TimerService s = inst;
        if (s != null && !s.stopping) {
            s.h.post(new Runnable() {
                public void run() {
                    if (s.stopping) return;
                    String j = pending;
                    if (j != null) s.apply(j);
                }
            });
            return;
        }
        try {
            Intent i = new Intent(c, TimerService.class);
            if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(i);
            else c.startService(i);
        } catch (Throwable t) { }
    }

    static void stop(Context c) {
        endTime = 0;
        pending = null;
        stopRequested = true;
        final TimerService s = inst;
        if (s != null) {
            // stop on the service's own thread, after any startForeground that is still pending
            s.h.post(new Runnable() {
                public void run() { if (stopRequested) s.stopNow(); }
            });
        }
        // a service that is still being started stops itself in onStartCommand after startForeground
        try {
            NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm != null) nm.cancel(AID);
        } catch (Throwable t) { }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        inst = this;
        channels();
        try { st = new JSONObject(pending != null ? pending : "{}"); } catch (Throwable t) { st = new JSONObject(); }
        startFg(build());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // every start via startForegroundService must reach startForeground, even if it is a stop
        lastStartId = startId;
        startFg(build());
        if (stopRequested) {
            stopNow();
            return START_NOT_STICKY;
        }
        stopping = false; // a new start after a stop request keeps the service alive
        if (intent != null && ACTION_ADD15.equals(intent.getAction())) {
            add15();
        } else if (pending != null) {
            apply(pending);
        }
        return START_NOT_STICKY;
    }

    void stopNow() {
        stopping = true;
        endTime = 0;
        h.removeCallbacks(endR);
        releaseWake();
        releasePlayer();
        try {
            if (Build.VERSION.SDK_INT >= 24) stopForeground(Service.STOP_FOREGROUND_REMOVE);
            else stopForeground(true);
        } catch (Throwable t) { }
        try { stopSelfResult(lastStartId); } catch (Throwable t) { }
    }

    @Override
    public void onDestroy() {
        stopping = true;
        if (inst == this) inst = null;
        h.removeCallbacks(endR);
        releaseWake();
        releasePlayer();
        try {
            if (Build.VERSION.SDK_INT >= 24) stopForeground(Service.STOP_FOREGROUND_REMOVE);
            else stopForeground(true);
        } catch (Throwable t) { }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent i) { return null; }

    void startFg(Notification n) {
        try {
            if (Build.VERSION.SDK_INT >= 34) startForeground(NID, n, 0x40000000); // FOREGROUND_SERVICE_TYPE_SPECIAL_USE
            else startForeground(NID, n);
        } catch (Throwable t) { }
    }

    void channels() {
        if (Build.VERSION.SDK_INT < 26) return;
        try {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel t = new NotificationChannel(CH_T, "Trainings-Timer", NotificationManager.IMPORTANCE_LOW);
            t.setDescription("Zeigt Pause und laufendes Training an");
            t.setShowBadge(false);
            t.setSound(null, null);
            t.enableVibration(false);
            nm.createNotificationChannel(t);
            NotificationChannel a = new NotificationChannel(CH_A, "Pause vorbei", NotificationManager.IMPORTANCE_HIGH);
            a.setDescription("Meldet das Ende der Pause");
            a.setSound(null, null);
            a.enableVibration(false);
            nm.createNotificationChannel(a);
        } catch (Throwable e) { }
    }

    void apply(String json) {
        try { st = new JSONObject(json); } catch (Throwable t) { return; }
        String phase = st.optString("phase", "");
        long e = "rest".equals(phase) ? st.optLong("endTime", 0) : 0;
        h.removeCallbacks(endR);
        releaseWake();
        endTime = e;
        ended = false;
        long now = System.currentTimeMillis();
        if (e > now) {
            h.postDelayed(endR, e - now);
            try {
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                wl = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "homegym:rest");
                wl.setReferenceCounted(false);
                wl.acquire(e - now + 20000);
            } catch (Throwable t) { wl = null; }
        }
        notifyMain();
    }

    void add15() {
        if (endTime <= 0 || ended) return;
        endTime += 15000;
        try { st.put("endTime", endTime); } catch (Throwable t) { }
        h.removeCallbacks(endR);
        long d = endTime - System.currentTimeMillis();
        h.postDelayed(endR, Math.max(0, d));
        if (wl != null) { try { wl.acquire(d + 20000); } catch (Throwable t) { } }
        notifyMain();
    }

    void notifyMain() {
        try {
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            nm.notify(NID, build());
        } catch (Throwable t) { }
    }

    PendingIntent openPI() {
        Intent i = new Intent(this, MainActivity.class);
        i.setAction(Intent.ACTION_MAIN);
        i.addCategory(Intent.CATEGORY_LAUNCHER);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        return PendingIntent.getActivity(this, 0, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    @SuppressWarnings("deprecation")
    Notification.Builder builder(String ch) {
        Notification.Builder b;
        if (Build.VERSION.SDK_INT >= 26) b = new Notification.Builder(this, ch);
        else {
            b = new Notification.Builder(this);
            b.setPriority(CH_A.equals(ch) ? Notification.PRIORITY_HIGH : Notification.PRIORITY_LOW);
        }
        b.setSmallIcon(android.R.drawable.ic_lock_idle_alarm);
        b.setContentIntent(openPI());
        b.setVisibility(Notification.VISIBILITY_PUBLIC);
        b.setColor(0xFF3EE6FF);
        return b;
    }

    Notification build() {
        String phase = st.optString("phase", "");
        Notification.Builder b = builder(CH_T);
        b.setOngoing(true);
        b.setOnlyAlertOnce(true);
        b.setCategory(Notification.CATEGORY_PROGRESS);
        if ("rest".equals(phase) && endTime > 0 && !ended) {
            b.setContentTitle(st.optString("title", "Pause"));
            b.setContentText(st.optString("text", ""));
            b.setShowWhen(true);
            b.setUsesChronometer(true);
            if (Build.VERSION.SDK_INT >= 24) b.setChronometerCountDown(true);
            b.setWhen(endTime);
            try {
                Intent add = new Intent(this, TimerService.class);
                add.setAction(ACTION_ADD15);
                PendingIntent pi = PendingIntent.getService(this, 1, add, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
                b.addAction(new Notification.Action.Builder(
                        Icon.createWithResource(this, android.R.drawable.ic_input_add), "+15 s", pi).build());
            } catch (Throwable t) { }
        } else if ("rest".equals(phase) && ended) {
            b.setContentTitle("Pause vorbei");
            b.setContentText(st.optString("alert", "Weiter geht's"));
            b.setShowWhen(false);
        } else {
            b.setContentTitle(st.optString("title", "Training läuft"));
            b.setContentText(st.optString("text", ""));
            long start = st.optLong("start", 0);
            if (start > 0) {
                b.setShowWhen(true);
                b.setUsesChronometer(true);
                b.setWhen(start);
            } else b.setShowWhen(false);
        }
        return b.build();
    }

    void onRestEnd() {
        ended = true;
        long e = endTime;
        notifyMain();
        if (MainActivity.visible) { releaseWake(); return; } // the app is on screen (also picture-in-picture) and announces itself
        playedFor = e;
        vibrate();
        try {
            Notification.Builder b = builder(CH_A);
            b.setContentTitle("Pause vorbei");
            b.setContentText(st.optString("alert", "Weiter geht's"));
            b.setAutoCancel(true);
            b.setCategory(Notification.CATEGORY_ALARM);
            b.setShowWhen(true);
            b.setWhen(System.currentTimeMillis());
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            nm.notify(AID, b.build());
        } catch (Throwable t) { }
        JSONArray seq = st.optJSONArray("endSeq");
        if (st.optBoolean("jai", false) && seq != null && seq.length() > 0) {
            playSeq(seq, 0); // releases the wake lock after the last clip (timeout stays as a safety net)
        } else {
            if (st.optBoolean("sound", true)) systemSound();
            releaseWake();
        }
    }

    @SuppressWarnings("deprecation")
    void vibrate() {
        try {
            Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v == null) return;
            long[] p = new long[]{0, 400, 150, 400};
            if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createWaveform(p, -1));
            else v.vibrate(p, -1);
        } catch (Throwable t) { }
    }

    void systemSound() {
        try {
            Ringtone r = RingtoneManager.getRingtone(this, RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION));
            if (r != null) r.play();
        } catch (Throwable t) { }
    }

    void releasePlayer() {
        if (mp != null) {
            try { mp.release(); } catch (Throwable t) { }
            mp = null;
        }
    }

    void playSeq(final JSONArray seq, final int idx) {
        releasePlayer();
        if (stopping || idx >= seq.length()) { releaseWake(); return; }
        String id = seq.optString(idx, "");
        if (id.length() == 0 || id.indexOf('/') >= 0 || id.indexOf('.') >= 0) { playSeq(seq, idx + 1); return; }
        AssetFileDescriptor fd = null;
        MediaPlayer p = null;
        boolean ok = false;
        try {
            fd = getAssets().openFd("jai/" + id + ".mp3");
            p = new MediaPlayer();
            p.setAudioAttributes(new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build());
            p.setDataSource(fd.getFileDescriptor(), fd.getStartOffset(), fd.getLength());
            p.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                public void onCompletion(MediaPlayer m) { next(seq, idx); }
            });
            p.setOnErrorListener(new MediaPlayer.OnErrorListener() {
                public boolean onError(MediaPlayer m, int what, int extra) { next(seq, idx); return true; }
            });
            p.prepare();
            mp = p;
            p.start();
            ok = true;
        } catch (Throwable t) {
            ok = false;
        } finally {
            if (fd != null) { try { fd.close(); } catch (Throwable t) { } }
            if (!ok && p != null) {
                if (mp == p) mp = null;
                try { p.release(); } catch (Throwable t) { }
            }
        }
        if (!ok) playSeq(seq, idx + 1);
    }

    void next(final JSONArray seq, final int idx) {
        h.postDelayed(new Runnable() {
            public void run() { playSeq(seq, idx + 1); }
        }, 90);
    }

    void releaseWake() {
        if (wl != null) {
            try { if (wl.isHeld()) wl.release(); } catch (Throwable t) { }
            wl = null;
        }
    }
}
