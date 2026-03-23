import React, { useEffect, useState } from "react";
import {
  IonApp, IonRouterOutlet, IonPage, IonContent, IonSpinner,
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonAlert,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";

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
import Onboarding from "./pages/Onboarding";
import Reservar from "./pages/Reservar"; // <-- Importación de la nueva página

// Servicios
import { authService } from "./services/auth.service";
import { initStorage } from "./storage";
import { updateService } from "./services/update.service";

const queryClient = new QueryClient();

setupIonicReact({ mode: "md" });

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await setupStatusBar();
        await initStorage();
        
        const onboarding = await Preferences.get({ key: "onboarding_completed" });
        setHasSeenOnboarding(onboarding.value === "true");
        
        const authenticated = await authService.isAuthenticatedAsync();
        setIsAuthenticated(authenticated);
        
        setIsReady(true);
        if (Capacitor.isNativePlatform()) await SplashScreen.hide();
      } catch (error) {
        console.error("Error inicializando:", error);
        setIsReady(true);
      }
    };
    initialize();
  }, []);

  const setupStatusBar = async () => {
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({ style: Style.Dark });
      if (Capacitor.getPlatform() === "android") {
        await StatusBar.setBackgroundColor({ color: "#ffffff" });
      }
    }
  };

  if (!isReady) return (
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

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
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
                    
                    {/* RUTA PARA RESERVAR MESA (YA VINCULADA) */}
                    <RouteComp exact path="/tabs/reservar" component={Reservar} />
                    
                    {/* RUTAS TEMPORALES PARA MAPA Y USUARIOS */}
                    <RouteComp exact path="/tabs/mapa" render={() => <IonPage><IonContent className="ion-padding"><h1>Mapa de Mesas</h1></IonContent></IonPage>} />
                    <RouteComp exact path="/tabs/usuarios" render={() => <IonPage><IonContent className="ion-padding"><h1>Gestión de Usuarios</h1></IonContent></IonPage>} />
                    
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

            {/* RUTA RAÍZ */}
            <RouteComp exact path="/">
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