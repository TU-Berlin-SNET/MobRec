

package org.apache.cordova.plugin;
import android.app.PendingIntent;
import android.content.Intent;
import android.util.Log;
import org.apache.cordova.*;
import org.apache.cordova.PluginResult;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import android.app.Activity;
import android.net.Uri;
import com.google.android.gms.nearby.Nearby;

import com.google.android.gms.nearby.messages.Message;
import com.google.android.gms.nearby.messages.MessageListener;
import com.google.android.gms.nearby.messages.Messages;
import com.google.android.gms.nearby.messages.PublishOptions;
import com.google.android.gms.nearby.messages.Strategy;
import com.google.android.gms.nearby.messages.SubscribeOptions;
import com.google.android.gms.nearby.messages.PublishCallback;
import com.google.android.gms.nearby.messages.SubscribeCallback;
import com.google.android.gms.tasks.OnFailureListener;

public class CDVNearbyPlugin extends CordovaPlugin {
    private static final String TAG = "NearbyPlugin";
    private static CallbackContext publish_callback;
    private static CallbackContext subscribe_callback;
    private static CallbackContext unsubscribe_callback;
    private static final int REQUEST_RESOLVE_ERROR = 1001;
    private static String pubMessage;
    MessageListener mMessageListener = new MessageListener() {
        @Override
        public void onFound(Message message) {
            String found_message = new String(message.getContent());
            Log.d(TAG, "found messsage: " + found_message);
            PluginResult result = new PluginResult(PluginResult.Status.OK, found_message);
            result.setKeepCallback(true);
            CDVNearbyPlugin.this.subscribe_callback.sendPluginResult(result);
        }

        @Override
        public void onLost(Message message) {
            Log.d(TAG, "message lost: " + message);
        }
    };
    OnFailureListener failListener = new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
            Log.e(TAG, e.getMessage());
        }
    };

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equals("subscribe")) {
            this.subscribe_callback = callbackContext;
            this.subscribe();
            PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
            pluginResult.setKeepCallback(true);
            this.subscribe_callback.sendPluginResult(pluginResult);
            return true;
        } else if (action.equals("unsubscribe")) {
            this.unsubscribe_callback = callbackContext;
            this.unsubscribe();
            return true;
        } else if (action.equals("publish")) {
            String message = args.getString(0);
            pubMessage = message;
            this.publish_callback = callbackContext;
            this.publish(message);
            return true;
        } else {
            return false;
        }
    }

    private PendingIntent getPendingIntent() {
        return PendingIntent.getService(cordova.getActivity().getApplicationContext(), 0,
                getBackgroundSubscribeServiceIntent(), PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private Intent getBackgroundSubscribeServiceIntent() {
        return new Intent(cordova.getActivity().getApplicationContext(), BackgroundSubscribeIntentService.class);
    }

    // Subscribe to receive messages.
    private void subscribe() {
        SubscribeOptions options = new SubscribeOptions.Builder()
                .setStrategy(Strategy.BLE_ONLY)
                .setCallback(new SubscribeCallback() {
                    @Override
                    public void onExpired() {
                        super.onExpired();
                        Log.i(TAG, "No longer subscribing");

                    }
                })
                .build();
        Nearby.getMessagesClient(cordova.getActivity()).subscribe(getPendingIntent(), options).addOnFailureListener(this.failListener);
        cordova.getActivity().getApplicationContext().startService(getBackgroundSubscribeServiceIntent());
        Log.d(TAG, "subscribed successfully");

    }

    private void publish(String message) {
        Strategy s = new Strategy.Builder()
                .setTtlSeconds(86400)
                .build();
        PublishOptions options = new PublishOptions.Builder()
                .setStrategy(s)
                .setCallback(new PublishCallback() {
                    @Override
                    public void onExpired() {
                        super.onExpired();
                        Log.i(TAG, "No longer publishing");
                        publish(pubMessage);
                    }
                }).build();
        Message mActiveMessage = new Message(message.getBytes());
        Nearby.getMessagesClient(cordova.getActivity()).publish(mActiveMessage, options).addOnFailureListener(this.failListener);
        Log.d(TAG, "published message: " + message);
        this.publish_callback.success("published message");
    }

    private void unsubscribe() {
        Nearby.getMessagesClient(cordova.getActivity()).unsubscribe(getPendingIntent());
        Log.d(TAG, "unsubscribed");
        this.unsubscribe_callback.success("unsubscribed");
    }
}
