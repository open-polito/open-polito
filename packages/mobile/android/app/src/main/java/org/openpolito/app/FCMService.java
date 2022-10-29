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
        NotificationUtils.NotificationChannelDetails channelDetails;

        String rawChannelName = data.get("polito_transazione");
        if (rawChannelName == null) rawChannelName = "";

        channelDetails = NotificationUtils.getChannelDetails(rawChannelName);


        // Create notification channel for API level >= 26
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel notificationChannel =
                    new NotificationChannel(getString(channelDetails.id), getString(channelDetails.title), NotificationManager.IMPORTANCE_DEFAULT);
            notificationChannel.setDescription(getString(channelDetails.description));
            NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.createNotificationChannel(notificationChannel);
        }

        // Notification
        Notification notification = new NotificationCompat.Builder(this, getString(channelDetails.id))
                .setContentTitle(data.get("title") != null ? data.get("title") : "")
                .setContentText(data.get("message") != null ? data.get("message") : "")
                .setStyle(new NotificationCompat.BigTextStyle().bigText(data.get("message") != null ? data.get("message") : ""))
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(true)
                .setColor(getResources().getColor(R.color.accent_300))
                .setSmallIcon(R.drawable.ic_tablericons_school)
                .build();

        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(this);
        int notificationId;
        try {
            String idString = data.get("polito_id_notifica");
            if (idString == null) idString = "1";
            notificationId = Integer.parseInt(idString);
        } catch (NumberFormatException e) {
            notificationId = 1;
        }
        notificationManagerCompat.notify(notificationId, notification);

        Log.d(TAG, "Displayed notification");

    }

}
