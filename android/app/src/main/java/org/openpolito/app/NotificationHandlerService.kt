package org.openpolito.app

import android.content.Intent
import android.util.Log
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.jstasks.LinearCountingRetryPolicy

class NotificationHandlerService : HeadlessJsTaskService() {
    private val TAG = "OP_NotificationHandlerS";

    private val retryPolicy = LinearCountingRetryPolicy(5, 3000);

    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {

        Log.d(TAG, "Starting headless JS");

        return intent.extras?.let {
            HeadlessJsTaskConfig(
                "NotificationTask",
                Arguments.fromBundle(it),
                5000, // task timeout
                true, // allowed in foreground?
                retryPolicy
            )
        }
    }
}