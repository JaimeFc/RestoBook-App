import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.appkickoff",
  appName: "App Kick Off",
  webDir: "dist",
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      launchFadeOutDuration: 500,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#ffffff",
      overlaysWebView: true,
    },
    LiveUpdate: {
      appId: "com.example.appkickoff",
      autoDeleteBundles: true,
      enabled: true,
      readyTimeout: 10000,
      resetOnUpdate: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    // AÑADIMOS ESTO PARA EVITAR ERRORES DE COMPILACIÓN EN RELEASE/DEBUG
    buildOptions: {
      releaseType: 'APK',
    }
  },
  ios: {
    contentInset: "always",
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
  server: {
    cleartext: true,
    androidScheme: "https",
  },
};

export default config;
