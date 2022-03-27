package org.openpolito.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;
import java.util.Objects;

public class FCMService extends FirebaseMessagingService {

    private static final String TAG = "OP_FCMService";

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        // super.onMessageReceived(remoteMessage);
        Log.d(TAG, "Received message");
        showNotification(remoteMessage);
    }

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        Log.d(TAG, "New token generated");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "Created FCM Service");
    }

    private void showNotification(RemoteMessage remoteMessage) {
        Map<String, String> data = remoteMessage.getData();
        String channelName;

        // TODO localize channel names?
        // TODO set channel descriptions
        try {
            channelName = NotificationUtils.getChannelName(
                    Objects.requireNonNull(data.get("polito_transazione") != null ? data.get("polito_transazione") : NotificationUtils.DEFAULT_TOPIC)
            );
        } catch (NullPointerException e) {
            Log.d(TAG, "Null notification topic!");
            channelName = NotificationUtils.DEFAULT_TOPIC;
        }

        // Create notification channel for API level >= 26
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel notificationChannel =
                    new NotificationChannel(channelName.toLowerCase(), channelName, NotificationManager.IMPORTANCE_DEFAULT);
            NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.createNotificationChannel(notificationChannel);
        }

        // Notification
        Notification notification = new NotificationCompat.Builder(this, channelName.toLowerCase())
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle(data.get("title") != null ? data.get("title") : "")
                .setContentText(data.get("message") != null ? data.get("message") : "")
                .setStyle(new NotificationCompat.BigTextStyle().bigText(data.get("message") != null ? data.get("message") : ""))
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true)
                .build();

        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(this);
        notificationManagerCompat.notify(Integer.parseInt(data.get("polito_id_notifica") != null ? data.get("polito_id_notifica") : "1"), notification);

        Log.d(TAG, "Displayed notification");

    }

}
