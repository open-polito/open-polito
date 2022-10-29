package org.openpolito.app;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.annotation.NonNull;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

public class UpdaterModule extends ReactContextBaseJavaModule {
    UpdaterModule(ReactApplicationContext context) {
        super(context);
    }

    @ReactMethod
    public void installUpdate() {
        Context context = getReactApplicationContext();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!context.getPackageManager().canRequestPackageInstalls()) {
                getCurrentActivity().startActivityForResult(
                        new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES)
                                .setData(Uri.parse("package:" + getCurrentActivity().getPackageName()))
                        , 1);
            }
        }
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(uriFromFile(new File(
                context.getExternalFilesDir(null) + "/update.apk"
        )), "application/vnd.android.package-archive");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        try {
            context.startActivity(intent);
        } catch (ActivityNotFoundException ignored) {
        }
    }

    private Uri uriFromFile(File file) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            return FileProvider.getUriForFile(getReactApplicationContext(), BuildConfig.APPLICATION_ID + ".provider", file);
        }
        return Uri.fromFile(file);
    }

    @NonNull
    @Override
    public String getName() {
        return "UpdaterModule";
    }
}
