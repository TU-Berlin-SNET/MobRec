# MobRec

Developed by [Simone Egger](https://github.com/simone0893)

## Build system

- node 8.12.0
- ionic: ^4.3.1
- cordova: ^8.1.2

### External dependencies

## iOS Setup
- XCode

Follow instructions:
https://ionicframework.com/docs/installation/ios

## Android Setup
- Android Studio
- Gradle

Follow instructions:
https://ionicframework.com/docs/installation/android


### Installation

```
npm install -g ionic
npm install -g cordova
```

## Troubleshooting
remove line from package.json file:
"cordova-plugin-mauron85-background-geolocation": "@mauron85/cordova-plugin-background-geolocation@~3.0.3"


## Quick start (run in browser)
```
npm install
npm start

```

## Prepare platforms

```
ionic cordova platform add android
ionic cordova platform add ios


```

### Run in emulator

```
npm run android
npm run ios
```

### Run on device

```
npm run android:device
npm run ios:device
```

## Modules Structure Overview
```
App
+-- Tabs (page)
|   +-- Home (page)
|   |   +-- Map
|   |   +-- Movies (page)
|   |       +-- Movie Detail (component)
|   |       +-- Movie Rating (component)
|   |   +-- Music (page)
|   |   +-- Movie Onboarding (page)
|   |
|   +-- Settings (page)
|   |   +-- Help (component)
+-- Components
    +-- movie-detai-popover
    +-- help
    +-- movie-rating
```
