package org.openpolito.app

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.facebook.react.HeadlessJsTaskService

class NotificationHandlerWork(appContext: Context, workerParams: WorkerParameters) : Worker(appContext, workerParams) {
    private val TAG = "OP_NotificationHandlerW";

    override fun doWork(): Result {
        val intent = Intent(applicationContext, NotificationHandlerService::class.java);
        val bundle = Bundle();

        for (item in inputData.keyValueMap) {
            try {
                bundle.putString(item.key, item.value as String?);
            } catch (e: IllegalStateException) {
            }
        }

        intent.putExtras(bundle);

        Log.d(TAG, "Starting headless JS service");

        applicationContext.startService(intent);
        HeadlessJsTaskService.acquireWakeLockNow(applicationContext);

        Log.d(TAG, "Started headless JS service");

        return Result.success();
    }
}