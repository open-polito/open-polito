package org.openpolito.app

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.jstasks.LinearCountingRetryPolicy

class NotificationHandlerService : HeadlessJsTaskService() {
    private final val retryPolicy = LinearCountingRetryPolicy(5, 3000);

    override fun getTaskConfig(intent: Intent): HeadlessJsTaskConfig? {
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