package org.openpolito.app;

import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.work.BackoffPolicy;
import androidx.work.Data;
import androidx.work.OneTimeWorkRequest;
import androidx.work.OutOfQuotaPolicy;
import androidx.work.WorkManager;
import androidx.work.WorkRequest;

import com.facebook.react.HeadlessJsTaskService;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;
import java.util.concurrent.TimeUnit;

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
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            NotificationChannel notificationChannel =
//                    new NotificationChannel(getString(channelDetails.id), getString(channelDetails.title), NotificationManager.IMPORTANCE_DEFAULT);
//            notificationChannel.setDescription(getString(channelDetails.description));
//            NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
//            notificationManager.createNotificationChannel(notificationChannel);
//        }

        // Notification
//        Notification notification = new NotificationCompat.Builder(this, getString(channelDetails.id))
//                .setContentTitle(data.get("title") != null ? data.get("title") : "")
//                .setContentText(data.get("message") != null ? data.get("message") : "")
//                .setStyle(new NotificationCompat.BigTextStyle().bigText(data.get("message") != null ? data.get("message") : ""))
//                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
//                .setAutoCancel(true)
//                .setColor(getResources().getColor(R.color.accent_300))
//                .setSmallIcon(R.drawable.ic_tablericons_school)
//                .build();
//
//        NotificationManagerCompat notificationManagerCompat = NotificationManagerCompat.from(this);
//        int notificationId;
//        try {
//            String idString = data.get("polito_id_notifica");
//            if (idString == null) idString = "1";
//            notificationId = Integer.parseInt(idString);
//        } catch (NumberFormatException e) {
//            notificationId = 1;
//        }
//        notificationManagerCompat.notify(notificationId, notification);
//
//        Log.d(TAG, "Displayed notification");

        // Open headless JS notification task

        Log.d(TAG, "Creating work");

        Context context = getApplicationContext();

        Data.Builder workDataBuilder = new Data.Builder();
        for (Map.Entry<String, String> entry : data.entrySet()) {
            try {
                workDataBuilder.putString(entry.getKey(), entry.getValue());
            } catch (IllegalStateException e) {}
        }

        workDataBuilder.putString("channelId", getString(channelDetails.id));
        workDataBuilder.putString("channelName", getString(channelDetails.title));
        workDataBuilder.putString("channelDescription", getString(channelDetails.description));

        Data workData = workDataBuilder.build();

        WorkRequest workRequest = new OneTimeWorkRequest.Builder(NotificationHandlerWork.class)
                .setInputData(workData)
                .setBackoffCriteria(BackoffPolicy.LINEAR, OneTimeWorkRequest.MIN_BACKOFF_MILLIS, TimeUnit.MILLISECONDS)
                .setExpedited(OutOfQuotaPolicy.RUN_AS_NON_EXPEDITED_WORK_REQUEST)
                .build();

        WorkManager.getInstance(context).enqueue(workRequest);

        Log.d(TAG, "Enqueued work!");
    }
}
