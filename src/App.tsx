import React, { useEffect, useState } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonPage,
  IonContent,
  IonSpinner,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonAlert,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";

// Workaround TypeScript JSX mismatch
const RouteComp: any = Route as any;
const RedirectComp: any = Redirect as any;

import { home, person } from "ionicons/icons";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { App as CapApp } from "@capacitor/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Páginas
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding"; // <-- Asegúrate de que el archivo se llame así

// Servicios
import { authService } from "./services/auth.service";
import { initStorage } from "./storage";
import { updateService } from "./services/update.service";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      gcTime: 1000 * 60 * 5,
      staleTime: 1000 * 10,
      retry: 2,
    },
  },
});

setupIonicReact({
  mode: "md",
  swipeBackEnabled: true,
});

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false); // Estado para el Onboarding
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateVersion, setUpdateVersion] = useState<string | undefined>();

  useEffect(() => {
    const handleTabChange = async () => {
      await queryClient.invalidateQueries();
    };
    document.addEventListener("ionTabsWillChange", handleTabChange);
    return () => {
      document.removeEventListener("ionTabsWillChange", handleTabChange);
    };
  }, []);

  const setupStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        const platform = Capacitor.getPlatform();
        if (platform === "android") {
          await StatusBar.setBackgroundColor({ color: "#ffffff" });
          await StatusBar.setOverlaysWebView({ overlay: true });
        } else if (platform === "ios") {
          await StatusBar.setOverlaysWebView({ overlay: true });
        }
      } catch (error) {
        console.error("Error configurando StatusBar:", error);
      }
    }
  };

  const checkForUpdates = async () => {
    try {
      const updateInfo = await updateService.checkForUpdate();
      if (updateInfo.updateAvailable) {
        setUpdateAvailable(true);
        setUpdateVersion(updateInfo.latestVersion);
      }
      await updateService.ready();
    } catch (error) {
      console.error("Error verificando actualizaciones:", error);
    }
  };

  const setupBackButton = () => {
    if (Capacitor.isNativePlatform()) {
      CapApp.addListener("backButton", ({ canGoBack }) => {
        if (!canGoBack) {
          CapApp.exitApp();
        } else {
          window.history.back();
        }
      });
    }
  };

  // Inicialización principal
  useEffect(() => {
    const initialize = async () => {
      try {
        await setupStatusBar();
        await initStorage();

        // 1. Verificar si ya vio el Onboarding
        const onboarding = await Preferences.get({ key: "onboarding_completed" });
        setHasSeenOnboarding(onboarding.value === "true");

        // 2. Sincronizar Auth
        try {
          const auth = await Preferences.get({ key: "app_kickoff_authenticated" });
          const token = await Preferences.get({ key: "app_kickoff_token" });
          const user = await Preferences.get({ key: "app_kickoff_user" });

          if (auth?.value) localStorage.setItem("app_kickoff_authenticated", auth.value);
          if (token?.value) localStorage.setItem("app_kickoff_token", token.value);
          if (user?.value) localStorage.setItem("app_kickoff_user", user.value);
        } catch (e) {
          console.warn("Error sincronizando Preferences", e);
        }

        // 3. Verificar Autenticación
        const authenticated = await authService.isAuthenticatedAsync();
        setIsAuthenticated(authenticated);

        setupBackButton();
        checkForUpdates();
        setIsReady(true);

        if (Capacitor.isNativePlatform()) {
          await SplashScreen.hide();
        }
      } catch (error) {
        console.error("Error inicializando:", error);
        setIsReady(true);
      }
    };
    initialize();

    return () => {
      CapApp.removeAllListeners();
    };
  }, []);

  const handleUpdateInstall = async () => {
    try {
      await updateService.sync();
    } catch (error) {
      console.error("Error instalando actualización:", error);
    }
    setUpdateAvailable(false);
  };

  if (!isReady) {
    return (
      <IonApp>
        <IonPage>
          <IonContent className="ion-padding ion-text-center">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <IonSpinner name="crescent" />
            </div>
          </IonContent>
        </IonPage>
      </IonApp>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonAlert
          isOpen={updateAvailable}
          header="Actualización Disponible"
          message={`Nueva versión disponible. ¿Deseas actualizar ahora?`}
          buttons={[
            { text: "Más tarde", role: "cancel" },
            { text: "Actualizar", handler: handleUpdateInstall },
          ]}
        />

        <IonReactRouter>
          <IonRouterOutlet>
            {/* RUTA DE ONBOARDING */}
            <RouteComp exact path="/onboarding" component={Onboarding} />

            {/* RUTA DE LOGIN */}
            <RouteComp exact path="/login">
              {isAuthenticated ? <RedirectComp to="/tabs/inicio" /> : <Login />}
            </RouteComp>

            {/* RUTA DE REGISTRO */}
            <RouteComp exact path="/register" component={Register} />

            {/* RUTA DE TABS (PROTEGIDA) */}
            <RouteComp path="/tabs">
              {!isAuthenticated ? (
                <RedirectComp to="/login" />
              ) : (
                <IonTabs>
                  <IonRouterOutlet>
                    <RouteComp exact path="/tabs/inicio" component={Home} />
                    <RouteComp exact path="/tabs/perfil" component={Profile} />
                    <RouteComp exact path="/tabs">
                      <RedirectComp to="/tabs/inicio" />
                    </RouteComp>
                  </IonRouterOutlet>
                  <IonTabBar slot="bottom">
                    <IonTabButton tab="inicio" href="/tabs/inicio">
                      <IonIcon icon={home} />
                      <IonLabel>Inicio</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="perfil" href="/tabs/perfil">
                      <IonIcon icon={person} />
                      <IonLabel>Perfil</IonLabel>
                    </IonTabButton>
                  </IonTabBar>
                </IonTabs>
              )}
            </RouteComp>

            {/* RUTA RAÍZ: LÓGICA DE REDIRECCIÓN PRINCIPAL */}
            <RouteComp exact path="/">
              {/* 1. ¿No ha visto onboarding? -> Onboarding
                2. ¿Ya lo vio pero no está autenticado? -> Login
                3. ¿Está autenticado? -> Home
              */}
              {!hasSeenOnboarding ? (
                <RedirectComp to="/onboarding" />
              ) : isAuthenticated ? (
                <RedirectComp to="/tabs/inicio" />
              ) : (
                <RedirectComp to="/login" />
              )}
            </RouteComp>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </QueryClientProvider>
  );
};

export default App;
