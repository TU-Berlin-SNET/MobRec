package org.apache.cordova.plugin;


import android.Manifest;
import android.app.IntentService;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteException;
import android.graphics.Color;
import android.location.Location;
import android.location.LocationManager;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.util.Log;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.gson.Gson;

import com.eggersimone.mobirec.MainActivity;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.messages.Message;
import com.google.android.gms.nearby.messages.MessageListener;
import com.intentfilter.androidpermissions.PermissionManager;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeoutException;
import org.json.*;


public class BackgroundSubscribeIntentService extends IntentService {
    private static final int MESSAGES_NOTIFICATION_ID = 1;
    private static final int NUM_MESSAGES_IN_NOTIFICATION = 5;
    private LocationManager locationManager;
    private Context mContext;
    public static final String[] PERMISSIONS = {
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.ACCESS_FINE_LOCATION
    };
    public BackgroundSubscribeIntentService() {
        super("BackgroundSubscribeIntentService");
    }

    @Override
    public void onCreate() {
        super.onCreate();
        mContext = this;
    }


    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null) {
            Nearby.Messages.handleIntent(intent, new MessageListener() {
                @Override
                public void onFound(Message message) {
                    String msg = new String(message.getContent()).trim();
                    Log.i("Nearby",msg);
                    saveNearbyDevice(msg);
                }

                @Override
                public void onLost(Message message) {
                }
            });
        }
    }

    public boolean checkLocationPermission(){
        int permissionCheck = ContextCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION);
        return permissionCheck == PackageManager.PERMISSION_GRANTED;
    }




    public void startTracking() {
        if (checkLocationPermission()) {
            locationManager = (LocationManager) mContext.getSystemService(mContext.LOCATION_SERVICE);
            Location lastKnownLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        }
    }



    private void saveNearbyDevice(String message) {
        String jsonLocation = null;
        if (checkLocationPermission()) {
            locationManager = (LocationManager) mContext.getSystemService(mContext.LOCATION_SERVICE);
            Location lastKnownLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            Gson gson = new Gson();
            jsonLocation = gson.toJson(lastKnownLocation);
        }
        SQLiteDatabase db = openOrCreateDatabase("db.mobirec",MODE_PRIVATE,null);
        long time = System.currentTimeMillis();
        db.execSQL("CREATE TABLE IF NOT EXISTS NearbyDevices(Name VARCHAR,Timestamp int, Location VARCHAR, Matrix VARCHAR, Nickname VARCHAR);");

        Gson g = new Gson();

        NearbyDevice device = g.fromJson(message, NearbyDevice.class);
        Log.i("Nearby", "message found: " + message);
        Log.i("Nearby", "json message: " + device);

        ContentValues insertValues = new ContentValues();
        insertValues.put("Name", device.urlKey);
        insertValues.put("Nickname", device.nickname);
        insertValues.put("Timestamp", time);
        insertValues.put("Location", jsonLocation);
        insertValues.put("Matrix", Arrays.deepToString(device.countMin));
        db.insert("NearbyDevices", null, insertValues);

        db.close();
    }

    private void updateNotification(String message) {
        NotificationManager notificationManager =
                (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        Intent launchIntent = new Intent(getApplicationContext(), MainActivity.class);
        launchIntent.setAction(Intent.ACTION_MAIN);
        launchIntent.addCategory(Intent.CATEGORY_LAUNCHER);
        PendingIntent pi = PendingIntent.getActivity(getApplicationContext(), 0,
                launchIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        String contentTitle = "Nearby peer found";
        String contentText = message;


        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
                .setSmallIcon(android.R.drawable.star_on)
                .setContentTitle(contentTitle)
                .setContentText(contentText)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(contentText))
                .setOngoing(true)
                .setContentIntent(pi);


        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            notificationBuilder.setChannelId("my_channel_01");
            /* Create or update. */
            NotificationChannel channel = new NotificationChannel("my_channel_01",
                    "Channel human readable title",
                    NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        notificationManager.notify(MESSAGES_NOTIFICATION_ID, notificationBuilder.build());
    }
}

