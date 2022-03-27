package org.openpolito.app;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;

public class NotificationModule extends ReactContextBaseJavaModule {

    private static final String TAG = "OP_NotificationModule";
    private static String token = "";

    NotificationModule(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "NotificationModule";
    }

    /**
     * Gets FCM token
     */
    @ReactMethod
    public void getToken(Promise promise) {
        FirebaseMessaging.getInstance().getToken().addOnCompleteListener(new OnCompleteListener<String>() {
            @Override
            public void onComplete(@NonNull Task<String> task) {
                if (!task.isSuccessful()) {
                    Log.d(TAG, "Can't get FCM token!");
                }
                token = task.getResult();
                promise.resolve(token);
            }
        });
    }
}
