//
//  CDVNearbyPlugin.swift
//  Cordova Google Nearby Plugin
//
//  Created by Simone Egger on 05.06.19.
//  Copyright © 2019 Simone Egger
//

import Foundation
let kMyAPIKey = Bundle.main.object(forInfoDictionaryKey: "NearbyApiKey") as? String

@objc(CDVNearbyPlugin) class CDVNearbyPlugin : CDVPlugin {
    /**
     * @property
     * This class lets you check the permission state of Nearby for the app on the current device.  If
     * the user has not opted into Nearby, publications and subscriptions will not function.
     */
    var nearbyPermission: GNSPermission!
    
    /**
     * @property
     * The message manager lets you create publications and subscriptions.  They are valid only as long
     * as the manager exists.
     */
    var messageMgr: GNSMessageManager?

    var publication: GNSPublication?
    var subscription: GNSSubscription?
    
    override func pluginInitialize() {
        // Enable debug logging to help track down problems.
        GNSMessageManager.setDebugLoggingEnabled(true)
        
        // Create the message manager, which lets you publish messages and subscribe to messages
        // published by nearby devices.
        messageMgr = GNSMessageManager(apiKey: kMyAPIKey,
           paramsBlock: {(params: GNSMessageManagerParams?) -> Void in
            guard let params = params else { return }
            
            // This is called when microphone permission is enabled or disabled by the user.
            params.microphonePermissionErrorHandler = { hasError in
                if (hasError) {
                    print("Nearby works better if microphone use is allowed")
                }
            }
            // This is called when Bluetooth permission is enabled or disabled by the user.
            params.bluetoothPermissionErrorHandler = { hasError in
                if (hasError) {
                    print("Nearby works better if Bluetooth use is allowed")
                }
            }
            // This is called when Bluetooth is powered on or off by the user.
            params.bluetoothPowerErrorHandler = { hasError in
                if (hasError) {
                    print("Nearby works better if Bluetooth is turned on")
                }
            }
        })
    }
  
    
    /// Starts publishing the specified name
    @objc(publish:)
    func publish(_ command: CDVInvokedUrlCommand) {
        let msg = command.arguments[0] as? String ?? ""
        if let messageMgr = self.messageMgr {
            // Publish the name to nearby devices.
            let pubMessage: GNSMessage = GNSMessage(content: msg.data(using: .utf8,
                                                                       allowLossyConversion: true))
            publication = messageMgr.publication(with: pubMessage,
                                                 paramsBlock: { (params: GNSPublicationParams?) in
                                                    guard let params = params else { return }
                                                    params.strategy = GNSStrategy(paramsBlock: { (params: GNSStrategyParams?) in
                                                        guard let params = params else { return }
                                                        params.allowInBackground = true
                                                        params.discoveryMediums = .BLE
                })
            })
            let pluginResult = CDVPluginResult(
                status: CDVCommandStatus_OK,
                messageAs: true
            )
            self.commandDelegate!.send(
                pluginResult,
                callbackId: command.callbackId
            )
        }
    }
    
    /// unsubscribes from subscription and removes publication
    @objc(unsubscribe:)
    func unsubscribe (_ command: CDVInvokedUrlCommand) {
        publication = nil
        subscription = nil
        let pluginResult = CDVPluginResult(
            status: CDVCommandStatus_OK,
            messageAs: true
        )
        self.commandDelegate!.send(
            pluginResult,
            callbackId: command.callbackId
        )
    }
    
    /// starts scanning for nearby devices that are publishing
    /// their names.
    @objc(subscribe:)
    func subscribe(_ command: CDVInvokedUrlCommand) {
        // Subscribes to messages from nearby devices and sends them to the Cordova app.
        subscription = messageMgr?.subscription(messageFoundHandler: {[unowned self] (message: GNSMessage?) -> Void in
            let msg = String(data: message!.content, encoding: String.Encoding.utf8) as String?
            let pluginResult = CDVPluginResult(
                status: CDVCommandStatus_OK,
                messageAs: msg
            )
            pluginResult?.setKeepCallbackAs(true);
            self.commandDelegate!.send(
                pluginResult,
                callbackId: command.callbackId
            )
            }, messageLostHandler: {[unowned self](message: GNSMessage?) -> Void in
                guard let message = message else { return }
            },
            paramsBlock:{ (params: GNSSubscriptionParams?) in
                guard let params = params else { return }
                params.strategy = GNSStrategy(paramsBlock: { (params: GNSStrategyParams?) in
                    guard let params = params else { return }
                    params.allowInBackground = true
                    params.discoveryMediums = .BLE
                })
        })
    }
}
